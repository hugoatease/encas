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

from functools import wraps
from model import User
from errors import ApiError
from flask import jsonify, current_app
from flask.ext.login import LoginManager, UserMixin, login_required, current_user
login_manager = LoginManager()

class UserHandler(UserMixin):
    def __init__(self, id=None, seller=False):
        self.id = id
        self.seller = seller
        self.__get_user()

    def get_id(self):
        if self.seller:
            return "seller"
        else:
            return self.id

    def __get_user(self):
        self.user = None
        if self.id is not None:
            self.user = User.get(self.id)
        return self.user

    @property
    def username(self):
        if self.seller:
            return "Vendeur"
        elif self.user is not None:
            return self.user.username
        else:
            return None

    def is_admin(self):
        if self.seller:
            return False

        if self.user is not None and self.user.admin:
            return True

        return False

    @property
    def admin(self):
        return self.is_admin()

    def export(self):
        if self.user is not None or self.seller:
            return self
        return None

def json_unauthorized():
    return jsonify({'error' : True, 'reason' : 'You\'re not logged in.'})

@login_manager.user_loader
def load_user(id):
    if id == "seller":
        return UserHandler(seller=True).export()

    return UserHandler(id=id).export()

def login_required_api(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if current_app.login_manager._login_disabled:
            return func(*args, **kwargs)
        elif not current_user.is_authenticated():
            return json_unauthorized()
        return func(*args, **kwargs)
    return decorated_view

def admin_required(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        if not current_user.is_admin():
            raise ApiError("Forbidden action : you must have administrator rights")
        return func(*args, **kwargs)
    return decorated_func