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
from database import Account as AccountModel
import transaction
from sqlalchemy.orm.exc import NoResultFound
from errors import ApiError

class Account:
    @staticmethod
    def available():
        if session.query(AccountModel).count() == 0:
            return 1
        else:
            result = session.query(AccountModel).order_by("number desc").first()
            return result.number + 1

    @classmethod
    def create(self, firstname, lastname, promo):
        account = AccountModel(number=self.available(), firstname=firstname, lastname=lastname, promo=promo)
        session.add(account)
        session.commit()

        return account

    @staticmethod
    def get(id):
        try:
            account = session.query(AccountModel).filter_by(id=id).one()
        except NoResultFound:
            raise ApiError("Account not found")
        return account

    @staticmethod
    def getByNumber(number):
        try:
            return session.query(AccountModel).filter_by(deleted=False).filter_by(number=number).one()
        except NoResultFound:
            raise ApiError("Account not found")

    @staticmethod
    def search(firstname):
        filter = firstname + '%'
        return session.query(AccountModel).filter_by(deleted=False).filter(AccountModel.firstname.ilike(filter)).all()

    @staticmethod
    def list(filter="active", balance=True):
        query = session.query(AccountModel).order_by("number desc")

        if filter == "active":
            query = query.filter_by(deleted=False)
        elif filter == "deleted":
            query = query.filter_by(deleted=True)
        else:
            raise ApiError("Wrong filter, must be one of these: active, deleted")

        accounts = query.all()
        if balance:
            for account in accounts:
                balance = transaction.Transaction.calculateBalance(account.id)
                account.balance = balance
                account.to_serialize.append('balance')

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

        session.commit()
        return self.account

    def delete(self):
        self.account.deleted = True
        session.add(self.account)
        session.commit()
        return self.account