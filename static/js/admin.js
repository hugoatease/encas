var accountAdminModel = {
    accounts : ko.observableArray(),
    add_fields : {
        firstname : ko.observable(),
        lastname : ko.observable(),
        promo : ko.observable(),
        number : ko.observable(),
        balance : ko.observable()
    },

    displayAccounts : function(filter) {
        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            for (var i=0; i < data.length; i++) {
                data[i]['state'] = getAccountState(data[i].balance);
            }

            accountAdminModel.accounts(data);
        }
        api.account.list(refresh, filter);
    },

    display_active : function(target) {
        accountAdminModel.displayAccounts("active");
    },

    display_deleted : function(target) {
        accountAdminModel.displayAccounts("deleted");
    },

    display_debts : function(target) {
        accountAdminModel.displayAccounts("debts");
    },

    add : function(target) {
        var fields = accountAdminModel.add_fields;

        function refresh(data) {
            if (reportError(data)) {
                return;
            }

            reportSuccess("Compte " + data.data.number + " - " + data.data.lastname + " " + data.data.firstname + " créé.");
            accountAdminModel.display_active();
        }

        api.account.create(refresh, fields.firstname(), fields.lastname(), fields.promo(), fields.number(), fields.balance());
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
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            var message = "L'administrateur " + data.username + " a bien été créé.";
            reportSuccess(message);
            userAdminModel.displayUsers();
        }


        var fields = userAdminModel.create_fields;
        api.user.create_admin(refresh, fields.username(), fields.password(), fields.password_confirm());
    },

    displayUsers : function(target) {
        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;
            userAdminModel.users(data);
        }
        api.user.list(refresh);
    },

    remove : function(target) {
        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            var message = "Le compte " + data.username + " a bien été supprimé";
            reportSuccess(message);
            userAdminModel.displayUsers();
        }

        api.user.remove(refresh, target.id);
    }
};

var adminModel = {
    account : accountAdminModel,
    transaction : transactionAdminModel,
    user : userAdminModel
};

accountAdminModel.display_active();