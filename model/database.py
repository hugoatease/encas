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

from common import Token
from datetime import datetime

from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, backref
from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import Integer, Numeric, String, DateTime, Boolean
from sqlalchemy.sql.expression import true, false

STRING_SIZE = 64

db = SQLAlchemy()
Base = db.make_declarative_base()

def serialization(result, initial=None):
    serialized = {}
    for field in result.to_serialize:
        try:
            serialized[field] = getattr(result, field)
        except AttributeError:
            pass

    for field in initial.keys():
        serialized[field] = initial[field]

    return serialized

class Account(db.Model):
    __tablename__ = 'accounts'
    id =  Column(Integer, primary_key=True, nullable=False)
    creation = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    number = Column(Integer, unique=True)
    firstname = Column(String(length=STRING_SIZE), nullable=False)
    lastname = Column(String(length=STRING_SIZE), nullable=False)
    promo = Column(String(length=STRING_SIZE))
    staff = Column(Boolean, nullable=False, default=False)

    deleted = Column(Boolean, nullable=False, default=False, server_default=false())
    
    transactions = relationship("Transaction", backref="accounts")

    to_serialize = []
    def serialize(self):
        serialized = {'id' : self.id, 'creation' : self.creation.isoformat(), 'number' : self.number,
                'firstname' : self.firstname, 'lastname' : self.lastname, 'promo' : self.promo,
                'staff' : self.staff, 'deleted' : self.deleted}

        return serialization(self, serialized)
    
    def __str__(self):
        return "<Account: #" + str(self.id) + " - " + self.lastname + " " + self.firstname + ">"

class Transaction(db.Model):
    __tablename__ = "transactions"
    id =  Column(Integer, primary_key=True, nullable=False)
    account = Column(Integer, ForeignKey('accounts.id'), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    operation = Column(Integer, nullable=False)
    cash = Column(Numeric(precision=5, scale=2), nullable=False)
    balance = Column(Numeric(precision=5, scale=2), nullable=False)

    revoked = Column(Boolean, nullable=False, default=False)
    revokes = Column(Integer, ForeignKey('transactions.id'))

    to_serialize = []
    def serialize(self):
        try:
            revokes = db.session.query(Transaction).filter_by(id=self.revokes).one()
            revokes_operation = revokes.operation
        except:
            revokes_operation = None

        serialized = {'id' : self.id, 'account_id' : self.account, 'date' : self.date.isoformat(),
                'operation' : self.operation, 'cash' : str(self.cash), 'balance' : str(self.balance),
                'revoked' : self.revoked, 'revokes' : self.revokes, 'revokes_operation' : revokes_operation}

        return serialization(self, serialized)
    
    def __str__(self):
        return "<Transaction: #" + str(self.id) + " - Cash: " + str(self.cash) + " Balance: " + str(self.balance) + ">"

class User(db.Model):
    __tablename__ = "users"
    id =  Column(Integer, primary_key=True, nullable=False)
    
    username = Column(String(length=STRING_SIZE), nullable=False, unique=True)
    password = Column(String(length=64), nullable=False)
    
    admin = Column(Boolean, nullable=False, default=False)
    suspended = Column(Boolean, nullable=False, default=False)
    
    token = Column(String(length=50), nullable=True, unique=True)
    
    def update_token(self):
        self.token = Token(length=50).make()
        db.session.add(self)
        db.session.commit()
    
    def serialize(self):
        return {'id' : self.id, 'username' : self.username, 'admin' : self.admin}

def createTables():
    for table in [Account, Transaction, User]:
        table.metadata.create_all()