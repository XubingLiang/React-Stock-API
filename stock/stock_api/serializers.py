from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Record
from rest_auth.serializers import TokenSerializer
from rest_auth.models import TokenModel
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

UserModel = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = UserModel
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'profile')
        read_only_fields = ('username',)
        extra_kwargs = {'password': {'write_only': True, 'required': False},
                        'first_name': {'required': False},
                        'last_name': {'required': False}, 'email': {'required': False}}

    def update(self, instance, validated_data):

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance

class RecordSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.user.username')

    class Meta:
        model = Record
        fields = ('symbol', 'price', 'amount', 'type', 'profile', 'time')

class CustomTokenSerializer(TokenSerializer):
    user = UserSerializer()

    class Meta:
        model = TokenModel
        fields = ('key', 'user')

class SignupSerializer(RegisterSerializer):
    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', '')
        }

    def save(self, request):
        print(self.get_cleaned_data())
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        profile = user.profile
        profile.save()
        return user
