current.search_callback = showAccountData;

function showTransactions(account_id) {
	var table = $("#transactionList");
	table.children().remove();
	
	$("#account_intro").hide(); $("#account_details").show();
	
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
	
	api.transaction.listByAccount(refresh, account_id);
}

function showAccountData(account_id) {
	current.account_id = account_id;

	function refreshAccount(data) {
		if (reportError(data)) {
			return;
		}
		var data = data.data;
		
		$("#account_id").html("#" + data.id);
		$("#account_name").html(data.firstname + " " + data.lastname);
		$("#account_promo").html(data.promo);
		if (data.staff) { $("#account_staff").show(); }
		
		var date = new Date(data.creation);
		$("#account_creation").html(formatDate(date));
	}
	
	function refreshBalance(data) {
		if (reportError(data)) {
			return;
		}
		var data = data.data;
		
		$("#account_balance").html(data.balance);
	}
	
	api.account.get(refreshAccount, current.account_id);
	api.account.balance(refreshBalance, current.account_id, true);
	
	showTransactions(account_id);
}
