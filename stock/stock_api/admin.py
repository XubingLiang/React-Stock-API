from django.contrib import admin
from .models import Profile, Record

# Register your models here.
admin.site.register([Profile, Record])