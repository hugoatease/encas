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

from flask import Flask, jsonify, request, send_from_directory, url_for, redirect
app = Flask(__name__)
app.secret_key = "z5f6rfqb1u5o8m4lk,13wr8er78h1d5x5dgd4568rh87i8ys3c2z781136941778"
app.debug = True

from flask.ext.login import LoginManager, UserMixin, login_required, current_user, login_user, logout_user
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

from model import account, transaction, user
from common import parseData
from errors import errorhandler, ApiError

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
    return send_from_directory('static', 'index.html')

@app.route('/accounts')
def accounts():
    return send_from_directory('static', 'accounts.html')

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

@app.route('/account/<int:account_id>', methods=['GET'])
@errorhandler
def getAccount(account_id):
    return account.get(account_id).serialize()

@app.route('/account/number/<int:number>', methods=['GET'])
@errorhandler
def getAccountByNumber(number):
    return account.getByNumber(number).serialize() 

@app.route('/account/create', methods=['POST'])
@errorhandler
def createAccount():
    fields = parseData({'firstname', 'lastname', 'promo'})
    
    return account.create(fields['firstname'], fields['lastname'], fields['promo']).serialize()

@app.route('/account/<int:id>/edit', methods=['POST'])
@errorhandler
def editAccount(id):
    fields = parseData({'firstname', 'lastname', 'promo'})
    return account.edit(id, fields).serialize()

@app.route('/account/<int:id>/balance', methods=['GET'])
@errorhandler
def getBalance(id):
    return {'balance' : transaction.getBalance(id)}

@app.route('/account/<int:id>/calculate', methods=['GET'])
@errorhandler
def calculateBalance(id):
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
    fields = parseData({'account_id', 'cash'})
    return transaction.add(int(fields['account_id']), float(fields['cash'])).serialize()
    

@app.route('/transaction/<int:id>/revoke', methods=['POST'])
@errorhandler
def revokeTransaction(id):
    return transaction.revoke(id).serialize()

if __name__ == '__main__':
    app.run()
