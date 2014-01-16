/*
 * Encas Sales Management Javascript API
 * Copyright 2013 - Hugo Caille
 */

var api = {
    wrapper : function(callback) {
        wait.show();
        function wrapped(data) {
            var result = callback(data);
            wait.hide();
            return result;
        }
        return wrapped;
    },

	user : {
		login : function(callback, username, password) {
			var data = {'username' : username, 'password' : password};
			jQuery.post('/login', data, api.wrapper(callback));
		},
		
		logout : function(callback) {
			jQuery.get('/logout', api.wrapper(callback));
		},

        list : function(callback) {
            jQuery.get('/user/list', api.wrapper(callback));
        },

        create_admin : function(callback, username, password, password_confirm) {
            var url = '/user/admin/create';
            var data = {'username' : username, 'password' : password, 'password_confirm' : password_confirm};
            jQuery.post(url, data, api.wrapper(callback));
        },

        remove : function(callback, user_id) {
            var url = '/user/' + user_id + '/remove';
            jQuery.post(url, api.wrapper(callback));
        }
	},
	
	account : {
		list : function(callback, filter) {
            if(filter === undefined) {
                filter = "active";
            }
            var url = '/account/list/' + filter;
			jQuery.get(url, api.wrapper(callback));
		},
		
		get : function(callback, account_id) {
			var url = '/account/' + account_id;
			jQuery.get(url, api.wrapper(callback));
		},
		
		getByNumber : function(callback, account_number) {
			var url = '/account/number/' + account_number;
			jQuery.get(url, api.wrapper(callback));
		},
		
		search : function(callback, firstname) {
			var url = '/account/search/' + firstname;
			jQuery.get(url, api.wrapper(callback));
		},
		
		create : function(callback, firstname, lastname, promo, number, balance) {
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
            if (number !== undefined) {
                data['number'] = number;
            }

            if (balance !== undefined) {
                data['balance'] = balance;
            }

			jQuery.post('/account/create', data, api.wrapper(callback));
		},
		
		edit : function(callback, account_id, firstname, lastname, promo) {
			var url = '/account/' + account_id + '/edit';
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
			jQuery.post(url, data, api.wrapper(callback));
		},

        delete : function(callback, account_id) {
            var url = '/account/' + account_id + '/delete';
            jQuery.post(url, api.wrapper(callback));
        },
		
		balance : function(callback, account_id) {
			var url = '/account/' + account_id + '/calculate';
			jQuery.get(url, api.wrapper(callback));
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
			jQuery.get(url, callback);
		},

        list : function(callback) {
            jQuery.get('/transaction/list', callback);
        },
		
		add : function(callback, account_id, cash) {
			var data = {'account_id' : account_id, 'cash' : cash};
			jQuery.post('/transaction/add', data, callback);
		},
		
		revoke : function(callback, transaction_id) {
			var url = '/transaction/' + transaction_id + '/revoke';
			jQuery.post(url, callback);
		}
	}
};
