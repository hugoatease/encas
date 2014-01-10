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

from flask.ext.login import LoginManager, UserMixin, login_required, current_user, login_user, logout_user
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

from common import convert
from model import account, transaction, user
from errors import errorhandler, ApiError, MissingFieldsError
import forms

def unauthorized():
    return jsonify({'error' : 'True', 'reason' : 'Request is unauthenticated.'})
login_manager.unauthorized_handler(unauthorized)

class User(UserMixin):
    def __init__(self, id):
        self.id = id
    
    def is_active(self):
        return user.is_authorized(self.id)

    def is_authenticated(self):
        return user.is_authorized(self.id)

@login_manager.user_loader
def load_user(userid):
    return User(userid)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/admin')
def accounts():
    return render_template("admin.html")

@app.route('/login', methods=['POST'])
@errorhandler
def login():
    fields = parseData({'username', 'password'})
    result = user.login(fields['username'], fields['password'])
    if result is not None:
        login_user(User(result.token))
        return result.serialize()
    raise ApiError("Login failed : provided credentials are wrong.")

@app.route('/logout')
@errorhandler
def logout():
    logout_user()
    return None

@app.route('/account/list', methods=['GET'])
@errorhandler
def listAccounts():
    accounts = account.list()
    return [acc.serialize() for acc in accounts]

@app.route('/account/<account_id>', methods=['GET'])
@errorhandler
def getAccount(account_id):
    account_id = convert(int, account_id)
    return account.get(account_id).serialize()

@app.route('/account/number/<number>', methods=['GET'])
@errorhandler
def getAccountByNumber(number):
    number = convert(int, number)
    return account.getByNumber(number).serialize()

@app.route('/account/search/<firstname>', methods=['GET'])
@errorhandler
def searchAccount(firstname):
    return [acc.serialize() for acc in account.search(firstname)]

@app.route('/account/create', methods=['POST'])
@errorhandler
def createAccount():
    form = forms.AccountCreationForm()
    if form.validate_on_submit():
        return account.create(form.firstname.data, form.lastname.data, form.promo.data).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())

@app.route('/account/<id>/edit', methods=['POST'])
@errorhandler
def editAccount(id):
    id = convert(int, id)
    
    form = forms.AccountEditionForm()
    if form.validate_on_submit():
        fields = {'firstname' : form.firstname.data, 'lastname' : form.lastname.data, 'promo' : form.promo.data}
        return account.edit(id, fields).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())

@app.route('/account/<id>/balance', methods=['GET'])
@errorhandler
def getBalance(id):
    id = convert(int, id)
    
    return {'balance' : transaction.getBalance(id)}

@app.route('/account/<id>/calculate', methods=['GET'])
@errorhandler
def calculateBalance(id):
    id = convert(int, id)
    return {'balance' : transaction.calculateBalance(id)}

@app.route('/account/<int:account_id>/transactions', methods=['GET'])
@errorhandler
def getTransactions(account_id):
    return [tr.serialize() for tr in transaction.getByAccount(account_id)]

@app.route('/account/<int:account_id>/revoked', methods=['GET'])
@errorhandler
def revokedByAccount(account_id):
    return [tr.serialize() for tr in transaction.getByAccount(account_id, revoked=True)]

@app.route('/transaction/add', methods=['POST'])
@errorhandler
def addTransaction():
    form = forms.TransactionAddForm()
    if form.validate_on_submit():
        return transaction.add(form.account_id.data, form.cash.data).serialize()
    else:
        raise MissingFieldsError(form.errors.keys())
    

@app.route('/transaction/<id>/revoke', methods=['POST'])
@errorhandler
def revokeTransaction(id):
    id = convert(int, id)
    return transaction.revoke(id).serialize()

if __name__ == '__main__':
    app.run()
