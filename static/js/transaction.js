var transactionModel = {
    transactions: ko.observableArray(),

    getTransactions: function(account_id) {
		function refresh(data) {
			if (reportError(data)) {
				return;
			}

			var data = data.data;

			for (var i=0; i < data.length; i++) {
				data[i].date = formatDate(new Date(data[i].date));

				if (data[i].balance < -10) {
					data[i]['state'] = "danger";
				}
				else {
					if (data[i].balance <= 0) {
						data[i]['state'] = "warning";
					}
					else {
						data[i]['state'] = "success";
					}
				}
			}

			transactionModel.transactions(data);
		}

		api.transaction.listByAccount(refresh.bind(transactionModel), account_id);
	}
};