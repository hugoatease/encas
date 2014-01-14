var accountAdminModel = {
    accounts : ko.observableArray(),
    add_fields : {
        firstname : ko.observable(),
        lastname : ko.observable(),
        promo : ko.observable()
    },

    displayAccounts : function(filter) {
        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;
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

    add : function(target) {
        var fields = accountAdminModel.add_fields;

        function refresh(data) {
            if (reportError(data)) {
                return;
            }

            reportSuccess("Compte " + data.data.number + " - " + data.data.lastname + " " + data.data.firstname + " créé.");
            accountAdminModel.display_active();
        }

        api.account.create(refresh, fields.firstname(), fields.lastname(), fields.promo());
    }
};

var transactionAdminModel = {
    display : function(filter) {
        transactionModel.getTransactions(undefined, true);
    }
};

var adminModel = {
    account : accountAdminModel,
    transaction : transactionAdminModel
};

accountAdminModel.display_active();