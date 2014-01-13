#!/usr/bin/python

#   Encas Sales Management Server
#   Copyright 2013 - Hugo Caille
# 
#   This file is part of Encas.
# 
#   Encas is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
# 
#   Encas is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
# 
#   You should have received a copy of the GNU General Public License
#   along with Encas.  If not, see <http://www.gnu.org/licenses/>.

from flask import Flask, jsonify, request, send_from_directory, url_for, redirect, render_template
app = Flask(__name__)
app.secret_key = "z5f6rfqb1u5o8m4lk,13wr8er78h1d5x5dgd4568rh87i8ys3c2z781136941778"
app.debug = True
app.config['WTF_CSRF_ENABLED'] = False

from flask.ext.login import login_required, current_user, login_user, logout_user
from login import login_manager, UserHandler, login_required_api, admin_required
login_manager.login_view = 'login'
login_manager.init_app(app)

from common import convert
from model import Account, Transaction, User
from errors import errorhandler, ApiError, MissingFieldsError
import forms

@app.route('/')
@login_required
def home():
    return render_template("checkout.html", username=current_user.username)

@app.route('/account')
@login_required
def accounts():
    return render_template("account.html", username=current_user.username)

@app.route('/admin')
@login_required
def admin():
    return render_template("admin.html", username=current_user.username)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = forms.LoginForm()
    if forms.SellerLoginForm().validate_on_submit():
        login_user(UserHandler(seller=True))
        return redirect(request.args.get("next") or url_for("home"))

    elif form.validate_on_submit():
        user = User.login(form.username.data, form.password.data)
        if user is not None:
            login_user(UserHandler(id=user.id))
        return redirect(request.args.get("next") or url_for("home"))

    else:
        credentials = False
        if len(form.errors) > 0:
            credentials = True
        return render_template("login.html", credentials=credentials)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')

@app.route('/account/list', methods=['GET'])
@login_required_api
@errorhandler
def listAccounts():
    accounts = Account.list()
    return [acc.serialize() for acc in accounts]

@app.route('/account/<account_id>', methods=['GET'])
@login_required_api
@errorhandler
def getAccount(account_id):
    account_id = convert(int, account_id)
    return Account.get(account_id).serialize()

@app.route('/account/number/<number>', methods=['GET'])
@login_required_api
@errorhandler
def getAccountByNumber(number):
    number = convert(int, number)
    return Account.getByNumber(number).serialize()

@app.route('/account/search/<firstname>', methods=['GET'])
@login_required_api
@errorhandler
def searchAccount(firstname):
    return [acc.serialize() for acc in Account.search(firstname)]

@app.route('/account/create', methods=['POST'])
@login_required_api
@errorhandler
def createAccount():
    form = forms.AccountCreationForm()
    if form.validate_on_submit():
        return Account.create(form.firstname.data, form.lastname.data, form.promo.data).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())

@app.route('/account/<id>/edit', methods=['POST'])
@login_required_api
@errorhandler
def editAccount(id):
    id = convert(int, id)
    
    form = forms.AccountEditionForm()
    if form.validate_on_submit():
        fields = {'firstname' : form.firstname.data, 'lastname' : form.lastname.data, 'promo' : form.promo.data}
        return Account(id=id).edit(fields).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())

@app.route('/account/<id>/delete', methods=['POST'])
@login_required_api
@errorhandler
@admin_required
def deleteAccount(id):
    id = convert(int, id)

    return Account(id=id).delete().serialize()

@app.route('/account/<id>/calculate', methods=['GET'])
@login_required_api
@errorhandler
def calculateBalance(id):
    id = convert(int, id)
    return {'balance' : Transaction.calculateBalance(id)}

@app.route('/account/<int:account_id>/transactions', methods=['GET'])
@login_required_api
@errorhandler
def getTransactions(account_id):
    transactions = Transaction.getByAccount(account_id, 5)
    return [tr.serialize() for tr in transactions]

@app.route('/account/<int:account_id>/transactions/all', methods=['GET'])
@login_required_api
@errorhandler
def getAllTransactions(account_id):
    transactions = Transaction.getByAccount(account_id, None)
    return [tr.serialize() for tr in transactions]

@app.route('/transaction/add', methods=['POST'])
@login_required_api
@errorhandler
def addTransaction():
    form = forms.TransactionAddForm()
    if form.validate_on_submit():
        return Transaction.add(form.account_id.data, form.cash.data).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())
    

@app.route('/transaction/<id>/revoke', methods=['POST'])
@login_required_api
@errorhandler
def revokeTransaction(id):
    id = convert(int, id)
    return Transaction(id).revoke().serialize()

if __name__ == '__main__':
    app.run()
