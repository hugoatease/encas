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

# @app.route('/account/<int:id>/delete', methods=['POST'])
# @errorhandler
# def deleteAccount(id):
#     return account.delete(id).serialize()

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

# @app.route('/transaction/<int:id>/unrevoke', methods=['POST'])
# @errorhandler
# def unrevokeTransaction(id):
#     return transaction.unrevoke(id).serialize()

if __name__ == '__main__':
    app.run()