var math = mathjs();

var checkoutModel = {
	balance: ko.observable(),
	checkout_price: ko.observable(),
    checkout_current: ko.observable(0),
    checkout_focus : ko.observable(false),
    show_balance : ko.observable(false),
    show_keyhelp : ko.observable(false),

    previous_price: 0,
	
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

    getPrice : function() {
        var decimals = 2;
        var price = checkoutModel.checkout_price();
        var negative = false;

        try {
            price = math.eval(price);
        }
        catch (ex) {
            return checkoutModel.previous_price;
        }

        if (isNaN(price)) {
            checkoutModel.previous_price = 0;
            checkoutModel.checkout_current(0);
            return 0;
        }

        if (price < 0) {
            negative = true;
        }

        price = Math.round(Math.abs(price) * Math.pow(10, decimals)) / Math.pow(10, decimals);

        if (negative) {
            price *= -1;
        }

        checkoutModel.checkout_current(price);
        checkoutModel.previous_price = price;
        return price;
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

		api.transaction.add(refresh.bind(checkoutModel), account_id, checkoutModel.getPrice());
	}
};

checkoutModel.checkout_price.subscribe(function(value) {
    checkoutModel.getPrice();
});

Mousetrap.bind('enter', function(ev) {
    ev.preventDefault();
    checkoutModel.checkout_focus(true);
});