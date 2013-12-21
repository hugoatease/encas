from getpass import getpass
from model.database import createTables
from model import user

print "Initializing database"
createTables()

print "Administrator account creation"
username = raw_input("Username: ")

while True:
	password = getpass("Password: ")
	confirm = getpass("Password confirmation: ")
	if password == confirm:
		break

new = user.create(username, password)
user.makeAdmin(new.id)
