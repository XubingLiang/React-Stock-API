from django.urls import path, include
from stock_api import views

user_patterns = [
  path('balance', views.BalanceView.as_view()),
  path('record', views.RecordView.as_view()),
  path('record/summary', views.UserSumarryView.as_view())
]

urlpatterns = [
	path('auth/signup/', include('rest_auth.registration.urls')),
	path('auth/', include('rest_auth.urls')),
    path('auth/get_current_user/', views.get_current_user),
    path('users/<username>/', include(user_patterns)),
]