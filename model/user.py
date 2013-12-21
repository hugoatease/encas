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

from database import User, session

def create(username, password):
    user = User(username=username, password=password)
    session.add(user)
    session.commit()
    return user

def login(username, password):
    try:
        user = session.query(User).filter_by(username=username, password=password).one()
    except:
        return None
    
    if user.username != username or user.password != password:
        return None
    
    user.update_token()
    return user

def remove(id):
    user = session.query(User).get(id)
    session.delete(user)
    session.commit()
    return True

def makeAdmin(id):
    user = session.query(User).get(id)
    user.admin = True
    session.add(user)
    session.commit()
    return user

def removeAdmin(id):
    user = session.query(User).get(id)
    user.admin = False
    session.add(user)
    session.commit()
    return user

def list():
    return session.query(User).all()

def getUserByToken(token):
    q = session.query(User).filter_by(token=token)
    if q.count() == 0:
        return None
    return q.one()

def is_authorized(token, admin=False):
    user = getUserByToken(token)
    if user is None:
        return False
    
    if admin and not user.admin:
        return False
    
    return True