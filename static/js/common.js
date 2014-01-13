var current = {
	account_id : undefined, // Current account number
	search_callback: undefined, // Callback takes account number as parameter
};

function reportError(data) {
	var alertbar = $("#encasAlert");
	if (data.error) {
		alertbar.html("<b>Erreur</b> : " + data.reason);
        alertbar.show();
		return true;
	}
	alertbar.css("display", "none");
	return false;
}

function reportSuccess(message) {
    var noticebar = $("#encasSuccess");
    noticebar.find("#success_message").html("<b>Succès</b> : " + message);
    noticebar.show();
    return true;
}

function formatDate(date) {
	var day = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	var hour = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	return day + " - " + hour;
}

$("#encasSuccess button").click(function(ev) {
    ev.preventDefault();
    $("#encasSuccess").css("display", "none");
})