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

from flask_wtf import Form
from wtforms import TextField, IntegerField, FloatField, BooleanField
from wtforms.validators import InputRequired, Optional, Length, EqualTo

class LoginForm(Form):
    username = TextField('Username', [InputRequired()])
    password= TextField('Password', [InputRequired()])

class SellerLoginForm(Form):
    seller_access = BooleanField('Seller logging in', [InputRequired()])

class AccountCreationForm(Form):
    firstname = TextField('First Name', [InputRequired()])
    lastname = TextField('Last Name', [InputRequired()])
    promo = TextField('Promotion', [InputRequired()])
    number = IntegerField('Account number', [Optional()])
    balance = FloatField('Initial balance', [Optional()])

class AccountEditionForm(Form):
    firstname = TextField('First Name', [InputRequired()])
    lastname = TextField('Last Name', [InputRequired()])
    promo = TextField('Promotion', [InputRequired()])

class StaffStatusForm(Form):
    staff = BooleanField('Staff member', [InputRequired()])

class TransactionAddForm(Form):
    account_id = IntegerField('Account ID', [InputRequired()])
    cash = FloatField('Cash', [InputRequired()])

class UserCreationForm(Form):
    username = TextField('Username', [InputRequired()])
    password = TextField('Password', [InputRequired(), Length(min=6), EqualTo('password_confirm')])
    password_confirm = TextField('Password confirmation', [InputRequired()])