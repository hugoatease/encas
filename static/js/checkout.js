var checkoutModel = {
	balance: ko.observable(),
	transactions: ko.observableArray(),
	checkout_price: ko.observable(),
	
	getBalance: function(account_id) {
		function refreshBalance(data) {
			if (reportError(data)) {
				return;
			}
			
			this.balance(data.data.balance);
		}
		
		api.account.balance(refreshBalance.bind(checkoutModel), account_id);
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
		
		api.transaction.listByAccount(refresh.bind(checkoutModel), account_id);
	},
	
	checkout: function() {
		var account_id = current.account_id;
		
		function refresh(data) {
			if (reportError(data)) {
				return;
			}
	
			this.getTransactions(account_id);
			this.getBalance(account_id);
			this.checkout_price("");
		}
		
		api.transaction.add(refresh.bind(checkoutModel), account_id, checkoutModel.checkout_price);
	}
};

current.search_callback = function(account_id) {
	checkoutModel.getTransactions(account_id);
	checkoutModel.getBalance(account_id);
};