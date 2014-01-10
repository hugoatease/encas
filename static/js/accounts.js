function addAccount() {
	var result = $("#addAccountForm .apiresult:first");
	var firstname = $("#addAccountForm [name='firstname']").val();
	var lastname = $("#addAccountForm [name='lastname']").val();
	var promo = $("#addAccountForm [name='promo']").val();
	
	function success(data) {
		if (data.error) {
			result.html("Erreur: " + data.reason);
			return;
		}
		
		result.html("Compte " + data.data.number + " " + data.data.firstname + " " + data.data.lastname + " créé.");
	}
	
	api.account.create(success, firstname, lastname, promo);
}

function displayAccountList () {
	function success(data) {
		if (data.error) {
			result.html("Erreur: " + data.reason);
			return;
		}

		var table = $('#hisTable');
		for (var i = 0; i <= data.data.length -1 ; i++) {
			var line = $("<tr>").appendTo(table);
			$("<td>").html(data.data[i].number).appendTo(line);
			$("<td>").html(data.data[i].firstname + " " + data.data[i].lastname).appendTo(line);
		}
	}

	api.account.list(success);
}

$("#addAccountForm").submit(function(ev) {
	ev.preventDefault();
	addAccount();
});

displayAccountList();