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

import config

from flask import Flask, request, url_for, redirect, render_template
app = Flask(__name__)
app.secret_key = config.SECRET
app.debug = config.DEBUG
app.config['WTF_CSRF_ENABLED'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI

from model.database import db
db.init_app(app)

from flask.ext.login import login_required, login_user, logout_user
from login import login_manager, UserHandler, login_required_api, admin_required
login_manager.login_view = 'login'
login_manager.init_app(app)

from logging import FileHandler, Formatter
file_handler = FileHandler(config.LOGFILE)
file_handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(file_handler)

from common import convert
from model import Account, Transaction, User
from errors import errorhandler, ApiError, MissingFieldsError
import forms

@app.route('/')
@login_required
def home():
    return render_template("checkout.html")

@app.route('/account')
@login_required
def accounts():
    return render_template("account.html")

@app.route('/admin')
@login_required
def admin():
    return render_template("admin.html")

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
        else:
            return render_template("login.html", credentials=True)

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

@app.route('/account/list/<filter>', methods=['GET'])
@login_required_api
@errorhandler
def listAccounts(filter):
    if filter == "active":
        accounts = Account.list("active")
    elif filter == "deleted":
        accounts = Account.list("deleted")
    elif filter == "debts":
        accounts = Account.list("debts")
    else:
        raise ApiError("Wrong filter, must be one of these: active, deleted, debts")

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
        account = Account.create(form.firstname.data, form.lastname.data, form.promo.data, form.number.data)

        if form.balance.data is not None:
            Transaction.add(account.id, form.balance.data)

        return account.serialize()
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

@app.route('/transaction/list', methods=['GET'])
@login_required_api
@errorhandler
def listTransaction():
    return [tr.serialize() for tr in Transaction.list()]

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

@app.route('/user/list', methods=['GET'])
@login_required_api
@errorhandler
def userList():
    return [user.serialize() for user in User.list()]

@app.route('/user/admin/create', methods=['POST'])
@login_required_api
@errorhandler
@admin_required
def adminCreation():
    form = forms.UserCreationForm()
    if form.validate_on_submit():
        user = User.create(form.username.data, form.password.data)
        User(user.id).makeAdmin()
        return user.serialize()
    else:
        raise MissingFieldsError(form.errors.keys())

@app.route('/user/<id>/remove', methods=['POST'])
@login_required_api
@errorhandler
@admin_required
def userRemove(id):
    id = convert(int, id)
    return User(id).remove().serialize()

if __name__ == '__main__':
    app.run()
