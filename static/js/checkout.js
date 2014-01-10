var current = {
	account_id : undefined,
};

function reportError(data) {
	var alertbar = $("#encasAlert");
	if (data.error) {
		alertbar.css("display", "block");
		alertbar.html("<b>Erreur</b> : " + data.reason);
		return true;
	}
	alertbar.css("display", "none");
	return false;
}

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
			
			$("<td>").html(data[i].operation).appendTo(line);
			$("<td>").html(data[i].cash).appendTo(line);
			$("<td>").html(data[i].balance).appendTo(line);
		}
	}
	
	api.transaction.listByAccount(refresh, account_id);
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