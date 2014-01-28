requirejs.config({
   baseUrl: 'static/js',
   urlArgs: "dev=" + (new Date()).getTime(),

   shim: {
       'mousetrap' : {
           exports: 'Mousetrap'
       },

       'math' : {
           exports : 'mathjs'
       },

       'bootstrap' : {
           deps : ['jquery']
       }
   }
});

requirejs(['require', 'knockout', 'mousetrap', 'encasapi', 'common', 'search', 'model/account', 'model/admin', 'model/checkout', 'model/transaction'],
    function(require, ko, Mousetrap) {
        var api = require('encasapi');
        var search = require('search');
        var common = require('common');
        var accountModel = require('model/account');
        var adminModel = require('model/admin');
        var checkoutModel = require('model/checkout');
        var transactionModel = require('model/transaction');

        var viewModels = {
            checkout : checkoutModel,
            account : accountModel,
            transaction : transactionModel,
            admin : adminModel,
            is_admin : ko.observable()
        };

        viewModels.account.deleteAcc = viewModels.account.delete;
        viewModels.checkout.make_checkout = function() {
                checkoutModel.checkout(transactionModel.getTransactions);
        }

        ko.applyBindings(viewModels);

        Mousetrap.bindGlobal('escape', function(ev) {
            ev.preventDefault();
            search.boxes.number.hide();
            search.boxes.name.hide();
            checkoutModel.checkout_focus(false);
        });
    }
);