define(['knockout', 'encasapi', 'model/transaction', 'common'],
    function (ko, api, transactionModel, common) {
        var accountAdminModel = {
            accounts : ko.observableArray(),
            add_fields : {
                firstname : ko.observable(),
                lastname : ko.observable(),
                promo : ko.observable(),
                number : ko.observable(),
                balance : ko.observable()
            },

            show_number : ko.observable(true),

            displayAccounts : function(filter) {
                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }
                    var data = data.data;

                    for (var i=0; i < data.length; i++) {
                        data[i]['state'] = common.getAccountState(data[i].balance);
                    }

                   this.accounts(data);
                }
                api.account.list(refresh.bind(this), filter);
            },

            display_active : function(target) {
                this.show_number(true);
                this.displayAccounts("active");
            },

            display_deleted : function(target) {
                this.show_number(false);
                this.displayAccounts("deleted");
            },

            display_debts : function(target) {
                this.show_number(true);
                this.displayAccounts("debts");
            },

            display_staff : function(target) {
                this.show_number(true);
                this.displayAccounts("staff");
            },

            add : function(target) {
                var fields = this.add_fields;

                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }

                    common.reportSuccess("Compte " + data.data.number + " - " + data.data.lastname + " " + data.data.firstname + " créé.");
                    this.display_active();
                }

                api.account.create(refresh.bind(this), fields.firstname(), fields.lastname(), fields.promo(), fields.number(), fields.balance());
            }
        };

        var transactionAdminModel = {
            display : function(filter) {
                transactionModel.getTransactions(undefined, true);
            }
        };

        var userAdminModel = {
            users : ko.observableArray(),

            create_fields : {
                username : ko.observable(),
                password : ko.observable(),
                password_confirm : ko.observable()
            },

            create : function(target) {
                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }
                    var data = data.data;

                    var message = "L'administrateur " + data.username + " a bien été créé.";
                    common.reportSuccess(message);
                    this.displayUsers();
                }


                var fields = this.create_fields;
                api.user.create_admin(refresh.bind(this), fields.username(), fields.password(), fields.password_confirm());
            },

            displayUsers : function(target) {
                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }
                    var data = data.data;
                    this.users(data);
                }
                api.user.list(refresh.bind(this));
            },

            remove : function(target) {
                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }
                    var data = data.data;

                    var message = "Le compte " + data.username + " a bien été supprimé";
                    common.reportSuccess(message);
                    this.displayUsers();
                }

                api.user.remove(refresh.bind(this), target.id);
            }
        };

        userAdminModel.displayUsers = userAdminModel.displayUsers.bind(userAdminModel);
        userAdminModel.create = userAdminModel.create.bind(userAdminModel);
        userAdminModel.remove = userAdminModel.remove.bind(userAdminModel);

        var module = {
            account : accountAdminModel,
            transaction : transactionAdminModel,
            user : userAdminModel
        };

        accountAdminModel.display_active();

        return module;
    }
);