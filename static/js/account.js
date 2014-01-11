var accountModel = {
	id: ko.observable(),
	firstname: ko.observable(),
	lastname: ko.observable(),
	promo: ko.observable(),
	staff: ko.observable(),
	date: ko.observable(),
	balance: ko.observable(),
	
	edited: {
		firstname: ko.observable(),
		lastname: ko.observable(),
		promo: ko.observable(),
	},
	
	transactions: ko.observableArray(),
	
	visible_intro: ko.observable(true),
	visible_account_deletion: ko.observable(false),
	visible_account_edition: ko.observable(false),
	
	showAccountData: function (account_id) {
		current.account_id = account_id;
		
		this.visible_intro(false);
		this.visible_account_deletion(false);
		this.visible_account_edition(false);
	
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
	
	showEditor : function(target) {
		accountModel.visible_account_edition(true);
		this.edited.firstname(this.firstname());
		this.edited.lastname(this.lastname());
		this.edited.promo(this.promo());
	},
	
	edit : function(target) {
		function refresh(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			accountModel.showAccountData(data.id);
		}
		
		api.account.edit(refresh, current.account_id, this.edited.firstname(), this.edited.lastname(), this.edited.promo());
	},
};

accountModel.fullname = ko.computed(function() {
	return accountModel.lastname() + " " + accountModel.firstname();
});

current.search_callback = function(account_id) {
	accountModel.showAccountData.bind(accountModel)(account_id);
	accountModel.getTransactions.bind(accountModel)(account_id);
};
