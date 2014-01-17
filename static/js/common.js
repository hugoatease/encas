var current = {
	account_id : undefined, // Current account number
	search_callback: undefined // Callback takes account number as parameter
};

function reportError(data, ajax) {
	var alertbar = $("#encasAlert");
	if (data.error) {
		alertbar.html("<b>Erreur</b> : " + data.reason);
        alertbar.show();
		return true;
	}

    if (ajax === undefined || ajax === false) {
	    alertbar.css("display", "none");
    }

	return false;
}

function reportSuccess(message) {
    var noticebar = $("#encasSuccess");
    noticebar.find("#success_message").html("<b>Succès</b> : " + message);
    noticebar.show();
    return true;
}

function formatDate(date) {
    function zeros(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

	var day = date.getDate() + "/" + zeros((date.getMonth() + 1)) + "/" + date.getFullYear();
	var hour = zeros(date.getHours()) + ":" + zeros(date.getMinutes()) + ":" + zeros(date.getSeconds());
	return day + " - " + hour;
}

function getAccountState(balance) {
    var state;

    if (balance < -10) {
        state = "danger";
    }
    else {
        if (balance <= 0) {
            state = "warning";
        }
        else {
            state = "success";
        }
    }

    return state;
}

var wait = {
    show : function() {
        $("#wait").show();
    },

    hide : function () {
        $("#wait").hide();
    }
};

$("#encasSuccess button").click(function(ev) {
    ev.preventDefault();
    $("#encasSuccess").css("display", "none");
})

Mousetrap.bind(["g c", "g h"], function(ev) {
    ev.preventDefault();
    window.location.pathname = "/";
});

Mousetrap.bind("g a", function(ev) {
    ev.preventDefault();
    window.location.pathname = "/account";
});

Mousetrap.bind("g m", function(ev) {
    console.log("Hello");
    ev.preventDefault();
    window.location.pathname = "/admin";
});