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
        account = session.query(AccountModel).get(id)
        if account is None:
            raise ApiError("Account not found")
        return account

    @staticmethod
    def getByNumber(number):
        try:
            return session.query(AccountModel).filter_by(number=number).one()
        except NoResultFound:
            raise ApiError("Account not found")

    @staticmethod
    def search(firstname):
        filter = firstname + '%'
        return session.query(AccountModel).filter(AccountModel.firstname.ilike(filter)).all()

    @staticmethod
    def list():
        return session.query(AccountModel).all()

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