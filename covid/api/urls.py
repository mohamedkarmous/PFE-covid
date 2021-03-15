from django.urls import path 
from .views import patient_details,create_patient,update_patient,delete_patient,view_patient #patient views
from .views import registration_view,account_properties_view,update_account_view,delete_account,token #user view
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    ### patient url ###
    path('patient/' ,view_patient.as_view(),name ='list' ),
    path('patient/<pk>/' ,patient_details,name ='details' ),
    path('patient/<pk>/update/' ,update_patient,name ='update' ),
    path('patient/<pk>/delete/' ,delete_patient,name ='delete' ),
    path('patient/create' ,create_patient,name ='create' ),
    
    
    
    ### user url ###
    path('register' ,registration_view,name ='register' ),
    path('login' ,obtain_auth_token,name ='login' ),
    path('account' ,account_properties_view,name ='account' ),
    path('account/update' ,update_account_view,name ='update account' ),
    path('account/<pk>/delete' ,delete_account,name ='delete account' ),
    path('account/token' ,token,name ='token' ),





    
]
