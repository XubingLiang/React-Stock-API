from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from stock_api.models import Record

signup_detail = {
  'username': 'test_user',
  'password1': 'Test123123',
  'password2': 'Test123123',
  'email': 'test@gmail.com',
  'first_name': 'Hello',
  'last_name': 'World',
}

record = {
    'symbol': 'AAPL',
    'amount': 2,
    'price': 50,
    'type': 'SELL'
}

class UserTestCase(APITestCase):
  def test_signup(self):
    response = self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)

  def test_login_with_correct_detail(self):
    self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
    login_detail = {
      'username': 'test_user',
      'password': 'Test123123',      
    }
    response = self.client.post('/stock_api/auth/login/', login_detail, format='json')
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_login_with_incorrect_detail(self):
    self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
    login_detail = {
      'username': 'test_userfdfdf',
      'password': 'Test123123',      
    }
    response = self.client.post('/stock_api/auth/login/', login_detail, format='json')
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

  def test_login_with_not_exist_user(self):
    login_detail = {
      'username': 'test_userfdfdf',
      'password': 'Test123123',      
    }
    response = self.client.post('/stock_api/auth/login/', login_detail, format='json')
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  


class RecordTest(APITestCase):
    def setUp(self):
      self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
      user = User.objects.get(username='test_user')
      self.client.force_authenticate(user=user)
      r1 = Record(profile=user.profile, symbol='AAPL', type='BUY', price=100, amount=1)
      r1.save()
      r2 = Record(profile=user.profile,symbol='AAPL', type='BUY', price=100, amount=2)
      r2.save()
      r3 = Record(profile=user.profile,symbol='MSFT', type='SELL', price=120, amount=1)
      r3.save()
      self.assertEqual(len(user.profile.records.all()), 3)

    def test_get_all_record(self):
      user = User.objects.get(username='test_user') 
      self.client.force_authenticate(user=user)
      response = self.client.get('/stock_api/users/test_user/record', format='json')
      self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_record(self):
      response = self.client.get('/stock_api/users/test_user/record', record, format='json')
      self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_record(self):
      record.pop('symbol')
      response = self.client.post('/stock_api/users/test_user/record', record, format='json')
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SummaryTest(APITestCase):
    def setUp(self):
        self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
        user = User.objects.get(username='test_user')
        self.client.force_authenticate(user=user)
        r1 = Record(profile=user.profile, symbol='AAPL', type='BUY', price=100, amount=3)
        r1.save()
        r2 = Record(profile=user.profile, symbol='AAPL', type='BUY', price=100, amount=2)
        r2.save()
        r3 = Record(profile=user.profile, symbol='MSFT', type='BUY', price=120, amount=1)
        r3.save()
        self.assertEqual(len(user.profile.records.all()), 3)

    def test_summary(self):
        response = self.client.get('/stock_api/users/test_user/record/summary', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['symbols_summary'][0]['net'], -500)
        self.assertEqual(response.json()['symbols_summary'][0]['hold'], 5)
        self.assertEqual(response.json()['symbols_summary'][1]['net'], -120)
        self.assertEqual(response.json()['symbols_summary'][1]['hold'], 1)

    def test_summary_after_change(self):
        profile = User.objects.get(username='test_user').profile
        r = Record(symbol='AAPL', amount=2, price=50, type='SELL', profile=profile)
        r.save()
        response = self.client.get('/stock_api/users/test_user/record/summary', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['symbols_summary'][0]['net'], -400)
        self.assertEqual(response.json()['symbols_summary'][0]['hold'], 3)
   
   