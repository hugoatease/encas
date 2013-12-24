var current = {
	account_id : undefined,
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

function getTransactions(account_id) {
	var table = $("#transactionList");
	table.children().remove();
	
	function refresh(data) {
		if (reportError(data)) {
			return;
		}
		
		var data = data.data;
		
		for (var i=0; i < data.length; i++) {
			var line = $("<tr>").appendTo(table);
			if (data[i].balance < -10) { 
				line.addClass("danger");
			}
			else {
				if (data[i].balance <= 0) { 
					line.addClass("warning");
				}
				else { 
					line.addClass("success");
				}
			}
			
			$("<td>").html(data[i].operation).appendTo(line);
			$("<td>").html(data[i].cash).appendTo(line);
			$("<td>").html(data[i].balance).appendTo(line);
		}
	}
	
	api.transaction.listByAccount(refresh, account_id);
}

function getAccount() {
	var number = $("#accountNumberInput").val();
	
	function refresh(data) {
		if (reportError(data)) {
			return;
		}
		
		var data = data.data;
		$("#accountNumber").html(data.number);
		$("#name").html(data.firstname + " " + data.lastname);
		$("#year").html(data.promo);
		
		current.account_id = data.id;
		getTransactions(data.id);
	}
	
	api.account.getByNumber(refresh, number);
}

function checkout() {
	var account_id = current.account_id;
	var cash = $("#checkout #directInput").val();
	
	function refresh(data) {
		if (reportError(data)) {
			return;
		}

		getTransactions(account_id);
	}
	
	api.transaction.add(refresh, account_id, cash);
}

var boxes = {
	number : {
		visible: false,
		
		show : function() {
			this.visible = true;
			$("#search_number_box").css("display", "block");
		},
		
		hide : function() {
			this.visible = false;
			$("#search_number_box").css("display", "none");
		}
	},
	
	name : {
		visible: false,
		
		show : function() {
			this.visible = true;
			$("#search_name_box").css("display", "block");
		},
		
		hide : function() {
			this.visible = false;
			$("#search_name_box").css("display", "none");
		},
	},
	
	click : function(btnName) {
		var active, inactive;
		
		switch (btnName) {
			case "number": active = this.number; inactive = this.name; break;
			case "name": active = this.name; inactive = this.number; break;
		}
		
		if (inactive.visible) {
			inactive.hide();
		}
		
		if (!active.visible) {
			active.show();
		}
		else {
			active.hide();
		}
	}
};

$("#searchByIDForm").submit(function(ev) {
	ev.preventDefault();
	getAccount();
	boxes.number.hide();
});

$("#checkout").submit(function(ev) {
	ev.preventDefault();
	checkout();
});

$("#search_nb").click(function(ev) {
	ev.preventDefault();
	boxes.click("number");
});

$("#search_name").click(function(ev) {
	ev.preventDefault();
	boxes.click("name");
});