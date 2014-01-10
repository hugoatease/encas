current.search_callback = getTransactions;

function getTransactions(account_id) {
	var table = $("#transactionList");
	table.children().remove();
	
	function refresh(data) {
		if (reportError(data)) {
			return;
		}
		
		var data = data.data;
		
		for (var i=0; i < data.length; i++) {
			var line = $("<tr>").appendTo(table);
			if (data[i].balance < -10) { 
				line.addClass("danger");
			}
			else {
				if (data[i].balance <= 0) { 
					line.addClass("warning");
				}
				else { 
					line.addClass("success");
				}
			}
			
			var date = new Date(data[i].date);
			
			$("<td>").html(data[i].operation).appendTo(line);
			$("<td>").html(formatDate(date)).appendTo(line);
			$("<td>").html(data[i].cash + " €").appendTo(line);
			$("<td>").html(data[i].balance + " €").appendTo(line);
			
			if (!data[i].revoked) {
				$("<td>").append($("<span>").addClass("label").addClass("label-success").html("Non")).appendTo(line);
			}
			else {
				$("<td>").append($("<span>").addClass("label").addClass("label-danger").html("Oui")).appendTo(line);
			}
		}
	}
	
	function refreshBalance(data) {
		if (reportError(data)) {
			return;
		}
		
		var balance = data.data.balance;
		$("#account_balance").html(balance);
	}
	
	api.transaction.listByAccount(refresh, account_id);
	api.account.balance(refreshBalance, account_id);
}

function checkout() {
	var account_id = current.account_id;
	var cash = $("#checkout #directInput").val();
	
	function refresh(data) {
		if (reportError(data)) {
			return;
		}

		getTransactions(account_id);
		$("#checkout #directInput").val("");
	}
	
	api.transaction.add(refresh, account_id, cash);
}

$("#checkout").submit(function(ev) {
	ev.preventDefault();
	checkout();
});