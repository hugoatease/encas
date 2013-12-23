function getTransactions(account_id) {
	var table = $("#transactionList");
	
	function refresh(data) {
		var data = data.data;
		
		for (var i=0; i < data.length; i++) {
			var data = data[i];
			
			var line = $("<tr>").appendTo(table);
			if (data.balance <= 0) { line.addClass("warning"); }
			if (data.balance < -10) { line.addClass("error"); }
			if (data.balance > 0) { line.addClass("success"); }
			
			$("<td>").html(data.operation).appendTo(line);
			$("<td>").html(data.cash).appendTo(line);
			$("<td>").html(data.balance).appendTo(line);
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
		
		getTransactions(data.id);
	}
	
	api.account.getByNumber(refresh, number);
}

$("#searchByIDForm").submit(function(ev) {
	ev.preventDefault();
	getAccount();
});
