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

from database import db
from database import Transaction as TransactionModel
from database import Account as AccountModel
from errors import ApiError

from math import isinf
import account

class Transaction:
    @staticmethod
    def available(account_id):
        if db.session.query(TransactionModel).filter_by(account=account_id).count() == 0:
            return 1
        else:
            result = db.session.query(TransactionModel).filter_by(account=account_id).order_by("operation desc").first()
            return result.operation + 1

    @staticmethod
    def get(transaction_id):
        result = db.session.query(TransactionModel).get(transaction_id)
        if result is None:
            raise ApiError("Transaction not found")

        return result

    @staticmethod
    def list():
        transactions = db.session.query(TransactionModel).join(AccountModel, AccountModel.id == TransactionModel.account) \
            .filter(AccountModel.deleted == False).order_by("date desc").all()

        for transaction in transactions:
            acc = account.Account.get(transaction.account)
            transaction.account_number = acc.number
            transaction.account_firstname = acc.firstname
            transaction.account_lastname = acc.lastname

            transaction.to_serialize += ['account_number', 'account_firstname', 'account_lastname']
        return transactions

    @staticmethod
    def getByAccount(account_id, max=None, exclude_revoked=False):
        account.Account.get(account_id) # Raises exception if account doesn't exist.
        query = db.session.query(TransactionModel).filter_by(account=account_id)
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
        if isinf(cash):
            raise ApiError("Transaction can't be created : entered price is too big.")

        try:
            last = self.getByAccount(account_id, 1)[0]
        except:
            last = None

        if last is None:
            balance  = cash
        else:
            balance = last.balance + cash

        if isinf(balance):
            raise ApiError("Transaction can't be created : new account balance is out of bounds.")

        transaction = TransactionModel(account=account_id, operation=self.available(account_id), cash=cash, balance=balance)
        db.session.add(transaction)
        db.session.commit()
        return transaction

    def __init__(self, transaction_id):
        self.transaction = self.get(transaction_id)

    def revoke(self):
        self.transaction.revoked = True
        db.session.add(self.transaction)

        inverse = self.add(self.transaction.account, -self.transaction.cash)
        inverse.revokes = self.transaction.id
        db.session.add(inverse)

        db.session.commit()
        return self.transaction