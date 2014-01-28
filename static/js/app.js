api = api(jQuery);
accountModel = accountModel(current, ko, api, transactionModel);
checkoutModel = checkoutModel(current, ko, api);
transactionModel = transactionModel(current, ko,  api, accountModel);

var viewModels = {
    checkout : checkoutModel,
    account : accountModel,
    transaction : transactionModel,
    admin : adminModel(ko, api, transactionModel),
    is_admin : ko.observable()
};

viewModels.account.deleteAcc = viewModels.account.delete;
viewModels.checkout.make_checkout = function() {
        checkoutModel.checkout(transactionModel.getTransactions);
}

ko.applyBindings(viewModels);

Mousetrap.bindGlobal('escape', function(ev) {
    ev.preventDefault();
    boxes.number.hide();
    boxes.name.hide();
});