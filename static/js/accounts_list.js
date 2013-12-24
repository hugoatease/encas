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

displayAccountList();