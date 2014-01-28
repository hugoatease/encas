accountModel = function(current, ko, api, transactionModel) {
    var module = {
        id: ko.observable(),
        number : ko.observable(),
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
            staff: ko.observable()
        },

        visible_intro: ko.observable(true),
        visible_account_deletion: ko.observable(false),
        visible_account_edition: ko.observable(false),

        showAccountData: function (account_id) {
            current.account_id = account_id;

            this.visible_account_deletion(false);
            this.visible_account_edition(false);

            function refreshAccount(data) {
                if (reportError(data)) {
                    return;
                }
                var data = data.data;

                this.id(data.id);
                this.number("#" + data.number);
                this.firstname(data.firstname);
                this.lastname(data.lastname);
                this.promo(data.promo);
                this.staff(data.staff);

                var date = new Date(data.creation);
                this.date(formatDate(date));

                this.visible_intro(false);
            }

            function refreshBalance(data) {
                if (reportError(data)) {
                    return;
                }
                var data = data.data;

                this.balance(data.balance);
            }

            api.account.get(refreshAccount.bind(this), current.account_id);
            api.account.balance(refreshBalance.bind(this), current.account_id, true);
        },

        showEditor : function(target) {
            this.visible_account_edition(true);
            this.edited.firstname(this.firstname());
            this.edited.lastname(this.lastname());
            this.edited.promo(this.promo());
            this.edited.staff(this.staff());
        },

        edit : function(target) {
            function refresh(data) {
                if (reportError(data)) {
                    return;
                }
                console.log(this);
                var data = data.data;
                this.showAccountData(data.id);
                showAccount(data.number);
            }

            function staff_success(data) {
                if (reportError(data)) {
                    return;
                }
            }

            if (this.edited.staff() !== this.staff()) {
                api.account.staff(staff_success.bind(this), current.account_id, this.edited.staff());
            }

            api.account.edit(refresh.bind(this), current.account_id, this.edited.firstname(), this.edited.lastname(), this.edited.promo());
        },

        delete : function(target) {
            function refresh(data) {
                if (reportError(data)) {
                    return;
                }
                var data = data.data;

                this.visible_account_deletion(false);
                this.visible_intro(true);
                transactionModel.clear();

                var message = "L'utilisateur " + data.lastname + " " + data.firstname + " a été supprimé"
                reportSuccess(message);
            }

            api.account.delete(refresh.bind(this), current.account_id);
        }
    };

    module.fullname = ko.computed((function() {
        return this.lastname() + " " + this.firstname();
    }).bind(module));

    return module;
}