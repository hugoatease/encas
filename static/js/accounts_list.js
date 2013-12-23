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

			var level = " id = \"success\" "
			
			// if (acc.history[i][2] > 0 ){level = " class = \"success\" "};
			// if (acc.history[i][2] <= 0 ){level = " class = \"warning\" "};
			// if (acc.history[i][2] < -10){level = " class = \"error\" "};

			tableHtml = tableHtml.concat("<tr" + level + "><td>" + data.data[i].number + "</td> <td>" + data.data[i].firstname +" " + data.data[i].lastname + "</td> </tr>")
		}
 
		hisTableE.html(tableHtml)

		console.log(data)
		console.log(tableHtml)
		console.log(data.data[0].firstname)

	}

	api.account.list(success)

}

displayAccountList()