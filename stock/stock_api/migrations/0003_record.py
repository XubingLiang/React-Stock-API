# Generated by Django 2.1.7 on 2019-02-23 02:27

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('stock_api', '0002_profile_balance'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symbol', models.CharField(max_length=100)),
                ('price', models.FloatField(default=0.0)),
                ('type', models.CharField(choices=[('SELL', 'SELL'), ('BUY', 'BUY')], max_length=10)),
                ('amount', models.IntegerField(default=0)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='records', to='stock_api.Profile')),
            ],
        ),
    ]
