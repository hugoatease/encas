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
from database import User as UserModel
from sqlalchemy.exc import IntegrityError
from errors import ApiError

from hashlib import sha1

class User:
    @staticmethod
    def create(username, password):
        password = sha1(password).hexdigest()
        user = UserModel(username=username, password=password)
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise ApiError("Error during account creation")

        return user

    @staticmethod
    def login(username, password):
        password = sha1(password).hexdigest()
        try:
            user = db.session.query(UserModel).filter_by(username=username, password=password, suspended=False).one()
        except:
            return None

        if user.username != username or user.password != password:
            return None

        user.update_token()
        return user

    @staticmethod
    def get(user_id):
        return db.session.query(UserModel).get(user_id)

    @staticmethod
    def getByUsername(username):
        return db.session.query(UserModel).filter_by(username=username).one()

    @staticmethod
    def list():
        return db.session.query(UserModel).filter_by(suspended=False).all()

    @staticmethod
    def getByToken(token):
        q = db.session.query(User).filter_by(token=token, suspended=False)
        if q.count() == 0:
            return None
        return q.one()

    @classmethod
    def is_authorized(self, token, admin=False):
        user = self.getByToken(token)
        if user is None:
            return False

        if admin and not user.admin:
            return False

        return True

    def __init__(self, id):
        self.user = self.get(id)

    def remove(self):
        db.session.delete(self.user)
        db.session.commit()
        return self.user

    def makeAdmin(self):
        self.user.admin = True
        db.session.add(self.user)
        db.session.commit()
        return self.user

    def removeAdmin(self):
        self.user.admin = False
        db.session.add(self.user)
        db.session.commit()
        return self.user