var accountModel = {
	id: ko.observable(),
	firstname: ko.observable(),
	lastname: ko.observable(),
	promo: ko.observable(),
	staff: ko.observable(),
	date: ko.observable(),
	balance: ko.observable(),
	
	transactions: ko.observableArray(),
	
	show_intro: ko.observable(true),
	
	showAccountData: function (account_id) {
		current.account_id = account_id;
		
		this.show_intro(false);
	
		function refreshAccount(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			
			this.id("#" + data.id);
			this.firstname(data.firstname);
			this.lastname(data.lastname);
			this.promo(data.promo);
			this.staff(data.staff);
			
			var date = new Date(data.creation);
			this.date(formatDate(date));
		}
		
		function refreshBalance(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			
			this.balance(data.balance);
		}
		
		api.account.get(refreshAccount.bind(accountModel), current.account_id);
		api.account.balance(refreshBalance.bind(accountModel), current.account_id, true);
	},
	
	getTransactions: function(account_id) {
		function refresh(data) {
			if (reportError(data)) {
				return;
			}
			
			var data = data.data;
			
			for (var i=0; i < data.length; i++) {
				data[i].date = formatDate(new Date(data[i].date));
				
				if (data[i].balance < -10) { 
					data[i]['state'] = "danger";
				}
				else {
					if (data[i].balance <= 0) { 
						data[i]['state'] = "warning";
					}
					else { 
						data[i]['state'] = "success";
					}
				}
			}
	
			this.transactions(data);
		}
		
		api.transaction.listByAccount(refresh.bind(accountModel), account_id, true);
	},
};

accountModel.fullname = ko.computed(function() {
	return accountModel.lastname() + " " + accountModel.firstname();
});

current.search_callback = function(account_id) {
	accountModel.showAccountData.bind(accountModel)(account_id);
	accountModel.getTransactions.bind(accountModel)(account_id);
};