/*
 * Encas Sales Management Javascript API
 * Copyright 2013 - Hugo Caille
 */

var api = {
	user : {
		login : function(callback, username, password) {
			var data = {'username' : username, 'password' : password};
			jQuery.post('/login', data, callback);
		},
		
		logout : function(callback) {
			jQuery.get('/logout', callback);
		}
	},
	
	account : {
		list : function(callback) {
			jQuery.get('/account/list', callback);
		},
		
		get : function(callback, account_id) {
			var url = '/account/' + account_id;
			jQuery.get(url, callback);
		},
		
		getByNumber : function(callback, account_number) {
			var url = '/account/number/' + account_number;
			jQuery.get(url, callback);
		},
		
		search : function(callback, firstname) {
			var url = '/account/search/' + firstname;
			jQuery.get(url, callback);
		},
		
		create : function(callback, firstname, lastname, promo) {
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
			jQuery.post('/account/create', data, callback);
		},
		
		edit : function(calllback, account_id, firstname, lastname, promo) {
			var url = '/account/' + account_id + '/edit';
			var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
			jQuery.post(url, data, callback);
		},
		
		balance : function(callback, account_id, calculate) {
			if (calculate === false || calculate === undefined) {
				var url = '/account/' + account_id + '/balance';
			}
			else {
				var url = '/account/' + account_id + '/calculate';
			}
			jQuery.get(url, callback);
		}
	},
	
	transaction : {
		listByAccount : function(callback, account_id, revoked) {
			if (revoked === true) {
				var url = '/account/' + account_id + '/transactions';
			}
			else {
				var url = '/account/' + account_id + '/transactions';
			}
			jQuery.get(url, callback);
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