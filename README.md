Encas
=====

Encas est une application web de gestion de ventes.

Elle est composée d'une interface Bootstrap/AJAX et d'une API JSON développée en Python couplée à une base de données SQLAlchemy.

Prérequis
=====

Les prérequis pour faire fonctionner le serveur sont :

- [Python](http://www.python.org) 2.7
- [Flask](http://flask.pocoo.org/)
- [SQLAlchemy](http://www.sqlalchemy.org/)
- Un serveur de base de données relationnelles supporté par SQLAlchemy, [PostgreSQL](http://www.postgresql.org/) est le choix recommandé.
- Un module DBAPI correspondant au serveur de base de données utilisé, [psycopg2](http://initd.org/psycopg/) dans le cas de PostgreSQL.

Installation rapide
=====
Pour créer une instance de test sous Debian, placez vous dans le dossier où encas a été cloné et effectuez les commandes suivantes :

- sudo apt-get install python-pip python-virtualenv
- virtualenv env
- source ./env/bin/activate
- pip install -r requirements.txt
- python setup.py

L'instance de test pourra ainsi être lancée de la manière suivante :
- source ./env/bin/activate
- python encas.py


Licence
=====
Encas est mis à disposition sous licence GNU GPL v3.

Une copie de la licence est disponible dans le fichier COPYING.
