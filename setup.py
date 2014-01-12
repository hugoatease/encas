from getpass import getpass
from model import User

print "Administrator account creation"
username = raw_input("Username: ")

while True:
	password = getpass("Password: ")
	confirm = getpass("Password confirmation: ")
	if password == confirm:
		break

new = User.create(username, password)
User(new.id).makeAdmin()