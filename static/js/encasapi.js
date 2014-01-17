/*
 * Encas Sales Management Javascript API
 * Copyright 2013 - Hugo Caille
 */

var api = {
    current_calls : 0,

    wrapper : function(callback) {
        api.current_calls++;
        if (api.current_calls === 1) {
            wait.show();
        }

        function wrapped(data) {
            var result = callback(data);
            api.current_calls--;
            if (api.current_calls === 0) {
                wait.hide();
            }
            return result;
        }
        return wrapped;
    },

    ajax : function(method, url, callback, data) {
        var settings = {
            url : url,
            success : callback,
            error : this.ajaxerror(url)
        };

        if (method === undefined) { method = 'GET'; }
        settings.type = method;

        if (data !== undefined) {
            settings.data = data;
        }

        jQuery.ajax(url, settings);
    },

    ajaxerror : function(url) {
        function error(xhr, status, error) {
            var message = "Une erreur s'est produite pendant l'appel au serveur. Contactez un administrateur si elle persiste.";
            message += "<br />Addresse: " + url + ". Code d'erreur : " + xhr.status + " " + error + ".";
            message += " Statut jQuery: " + status + ".";

            wait.hide();
            this.current_calls = 0;

            reportError({
                error : true,
                reason : message
            }, true);
        }

        return error;
    },

	user : {
		login : function(callback, username, password) {
			var data = {'username' : username, 'password' : password};
            api.ajax('POST', '/login', api.wrapper(callback), data);
		},
		
		logout : function(callback) {
            api.ajax('GET', '/logout', api.wrapper(callback));
		},

        list : function(callback) {
            api.ajax('GET', '/user/list', api.wrapper(callback));
        },

        create_admin : function(callback, username, password, password_confirm) {
            var url = '/user/admin/create';
            var data = {'username' : username, 'password' : password, 'password_confirm' : password_confirm};
            api.ajax('POST', url, api.wrapper(callback), data);
        },

        remove : function(callback, user_id) {
            var url = '/user/' + user_id + '/remove';
            api.ajax('POST', url, api.wrapper(callback));
        }
	},
	
	account : {
		list : function(callback, filter) {
            if(filter === undefined) {
                filter = "active";
            }
            var url = '/account/list/' + filter;
            api.ajax('GET', url, api.wrapper(callback));
		},
		
		get : function(callback, account_id) {
			var url = '/account/' + account_id;
            api.ajax('GET', url, api.wrapper(callback));
		},
		
		getByNumber : function(callback, account_number) {
			var url = '/account/number/' + account_number;
            api.ajax('GET', url, api.wrapper(callback));
		},
		
		search : function(callback, firstname) {
			var url = '/account/search/' + firstname;
            api.ajax('GET', url, api.wrapper(callback));
		},
		
		create : function(callback, firstname, lastname, promo, number, balance) {
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
            if (number !== undefined) {
                data['number'] = number;
            }

            if (balance !== undefined) {
                data['balance'] = balance;
            }

            api.ajax('POST', '/account/create', api.wrapper(callback), data);
		},
		
		edit : function(callback, account_id, firstname, lastname, promo) {
			var url = '/account/' + account_id + '/edit';
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
            api.ajax('POST', url, api.wrapper(callback), data);
		},

        delete : function(callback, account_id) {
            var url = '/account/' + account_id + '/delete';
            api.ajax('POST', url, api.wrapper(callback));
        },
		
		balance : function(callback, account_id) {
			var url = '/account/' + account_id + '/calculate';
            api.ajax('GET', url, api.wrapper(callback));
		}
	},
	
	transaction : {
		listByAccount : function(callback, account_id, all) {
			if (!all || all === undefined) {
				var url = '/account/' + account_id + '/transactions';
			}
			else {
				var url = '/account/' + account_id + '/transactions/all';
			}
            api.ajax('GET', url, api.wrapper(callback));
		},

        list : function(callback) {
            api.ajax('GET', '/transaction/list', api.wrapper(callback));
        },
		
		add : function(callback, account_id, cash) {
			var data = {'account_id' : account_id, 'cash' : cash};
            api.ajax('POST', '/transaction/add', api.wrapper(callback), data);
		},
		
		revoke : function(callback, transaction_id) {
			var url = '/transaction/' + transaction_id + '/revoke';
            api.ajax('POST', url, api.wrapper(callback));
		}
	}
};
