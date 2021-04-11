from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django_resized import ResizedImageField
import datetime


sex_choices = [('F', 'female'), ('M', 'male')]


def upload_location_patient(instance, filename, **kwargs):
    file_path = './frontend/public/pictures/patient/{first_name} {last_name}.{filename}'.format(
        first_name=str(instance.first_name), last_name=str(instance.last_name), filename=str(filename.split('.')[-1])
    )
    return file_path


def upload_location_test(instance, filename, **kwargs):
    print(instance)
    file_path = './frontend/public/pictures/patient-test/{patient}-{result}-{date}.{filename}'.format(
        patient=str(instance.patient.id), result=str(instance.result.split(' ')[0]), date=str(timezone.now()).split('.')[0], filename=str(filename.split('.')[-1])
    )
    return file_path


def upload_location_account(instance, filename, **kwargs):
    file_path = './frontend/public/pictures/account/{username}.{filename}'.format(
        username=str(instance.username), filename=str(filename.split('.')[-1])
    )
    return file_path


class account(models.Model):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30, unique=False, default='')
    last_name = models.CharField(max_length=30, unique=False, default='')
    account_picture = models.ImageField('', upload_to=upload_location_account, height_field=None,
                                        width_field=None, default='./frontend/public/pictures/account/default.png')
    is_admin = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)


class patient(models.Model):

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    patient_picture = models.ImageField('', upload_to=upload_location_patient, height_field=None,
                                        width_field=None, default='./frontend/public/pictures/account/default.png')
    date_added = models.DateTimeField(verbose_name="date_added", auto_now=True)

    city = models.CharField(max_length=30)
    governorate = models.CharField(max_length=30)
    sex = models.CharField(max_length=30)
    date_of_birth = models.DateField(default=timezone.now)
    age = models.IntegerField(default=0)
    account = models.ForeignKey(account, on_delete=models.CASCADE, default=1)
    covid19 = models.CharField(max_length=30)

    def set_age(self):

        dob = self.date_of_birth
        tod = datetime.date.today()
        my_age = (tod.year - dob.year) - \
            int((tod.month, tod.day) < (dob.month, dob.day))
        self.age = my_age

    def save(self, *args, **kwargs):
        self.set_age()
        super().save(*args, **kwargs)


class patient_test(models.Model):
    xray_image = models.ImageField(upload_to=upload_location_test, height_field=None,
                                   width_field=None, default='./frontend/public/pictures/account/default.png')
    date_added = models.DateField(
        verbose_name="date_added", auto_now=True)
    validated = models.BooleanField(default=False)
    result = models.CharField(max_length=30, default="")
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, default=1)
    account = models.ForeignKey(account, on_delete=models.CASCADE, default=21)


class diagnostic(models.Model):
    cough = models.CharField(max_length=30, default="false")
    fever = models.CharField(max_length=30, default="false")
    sore_throat = models.CharField(max_length=30, default="false")
    shortness_of_breath = models.CharField(max_length=30, default="false")
    head_ache = models.CharField(max_length=30, default="false")
    gender = models.CharField(max_length=30, default="false")

    date_added = models.DateField(
        verbose_name="date_added", auto_now=True)
    validated = models.BooleanField(default=False)
    result = models.CharField(max_length=30, default="")
    patient = models.ForeignKey(patient, on_delete=models.CASCADE, default=1)
    account = models.ForeignKey(account, on_delete=models.CASCADE, default=21)


@receiver(models.signals.post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):

    if created:
        Token.objects.create(user=instance)
