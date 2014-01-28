define(['knockout', 'encasapi', 'math', 'mousetrap', 'common'],
    function(ko, api, mathjs, Mousetrap, common) {
        math = mathjs();

        var module = {
            balance: ko.observable(),
            checkout_price: ko.observable(),
            checkout_current: ko.observable(0),
            checkout_focus : ko.observable(false),
            show_balance : ko.observable(false),
            show_keyhelp : ko.observable(false),

            previous_price: 0,

            getBalance: function(account_id) {
                function refreshBalance(data) {
                    if (common.reportError(data)) {
                        return;
                    }

                    this.balance(data.data.balance);
                    this.show_balance(true);
                }

                api.account.balance(refreshBalance.bind(this), account_id);
            },

            getPrice : function() {
                var decimals = 2;
                var price = this.checkout_price();
                var negative = false;

                try {
                    price = math.eval(price);
                }
                catch (ex) {
                    return this.previous_price;
                }

                if (isNaN(price)) {
                    this.previous_price = 0;
                    this.checkout_current(0);
                    return 0;
                }

                if (price < 0) {
                    negative = true;
                }

                price = Math.round(Math.abs(price) * Math.pow(10, decimals)) / Math.pow(10, decimals);

                if (negative) {
                    price *= -1;
                }

                price = price.toFixed(2);

                this.checkout_current(price);
                this.previous_price = price;
                return price;
            },

            checkout: function(callback) {
                var account_id = common.current.account_id;

                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }

                    this.getBalance(account_id);
                    this.checkout_price("");
                    callback(account_id);
                    this.checkout_focus(false);
                }

                api.transaction.add(refresh.bind(this), account_id, this.getPrice());
            }
        };

        module.checkout_price.subscribe((function(value) {
            this.getPrice();
        }).bind(module));

        Mousetrap.bind('enter', function(ev) {
            ev.preventDefault();
            module.checkout_focus(true);
        });

        return module;
    }
);