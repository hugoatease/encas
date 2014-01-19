from getpass import getpass
from model import User
from encas import app

print "Administrator account creation"
username = raw_input("Username: ")

while True:
	password = getpass("Password: ")
	confirm = getpass("Password confirmation: ")
	if password == confirm:
		break

with app.app_context():
	new = User.create(username, password)
	User(new.id).makeAdmin()
