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
from flask import jsonify
from sqlalchemy.exc import OperationalError

class ApiError(Exception):
    def __init__(self, reason):
        self.reason = reason
    
    def __str__(self):
        return repr(self.reason)
    
    def serialize(self):
        return {'error' : True, 'reason' : self.reason}

class MissingFieldsError(Exception):
    def __init__(self, fields):
        self.fields = fields
        self.fields.sort()
    
    def reason(self):
        fields_len = len(self.fields)
        i = 0

        msg = "Missing fields: "
        for field in self.fields:
            msg += str(field)
            if i < fields_len - 1:
                msg += ", "
            else:
                msg += "."
            i += 1

        return msg
    
    def __str__(self):
        return self.reason()
    
    def serialize(self):
        return {'error' : True, 'reason' : self.reason()}

def errorhandler(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            data = func(*args, **kwargs)
            result = {'error' : False}
            if data is not None:
                result['data'] = data
            
            return jsonify(result)
        
        except MissingFieldsError as e:
            return jsonify(e.serialize())
        except ApiError as e:
            return jsonify(e.serialize())
        except OperationalError as e:
            return jsonify({'error' : True, 'reason' : "Cannot access database"})
        except ValueError:
            return jsonify({'error' : True, 'reason' : "Invalid input"})
    return wrapper