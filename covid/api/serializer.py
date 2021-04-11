from django.db.models import fields
from rest_framework import serializers
from .models import patient, account, patient_test, diagnostic
from django.contrib.auth.models import User
from django.contrib.auth.models import User


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = patient
        fields = ['id', 'first_name', 'last_name', 'patient_picture', 'date_added',
                  'city', 'governorate', 'sex', 'age', 'account', 'date_of_birth', 'covid19']
        #fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = patient_test

        fields = '__all__'


class DiagnosticSerializer(serializers.ModelSerializer):
    class Meta:
        model = diagnostic

        fields = '__all__'


class AccountSeriaizer(serializers.ModelSerializer):

    password = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = account
        fields = ['id', 'email', 'username', 'first_name', 'last_name',
                  'password', 'password2', 'is_admin', 'is_doctor', 'account_picture']

    def save(self, pk):
        try:
            try:
                u = account(
                    id=pk,
                    account_picture=self.validated_data['account_picture'],
                    email=self.validated_data['email'],
                    username=self.validated_data['username'],
                    first_name=self.validated_data['first_name'],
                    last_name=self.validated_data['last_name'],
                    # is_admin=self.validated_data['is_admin'],
                    # is_doctor=self.validated_data['is_doctor'],
                )
            except:
                u = account(
                    id=pk,
                    # account_picture=self.validated_data['account_picture'],
                    email=self.validated_data['email'],
                    username=self.validated_data['username'],
                    first_name=self.validated_data['first_name'],
                    last_name=self.validated_data['last_name'],
                    # is_admin=self.validated_data['is_admin'],
                    # is_doctor=self.validated_data['is_doctor'],
                )
        except:
            pass
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match.'})
        elif len(password) < 8:
            raise serializers.ValidationError(
                {'password': 'Passwords must be at least 8 charcherts .'})

        u.save()
        return u


class AccountPropertiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = account
        fields = ['id', 'email', 'username', 'first_name',
                  'last_name', 'is_admin', 'is_doctor', 'account_picture', ]


class UserPropertiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'username', ]
        #fields = '__all__'
