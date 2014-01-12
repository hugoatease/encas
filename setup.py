from getpass import getpass
from model import user

print "Administrator account creation"
username = raw_input("Username: ")

while True:
	password = getpass("Password: ")
	confirm = getpass("Password confirmation: ")
	if password == confirm:
		break

new = user.create(username, password)
user.makeAdmin(new.id)
