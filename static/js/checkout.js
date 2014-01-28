api = api(jQuery);
checkoutModel = checkoutModel(current, ko, api);
transactionModel = transactionModel(current, ko, api);

var viewModels = {
    checkout : checkoutModel,
    transaction : transactionModel,
    is_admin : ko.observable()
};

viewModels.checkout.make_checkout = function() {
        checkoutModel.checkout(transactionModel.getTransactions);
}

transactionModel.show_revoke(false);
transactionModel.show_all = false;

ko.applyBindings(viewModels);

current.search_callback = function(account_id) {
    transactionModel.getTransactions(account_id);
    checkoutModel.getBalance(account_id);
    checkoutModel.checkout_focus(true);
};


Mousetrap.bindGlobal('escape', function(ev) {
    ev.preventDefault();
    boxes.number.hide();
    boxes.name.hide();
    checkoutModel.checkout_focus(false);
});