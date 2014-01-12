Encas
=====
Encas est une application web de gestion de ventes.

Elle permet de gérer un ensemble de comptes de change sur lesquels les vendeurs peuvent effectuer des transactions.

L'interface est conçue pour être réactive et communique avec le serveur via des appels AJAX.

Prérequis
=====
Le serveur est architecturé autour des composants suivants :

- [Python](http://www.python.org) 2.7
- [Flask](http://flask.pocoo.org/)
- [SQLAlchemy](http://www.sqlalchemy.org/)
- [Alembic](http://alembic.readthedocs.org/en/latest/)
- [WTForms](http://wtforms.readthedocs.org/en/latest/)

La base de données utilisée par défaut est SQLite, mais nous vous conseillons d'utiliser [PostgreSQL](http://www.postgresql.org/) en production.

Vous devrez également installer un module Python DBAPI compatible avec SQLAlchemy pour intéragir avec le serveur de base de données de votre choix. Installez [psycopg2](http://initd.org/psycopg/) dans le cas de PostgreSQL.

Toutes les dépendances du serveur sont décrites dans le fichier requirements.txt . L'installation se déroule via la commande

    pip install requirements.txt

Installation rapide
=====
Sur une distribution basée Debian, vous ouvez obtenir une instance de test rapidement en entrant les commandes


    sudo apt-get install python-pip python-virtualenv
    virtualenv env
    source ./env/bin/activate
    pip install -r requirements.txt
    alembic upgrade head
    python setup.py

L'instance de test pourra ainsi être lancée de la manière suivante

    source ./env/bin/activate
    python encas.py

Installation
=====
Préparation de l'environnement
-----
Afin d'isoler les modules Python nécessaires à Encas des modules de votre système, l'utilisation d'un [virtualenv](http://www.virtualenv.org/) est fortement conseillée.

Placez vous dans le dossier où vous avez installé Encas et initialisez l'environnement avec les commandes suivantes

    virtualenv env
    source ./env/bin/activate
    pip install -r requirements.txt

Lorsque vous voudriez invoquer le serveur de test ou installer des modules supplémentaires via *pip*, n'oubliez pas de vous placer dans le virtualenv en entrant la commande
    
    source ./env/bin/activate

Pour sortir du virtualenv, utilisez la commande
    
    deactivate

Configuration de la base de données
-----
Le moteur de base de données utilisé par défaut est SQLite, mais nous vous conseillons de déployer Encas sur PostgreSQL pour une utilisation en production.

Si vous voulez d'abord tester Encas sur la base de données SQLite, initialisez directement la base de données avec les commandes indiquées à la fin de cette section.

N'oubliez pas d'activer le *virtualenv* pour avoir accès aux modules Python requis.

Installez le module [psycopg2](http://initd.org/psycopg/) de la manière suivante
    
    pip install psycopg2

Vous trouverez ensuite dans le fichier *config.py* une variable DATABASE_URI à ajuster. Le format de l'URL est décrit dans la [documentation de SQLAlchemy](http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html).

L'URL est généralement sous la forme

    driver://user:password@host/dbname

Pour une installation d'Encas sur une base PostgreSQL sur le serveur *localhost* avec le nom d'utilisateur *encas*, le nom de base de données *encas* et le mot de passe *password*, l'URL sera la suivante

    postgresql://encas:password@localhost/encas

Une fois la base de données configurée, initialisez-là via les commandes
    
    alembic upgrade head
    python setup.py

Lancement du serveur de test
-----
Le serveur de test peut être lancé de la manière suivante
    
    python encas.py

N'oubliez pas d'activer le *virtualenv* pour avoir accès aux modules Python requis.

Déploiement sur Apache
-----
Le déploiement d'Encas sur un serveur web Apache est décrit dans le [guide de déploiement de Flask](http://flask.pocoo.org/docs/deploying/mod_wsgi/).

Mise à jour
=====
Les mises à jour du serveur sont souvent accompagnées de changement de structure de la base de données. Ne pas mettre à jour votre base de données entraînera un plantage de l'application.

N'oubliez pas d'activer le *virtualenv* pour avoir accès aux modules Python requis.

Pour vous assurer que votre base de données est compatible avec la version mise à jour, exécutez systématiquement

    alembic upgrade head

La structure de la base de données sera ainsi mise à jour en conservant toutes les données déjà présentes.

Licence
=====
Encas est mis à disposition sous licence GNU GPL v3.

Une copie de la licence est disponible dans le fichier COPYING.
