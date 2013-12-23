current = {
	account_id : undefined,
};

function getTransactions(account_id) {
	var table = $("#transactionList");
	table.children().remove();
	
	function refresh(data) {
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

function getAccount() {
	var number = $("#accountNumberInput").val();
	
	function refresh(data) {
		var data = data.data;
		$("#accountNumber").html(data.number);
		$("#name").html(data.firstname + " " + data.lastname);
		$("#year").html(data.promo);
		
		current.account_id = data.id;
		getTransactions(data.id);
	}
	
	api.account.getByNumber(refresh, number);
}

function checkout() {
	var account_id = current.account_id;
	var cash = $("#checkout #directInput").val();
	
	function refresh(data) {
		getTransactions(account_id);
	}
	
	api.transaction.add(refresh, account_id, cash);
}

$("#searchByIDForm").submit(function(ev) {
	ev.preventDefault();
	getAccount();
});

$("#checkout").submit(function(ev) {
	ev.preventDefault();
	checkout();
});