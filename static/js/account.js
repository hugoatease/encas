api = api(jQuery);
accountModel = accountModel(current, ko, api, transactionModel);
transactionModel = transactionModel(current, ko,  api, accountModel);

var viewModels = {
    account : accountModel,
    transaction : transactionModel,
    is_admin : ko.observable()
};

viewModels.account.deleteAcc = viewModels.account.delete;

ko.applyBindings(viewModels);

current.search_callback = function(account_id) {
    accountModel.showAccountData(account_id);
    transactionModel.getTransactions(account_id);
};

Mousetrap.bindGlobal('escape', function(ev) {
    ev.preventDefault();
    boxes.number.hide();
    boxes.name.hide();
});