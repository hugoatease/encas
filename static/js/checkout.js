var checkoutModel = {
	balance: ko.observable(),
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

	checkout: function(callback) {
		var account_id = current.account_id;
		
		function refresh(data) {
			if (reportError(data)) {
				return;
			}

			this.getBalance(account_id);
			this.checkout_price("");
            callback(account_id);
		}

		api.transaction.add(refresh.bind(checkoutModel), account_id, checkoutModel.checkout_price());
	}
};