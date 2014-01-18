var transactionModel = {
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

			transactionModel.transactions(data);
		}

        if (all === true) {
            api.transaction.list(refresh.bind(transactionModel));
        }
        else {
		    api.transaction.listByAccount(refresh.bind(transactionModel), account_id, transactionModel.show_all);
        }
	},

    clear : function() {
        transactionModel.transactions.removeAll();
    },

    revoke : function(target) {
        var transaction_id = target.id;

        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            reportSuccess("L'opération " + data.operation + " a été révoquée.");

            transactionModel.getTransactions(current.account_id);
            if (accountModel !== undefined) {
                accountModel.showAccountData(current.account_id);
            }
        }

        api.transaction.revoke(refresh, transaction_id);
    }
};