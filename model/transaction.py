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

from database import session
from database import Transaction as TransactionModel

import account

class Transaction:
    @staticmethod
    def available(account_id):
        if session.query(TransactionModel).filter_by(account=account_id).count() == 0:
            return 1
        else:
            result = session.query(TransactionModel).filter_by(account=account_id).order_by("operation desc").first()
            return result.operation + 1

    @staticmethod
    def get(transaction_id):
        return session.query(TransactionModel).get(transaction_id)

    @staticmethod
    def getByAccount(account_id, max=None, exclude_revoked=False):
        account.Account.get(account_id) # Raises exception if account doesn't exist.
        query = session.query(TransactionModel).filter_by(account=account_id)
        if exclude_revoked:
            query = query.filter_by(revoked=False)
        query = query.order_by("operation desc")

        if max is not None:
            query = query.limit(max)

        return query.all()

    @classmethod
    def calculateBalance(self, account_id):
        transactions = self.getByAccount(account_id, None, True)

        cash = 0
        for transaction in transactions:
            cash += transaction.cash

        return cash

    @classmethod
    def add(self, account_id, cash):
        try:
            last = self.getByAccount(account_id, 1)[0]
        except:
            last = None

        if last is None:
            balance  = cash
        else:
            balance = last.balance + cash

        transaction = TransactionModel(account=account_id, operation=self.available(account_id), cash=cash, balance=balance)
        session.add(transaction)
        session.commit()
        return transaction

    def __init__(self, transaction_id):
        self.transaction = self.get(transaction_id)

    def revoke(self):
        self.transaction.revoked = True
        session.add(self.transaction)

        inverse = self.add(self.transaction.account, -self.transaction.cash)
        inverse.revokes = self.transaction.id
        session.add(inverse)

        session.commit()
        return self.transaction