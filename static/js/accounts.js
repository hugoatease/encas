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

$("#addAccountForm").submit(function(ev) {
	ev.preventDefault();
	addAccount();
});