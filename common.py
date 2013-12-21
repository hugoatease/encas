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

import random

class Token:
    def __init__(self, length=50, capitals = True):
        self.length = length
        self.token = str()
        self.capitals = capitals
        self.iterator = 0
        
    def genLetter(self):
        letter = random.choice('abcdefghijklmnopqrstuvwxyz')
        if self.capitals == True:
            if random.randint(0, 1) == 1:
                letter = letter.capitalize()
        return letter
    
    def genInt(self):
        return random.randint(0,9)
        
    def make(self):
        while self.iterator != self.length:
            if random.randint(0, 1) == 1:
                char = self.genInt()
            else:
                char = self.genLetter()
            char = str(char)
            self.token = self.token + char
            self.iterator = self.iterator + 1
            
        return self.token

def parseData(fields):
    result = dict()
    missing = list()
    for field in fields:
        try:
            if request.method == "GET":
                result[field] = request.args[field]
            if request.method == "POST":
                result[field] = request.form[field]
        except KeyError:
            missing.append(field)
    
    if len(missing) != 0:
        raise MissingFieldsError(missing)
    
    return result