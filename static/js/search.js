function showAccount(number) {
	function refresh(data) {
		if (reportError(data)) {
			return;
		}
		
		var data = data.data;
		
		$("#accountNumber").html(data.number);
		$("#name").html(data.firstname + " " + data.lastname);
		$("#year").html(data.promo);
		
		current.account_id = data.id;
		if (current.search_callback !== undefined) {
			current.search_callback(data.id);
		}
	}
	
	api.account.getByNumber(refresh, number);
}

function getAccount() {
	var number = $("#accountNumberInput").val();
	showAccount(number);
}

function searchAccountByName() {
	var name = $("#searchByNameForm #nameInput").val();
	var results = $("#search_name_box table tbody");
	
	function refresh(data) {
		function retrieve(ev) {
			ev.preventDefault();
			var target = $(ev.target);
			var number = target.closest("tr").find(".account_number:first()").html();
			showAccount(number);
			boxes.name.hide();
			results.children().remove();
		}
	
		if (reportError(data)) {
			return;
		}
				
		results.children().remove();
		
		var data = data.data;
		for (var i=0; i < data.length; i++) {
			var account = data[i];
			var line = $("<tr>").appendTo(results);
			
			$("<td>").addClass("account_number").html(account.number).appendTo(line);
			$("<td>").html(account.firstname).appendTo(line);
			$("<td>").html(account.lastname).appendTo(line);
			$("<td>").html(account.promo).appendTo(line);
			
			line.click(retrieve);
		}
	}
	
	api.account.search(refresh, name);
}

var boxes = {
	number : {
		visible: false,
		
		show : function() {
			this.visible = true;
			$("#search_number_box").css("display", "block");
			$("#search_number_box #accountNumberInput").focus();
		},
		
		hide : function() {
			this.visible = false;
			$("#search_number_box").css("display", "none");
			$("#search_number_box #accountNumberInput").val("");
		}
	},
	
	name : {
		visible: false,
		
		show : function() {
			this.visible = true;
			$("#search_name_box").css("display", "block");
			$("#searchByNameForm #nameInput").focus();
		},
		
		hide : function() {
			this.visible = false;
			$("#search_name_box").css("display", "none");
			$("#searchByNameForm #nameInput").val("");
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

$("#searchByNameForm").submit(function(ev) {
	ev.preventDefault();
	searchAccountByName();
});

$("#search_nb").click(function(ev) {
	ev.preventDefault();
	boxes.click("number");
});

$("#search_name").click(function(ev) {
	ev.preventDefault();
	boxes.click("name");
});

$("#searchByNameForm #nameInput").keyup(function(ev) {
	if ($("#searchByNameForm #nameInput").val().length > 2) {
		searchAccountByName();
	}
});