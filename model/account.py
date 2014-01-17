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
from database import Account as AccountModel
import transaction
from sqlalchemy.orm.exc import NoResultFound
from errors import ApiError

class Account:
    @staticmethod
    def available():
        if db.session.query(AccountModel).filter_by(deleted=False).count() == 0:
            return 1
        else:
            accounts = db.session.query(AccountModel).filter_by(deleted=False).order_by("number asc").all()

            previous = 0
            for account in accounts:
                if account.number > previous + 1:
                    number = previous + 1
                    break
                else:
                    number = account.number + 1

                previous = account.number

            return number

    @classmethod
    def create(self, firstname, lastname, promo, number=None):
        error = False
        if number is not None:
            try:
                self.getByNumber(number)
                # If no exception raised, account number is already taken.
                error = True
            except ApiError: # Account doesn't exist, creation can proceed
                pass
        else:
            number = self.available()

        if error:
            raise ApiError("Account number " + str(number) + " is already taken, try another one.")

        account = AccountModel(number=number, firstname=firstname, lastname=lastname, promo=promo)
        db.session.add(account)
        db.session.commit()

        return account

    @staticmethod
    def get(id):
        try:
            account = db.session.query(AccountModel).filter_by(id=id).one()
        except NoResultFound:
            raise ApiError("Account not found")
        return account

    @staticmethod
    def getByNumber(number):
        try:
            return db.session.query(AccountModel).filter_by(deleted=False).filter_by(number=number).one()
        except NoResultFound:
            raise ApiError("Account not found")

    @staticmethod
    def search(firstname):
        filter = firstname + '%'
        return db.session.query(AccountModel).filter_by(deleted=False).filter(AccountModel.firstname.ilike(filter)).all()

    @staticmethod
    def list(filter="active", balance=True):
        query = db.session.query(AccountModel).order_by("number desc")

        if filter not in ['active', 'deleted', 'debts']:
            raise ApiError("Wrong filter, must be one of these: active, deleted, debts")

        if filter == "active" or filter=="debts":
            query = query.filter_by(deleted=False)
        elif filter == "deleted":
            query = query.filter_by(deleted=True)

        accounts = query.all()
        if balance or filter == "debts":
            for account in accounts:
                balance = transaction.Transaction.calculateBalance(account.id)
                account.balance = balance
                account.to_serialize.append('balance')

        if filter == "debts":
            all = list(accounts)
            accounts = list()
            for account in all:
                if account.balance < 0:
                    accounts.append(account)

        return accounts

    def __init__(self, id=None, number=None):
        if id is not None:
            self.account = self.get(id)
        elif number is not None:
            self.account = self.getByNumber(number)
        else:
            raise ApiError("You must provide an account ID or number")

    def edit(self, fields):
        allowed = ['firstname', 'lastname', 'promo']

        for key in fields.keys():
            if key in allowed:
                setattr(self.account, key, fields[key])

        db.session.commit()
        return self.account

    def delete(self):
        self.account.number = None
        self.account.deleted = True
        db.session.add(self.account)
        db.session.commit()
        return self.account