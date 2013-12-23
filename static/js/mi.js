
// function save (name) {

// 	path = "/media/sda3/Enseignement/CIR\ II/mi/comptes/" + name + "json"
	
// 	var file = new ActiveXObject("Scripting.FileSystemObject"); 
// 	var a = file.CreateTextFile(path, true); 
// 	a.WriteLine("Salut cppFrance !"); 
// 	a.Close();	

// }

// function save_ajax (data) {
// 	$.ajax({
//         url: "save.php",
//         data: {
//             state: JSON.stringify(data) 
//         },
//         dataType: 'json',
//         type: 'POST',
//         success: function (json_object) {
//             console.log(json_object);
//             $("#data").text("Data has been saved.");
//         },
//         error: function (json_object) {
//             console.log(json_object);
//             $("#data").text("Failed to save data !");
//         }
//     }
// }


var acc = {
  "accountNumber" : "" ,
  "firstName": "",
  "lastName": "",
  "promo" : "",
  "staff": "" ,
  "balance" : "" ,
  "history": [ [1,0,5],[2,-5,0],[3,10,10],[4,15,25],[5,-50,-25] ],
}


function displayAccountData (data) {

	accountNumberE = $('#accountNumber')
	nameE = $('#name')
	promoE = $('#year')	
	hisTableE = $('#hisTable')

	accountNumberE.html(data.accountNumber)
	nameE.html(data.firstName + "  " + data.lastName)
	promoE.html(data.promo)

	var tableHtml = ""

	for (var i = 0; i <= 4; i++) {

		var tableHtmlB = ""

		var level =""
		
		if (acc.history[i][2] > 0 ){level = " class = \"success\" "};
		if (acc.history[i][2] <= 0 ){level = " class = \"warning\" "};
		if (acc.history[i][2] < -10){level = " class = \"error\" "};

		console.log(acc.history[i][2])

		tableHtml = tableHtml.concat("<tr" + level + "><td>" + acc.history[i][0] + "</td><td>" + acc.history[i][1] + "</td><td>" + acc.history[i][2] + "</td></tr>")

	}
 
	hisTableE.html(tableHtml)

}


var directInputBtnE = document.getElementById('directInputBtn')
var directInputValE = document.getElementById('directInput')

directInputListner = directInputBtnE.addEventListener('click',directInput,false)

function directInput (ev) {
	ev.preventDefault();

	if (typeof(eval(directInputValE.value)) == "number"){

		newBalance = acc.history[4][2] + eval(directInputValE.value)
		newOpNumber = acc.history[4][0] + 1

		console.log("ok")

		acc.history.shift()
		acc.history.push([newOpNumber,eval(directInputValE.value),newBalance])

		directInputValE.value = ""

		displayAccountData(acc)

	};

}

research_num(2)

function research_num(nb) {
	
	function success(data) {
		if (data.error) {
			alert("Erreur: " + data.reason);
			return;
		}
		
		acc.accountNumber = data.data.number
		acc.firstName = data.data.firstname
		acc.lastName = data.data.lastname
		acc.promo = data.data.promo

		displayAccountData(acc)
	}

	api.account.getByNumber(success,nb)

}

var search_nbE = document.getElementById('search_nb') 



// Liste des comptes
// Recup un compte precis 
// recup X dernière trans 
// creer un compte 
// supprmier un compte
// modifier une champ de compte 


// ajouter une transaction (num compte, cash)
// revoquer derniere trans

// verifier la balance (calcul avec l'historique)


