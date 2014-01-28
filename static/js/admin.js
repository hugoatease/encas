api = api(jQuery);
transactionModel = transactionModel(current, ko, api);
var viewModels = {
    admin : adminModel(ko, api, transactionModel),
    transaction : transactionModel,
    is_admin : ko.observable()
};

transactionModel.show_account(true);

ko.applyBindings(viewModels);