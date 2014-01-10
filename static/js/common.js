var current = {
	account_id : undefined, // Current account number
	search_callback: undefined, // Callback takes account number as parameter
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

function formatDate(date) {
	var day = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	var hour = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	return day + " - " + hour;
}
