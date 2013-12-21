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

from database import Account, session
from sqlalchemy import desc
from sqlalchemy.orm.exc import NoResultFound
from errors import ApiError

def freeAccountNumber():
    if session.query(Account).count() == 0:
        return 1
    else:
        result = session.query(Account).order_by("number desc").first()
        return result.number + 1

def create(firstname, lastname, promo):
    account = Account(number=freeAccountNumber(), firstname=firstname, lastname=lastname, promo=promo)
    session.add(account)
    session.commit()
    
    return account

def getAccount(id):
    account = session.query(Account).get(id)
    if account is None:
        raise ApiError("Account not found")
    return account

def deleteAccount(id):
    account = getAccount(id)
    session.delete(account)
    session.commit()
    
    return account

def getAccountByNumber(number):
    try:
        return session.query(Account).filter_by(number=number).one()
    except NoResultFound:
        raise ApiError("Account not found")

def listAccounts():
    return session.query(Account).all()

def editAccount(id, fields):
    account = getAccount(id)
    allowed = ['firstname', 'lastname', 'promo']
    
    for key in fields.keys():
        if key in allowed:
            setattr(account, key, fields[key])
    
    session.commit()
    return account