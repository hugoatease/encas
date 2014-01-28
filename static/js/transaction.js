transactionModel = function(current, ko, api, accountModel) {
    var module = {
        transactions: ko.observableArray(),
        show_revoke: ko.observable(true),
        show_account : ko.observable(false),

        show_all : true,

        getTransactions: function(account_id, all) {
            function refresh(data) {
                if (reportError(data)) {
                    return;
                }

                var data = data.data;

                for (var i=0; i < data.length; i++) {
                    data[i].date = formatDate(new Date(data[i].date));
                    data[i]['state'] = getAccountState(data[i].balance);
                }

                this.transactions(data);
            }

            if (all === true) {
                api.transaction.list(refresh.bind(this));
            }
            else {
                api.transaction.listByAccount(refresh.bind(this), account_id, this.show_all);
            }
        },

        clear : function() {
            this.transactions.removeAll();
        },

        revoke : function(target) {
            var transaction_id = target.id;

            function refresh(data) {
                if (reportError(data)) {
                    return;
                }
                var data = data.data;

                reportSuccess("L'opération " + data.operation + " a été révoquée.");

                if (current.account_id !== undefined) {
                    this.getTransactions(current.account_id);
                }
                else {
                    this.getTransactions(undefined, true);
                }

                if (accountModel !== undefined) {
                    accountModel.showAccountData(current.account_id);
                }
            }

            api.transaction.revoke(refresh.bind(this), transaction_id);
        }
    };

    module.revoke = module.revoke.bind(module);
    module.getTransactions = module.getTransactions.bind(module);

    return module;
}