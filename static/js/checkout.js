var checkoutModel = {
	balance: ko.observable(),
	checkout_price: ko.observable(),
    checkout_focus : ko.observable(false),
    show_balance : ko.observable(false),
    show_keyhelp : ko.observable(false),
	
	getBalance: function(account_id) {
		function refreshBalance(data) {
			if (reportError(data)) {
				return;
			}
			
			this.balance(data.data.balance);
            this.show_balance(true);
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
            checkoutModel.checkout_focus(false);
		}

		api.transaction.add(refresh.bind(checkoutModel), account_id, checkoutModel.checkout_price());
	}
};

Mousetrap.bind('enter', function(ev) {
    ev.preventDefault();
    checkoutModel.checkout_focus(true);
});