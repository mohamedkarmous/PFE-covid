from django.urls import path
from .views import patient_details, create_patient, update_patient, delete_patient, view_diagnostic, view_patient  # patient views
from .views import test_details, create_test, update_test, delete_test, view_test  # test views
from .views import diagnostic_details, create_diagnostic, update_diagnostic, delete_diagnostic, view_diagnostic  # diagnostic views
from .views import registration_view, account_properties_view, update_account_view, delete_account, token, view_account, update_accounts_view, ChangePasswordView  # user view
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    ### patient url ###
    path('patient/', view_patient.as_view(), name='list'),
    path('patient/<pk>/', patient_details, name='details'),
    path('patient/<pk>/update/', update_patient, name='update'),
    path('patient/<pk>/delete/', delete_patient, name='delete'),
    path('patient/create', create_patient, name='create'),



    ### user url ###
    path('register', registration_view, name='register'),
    path('login', obtain_auth_token, name='login'),
    path('account', account_properties_view, name='account'),
    path('account/update', update_account_view, name='update account'),
    path('account/<pk>/update', update_accounts_view, name='update accounts'),
    path('account/<pk>/delete', delete_account, name='delete account'),
    path('account/token', token, name='token'),
    path('accounts', view_account.as_view(), name='accounts'),
    path('change_Password', ChangePasswordView.as_view(), name='change password'),


    ### test url ###
    path('test/', view_test.as_view(), name='list'),
    path('test/<pk>/', test_details, name='details'),
    path('test/<pk>/update/', update_test, name='update'),
    path('test/<pk>/delete/', delete_test, name='delete'),
    path('test/create', create_test, name='create'),


    ### diagnotic url ###
    path('diagnostic/', view_diagnostic.as_view(), name='list'),
    path('diagnostic/<pk>/', diagnostic_details, name='details'),
    path('diagnostic/<pk>/update/', update_diagnostic, name='update'),
    path('diagnostic/<pk>/delete/', delete_diagnostic, name='delete'),
    path('diagnostic/create', create_diagnostic, name='create'),










]
