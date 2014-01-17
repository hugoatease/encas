import unittest

import sys
sys.path.append('..')

from account import Account

class AccountTest(unittest.TestCase):
    def test_create(self):
        account = Account.create("Norris", "Chuck", "M1")
        self.assertEqual(account.firstname, "Norris")
        self.assertEqual(account.lastname, "Chuck")
        self.assertEqual(account.promo, "M1")

    def test_available(self):
        available = Account.available()





if __name__ == '__main__':
    unittest.main()