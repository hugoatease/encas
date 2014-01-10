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

from database import Transaction, session
from sqlalchemy import desc

import account

def freeNumber():
    if session.query(Transaction).count() == 0:
        return 1
    else:
        result = session.query(Transaction).order_by("operation desc").first()
        return result.operation + 1

def getByAccount(account_id, max=None):
    account.get(account_id) # Raises exception if account doesn't exist.
    query = session.query(Transaction).filter_by(account=account_id) \
            .order_by("operation desc")
    
    if max is not None:
        query = query.limit(max)
    
    return query.all()

def getBalance(account_id):
    transactions = getByAccount(account_id, 1)
    if len(transactions) == 0:
        return 0

    return transactions[0].balance

def calculateBalance(account_id):
    transactions = getByAccount(account_id, None)
    
    cash = 0
    for transaction in transactions:
        cash += transaction.cash
    
    return cash

def add(account_id, cash):
    try:
        last = getByAccount(account_id, 1)[0]
    except:
        last = None
    
    if last is None:
        balance  = cash
    else:
        balance = last.balance + cash
    
    transaction = Transaction(account=account_id, operation=freeNumber(), cash=cash, balance=balance)
    session.add(transaction)
    session.commit()
    return transaction

def revoke(transaction_id):
    transaction = session.query(Transaction).get(transaction_id)
    transaction.revoked = True
    session.add(transaction)
    session.commit()
    return transaction

def unrevoke(transaction_id):
    transaction = session.query(Transaction).get(transaction_id)
    transaction.revoked = False
    session.add(transaction)
    session.commit()
    return transaction