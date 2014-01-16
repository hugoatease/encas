from os.path import join
from config import VIRTUALENV

activate_this = join(VIRTUALENV, 'bin/activate_this.py')
execfile(activate_this, dict(__file__=activate_this))

from encas import app as application