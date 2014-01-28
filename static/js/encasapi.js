/*
 * Encas Sales Management Javascript API
 * Copyright 2013 - Hugo Caille
 */

define(['jquery', 'common'],
    function(jQuery, common) {
        var module = {
            current_calls : 0,

            wrapper : function(callback) {
                module.current_calls++;
                if (module.current_calls === 1) {
                    common.wait.show();
                    common.reportError();
                }

                function wrapped(data) {
                    if (callback !== undefined) {
                        var result = callback(data);
                    }
                    module.current_calls--;
                    if (module.current_calls === 0) {
                        common.wait.hide();
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

                    common.wait.hide();
                    this.current_calls = 0;

                    common.reportError({
                        error : true,
                        reason : message
                    });
                }

                return error;
            },

            user : {
                login : function(callback, username, password) {
                    var data = {'username' : username, 'password' : password};
                    module.ajax('POST', '/login', module.wrapper(callback), data);
                },

                logout : function(callback) {
                    module.ajax('GET', '/logout', module.wrapper(callback));
                },

                list : function(callback) {
                    module.ajax('GET', '/user/list', module.wrapper(callback));
                },

                create_admin : function(callback, username, password, password_confirm) {
                    var url = '/user/admin/create';
                    var data = {'username' : username, 'password' : password, 'password_confirm' : password_confirm};
                    module.ajax('POST', url, module.wrapper(callback), data);
                },

                remove : function(callback, user_id) {
                    var url = '/user/' + user_id + '/remove';
                    module.ajax('POST', url, module.wrapper(callback));
                }
            },

            account : {
                list : function(callback, filter) {
                    if(filter === undefined) {
                        filter = "active";
                    }
                    var url = '/account/list/' + filter;
                    module.ajax('GET', url, module.wrapper(callback));
                },

                get : function(callback, account_id) {
                    var url = '/account/' + account_id;
                    module.ajax('GET', url, module.wrapper(callback));
                },

                getByNumber : function(callback, account_number) {
                    var url = '/account/number/' + account_number;
                    module.ajax('GET', url, module.wrapper(callback));
                },

                search : function(callback, firstname) {
                    firstname = encodeURIComponent(firstname);
                    var url = '/account/search/' + firstname;
                    module.ajax('GET', url, module.wrapper(callback));
                },

                create : function(callback, firstname, lastname, promo, number, balance) {
                    var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
                    if (number !== undefined) {
                        data['number'] = number;
                    }

                    if (balance !== undefined) {
                        data['balance'] = balance;
                    }

                    module.ajax('POST', '/account/create', module.wrapper(callback), data);
                },

                edit : function(callback, account_id, firstname, lastname, promo) {
                    var url = '/account/' + account_id + '/edit';
                    var data = {'firstname' : firstname, 'lastname' : lastname, 'promo' : promo};
                    module.ajax('POST', url, module.wrapper(callback), data);
                },

                staff : function(callback, account_id, status) {
                    var url = '/account/' + account_id + '/staff';
                    var data = {'staff' : status};
                    module.ajax('POST', url, module.wrapper(callback), data);
                },

                delete : function(callback, account_id) {
                    var url = '/account/' + account_id + '/delete';
                    module.ajax('POST', url, module.wrapper(callback));
                },

                balance : function(callback, account_id, calculate) {
                    if (calculate === undefined || calculate === false) {
                        var url = '/account/' + account_id + '/balance';
                    }
                    else {
                        var url = '/account/' + account_id + '/calculate';
                    }
                    module.ajax('GET', url, module.wrapper(callback));
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
                    module.ajax('GET', url, module.wrapper(callback));
                },

                list : function(callback) {
                    module.ajax('GET', '/transaction/list', module.wrapper(callback));
                },

                add : function(callback, account_id, cash) {
                    var data = {'account_id' : account_id, 'cash' : cash};
                    module.ajax('POST', '/transaction/add', module.wrapper(callback), data);
                },

                revoke : function(callback, transaction_id) {
                    var url = '/transaction/' + transaction_id + '/revoke';
                    module.ajax('POST', url, module.wrapper(callback));
                }
            }
        };

        return module;
    }
);