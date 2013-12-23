function displayAccountList () {

	function success(data) {
		if (data.error) {
			result.html("Erreur: " + data.reason);
			return;
		}

		hisTableE = $('#hisTable')

		var tableHtml = ""

		for (var i = 0; i <= data.data.length -1 ; i++) {

			var tableHtmlB = ""

			var level = "success"
			
			// if (acc.history[i][2] > 0 ){level = " class = \"success\" "};
			// if (acc.history[i][2] <= 0 ){level = " class = \"warning\" "};
			// if (acc.history[i][2] < -10){level = " class = \"error\" "};

			tableHtml = tableHtml.concat("<tr" + level + "><td>" + data.data[i].number + "</td> <td>" + data.data[i].firstName +" " + data.data[i].lastName + "</td> </tr>")
		}
 
		hisTableE.html(tableHtml)

		console.log(data)
		console.log(tableHtml)
		console.log(data.data[0].number)

	}

	api.account.list(success)

}

displayAccountList()