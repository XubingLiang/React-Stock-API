from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
# Create your models here.



class Profile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE,
                                primary_key=True, related_name='profile')
    balance = models.FloatField(default=0.0)

    def __str__(self):
        return self.user.username

class Record(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='records')
    symbol = models.CharField(max_length=100)
    SELL = 'SELL'
    BUY = 'BUY'
    TYPE_OPTIONS = (
        (SELL, 'SELL'),
        (BUY, 'BUY'),
    )
    price = models.FloatField(default=0.0)
    type = models.CharField(choices=TYPE_OPTIONS, max_length=10)
    amount = models.IntegerField(default=0)
    time = models.DateTimeField(default=timezone.now)

@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=get_user_model())
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except:
        Profile.objects.create(user=instance)