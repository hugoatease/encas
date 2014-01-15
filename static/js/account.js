var accountModel = {
	id: ko.observable(),
	firstname: ko.observable(),
	lastname: ko.observable(),
	promo: ko.observable(),
	staff: ko.observable(),
	date: ko.observable(),
	balance: ko.observable(),
	
	edited: {
		firstname: ko.observable(),
		lastname: ko.observable(),
		promo: ko.observable()
	},
	
	visible_intro: ko.observable(true),
	visible_account_deletion: ko.observable(false),
	visible_account_edition: ko.observable(false),
	
	showAccountData: function (account_id) {
		current.account_id = account_id;
		
		this.visible_intro(false);
		this.visible_account_deletion(false);
		this.visible_account_edition(false);
	
		function refreshAccount(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			
			this.id("#" + data.id);
			this.firstname(data.firstname);
			this.lastname(data.lastname);
			this.promo(data.promo);
			this.staff(data.staff);
			
			var date = new Date(data.creation);
			this.date(formatDate(date));
		}
		
		function refreshBalance(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			
			this.balance(data.balance);
		}
		
		api.account.get(refreshAccount.bind(accountModel), current.account_id);
		api.account.balance(refreshBalance.bind(accountModel), current.account_id, true);
	},

	showEditor : function(target) {
		accountModel.visible_account_edition(true);
		accountModel.edited.firstname(accountModel.firstname());
		accountModel.edited.lastname(accountModel.lastname());
		accountModel.edited.promo(accountModel.promo());
	},
	
	edit : function(target) {
		function refresh(data) {
			if (reportError(data)) {
				return;
			}
			var data = data.data;
			accountModel.showAccountData(data.id);
		}
		
		api.account.edit(refresh, current.account_id, accountModel.edited.firstname(), accountModel.edited.lastname(), accountModel.edited.promo());
	},

    delete : function(target) {
        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            accountModel.visible_account_deletion(false);
            accountModel.visible_intro(true);
            transactionModel.clear();

            var message = "L'utilisateur " + data.lastname + " " + data.firstname + " a été supprimé"
            reportSuccess(message);
        }

        api.account.delete(refresh, current.account_id);
    }
};

accountModel.fullname = ko.computed(function() {
	return accountModel.lastname() + " " + accountModel.firstname();
});