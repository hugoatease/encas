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

from flask import Flask, jsonify, request, redirect
app = Flask(__name__)
app.debug = True

from model import account, transaction
from common import parseData
from errors import errorhandler

@app.route('/')
def home():
    return redirect('https://github.com/hugoatease/encas')

@app.route('/account/list')
@errorhandler
def listAccounts():
    accounts = account.listAccounts()
    return [acc.serialize() for acc in accounts]

@app.route('/account/<int:account_id>')
@errorhandler
def getAccount(account_id):
    return account.getAccount(account_id).serialize()

@app.route('/account/number/<int:number>')
@errorhandler
def getAccountByNumber(number):
    return account.getAccountByNumber(number).serialize() 

@app.route('/account/create')
@errorhandler
def createAccount():
    fields = parseData({'firstname', 'lastname', 'promo'})
    
    return account.create(fields['firstname'], fields['lastname'], fields['promo']).serialize()

# @app.route('/account/<int:id>/delete')
# @errorhandler
# def deleteAccount(id):
#     return account.deleteAccount(id).serialize()

@app.route('/account/<int:id>/edit')
@errorhandler
def editAccount(id):
    fields = parseData({'firstname', 'lastname', 'promo'})
    return account.editAccount(id, fields).serialize()

@app.route('/account/<int:id>/balance')
@errorhandler
def getBalance(id):
    return {'balance' : transaction.getBalance(id)}

@app.route('/account/<int:id>/calculate')
@errorhandler
def calculateBalance(id):
    return {'balance' : transaction.calculateBalance(id)}

@app.route('/account/<int:account_id>/transactions')
@errorhandler
def getTransactions(account_id):
    return [tr.serialize() for tr in transaction.getByAccount(account_id)]

@app.route('/account/<int:account_id>/revoked')
@errorhandler
def revokedByAccount(account_id):
    return [tr.serialize() for tr in transaction.getByAccount(account_id, revoked=True)]

@app.route('/transaction/add')
@errorhandler
def addTransaction():
    fields = parseData({'account_id', 'cash'})
    return transaction.add(int(fields['account_id']), float(fields['cash'])).serialize()
    

@app.route('/transaction/<int:id>/revoke')
@errorhandler
def revokeTransaction(id):
    return transaction.revoke(id).serialize()

# @app.route('/transaction/<int:id>/unrevoke')
# @errorhandler
# def unrevokeTransaction(id):
#     return transaction.unrevoke(id).serialize()

if __name__ == '__main__':
    app.run()