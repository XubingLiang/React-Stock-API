from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

signup_detail = {
  'username': 'test_user',
  'password1': 'Test123123',
  'password2': 'Test123123',
  'email': 'test@gmail.com',
  'first_name': 'Hello',
  'last_name': 'World',
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

class RecordTestCase(APITestCase):
   self.client.post('/stock_api/auth/signup/', signup_detail, format='json')
   