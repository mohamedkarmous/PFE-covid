from django.db.models.query import QuerySet
from django.shortcuts import render
from .serializer import AccountSeriaizer, PatientSerializer, AccountPropertiesSerializer, UserPropertiesSerializer, TestSerializer
from .models import patient, account, patient_test
#from rest_framework.parsers import FormParser,MultiPartParser,JSONParser
# import
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.filters import SearchFilter, OrderingFilter


# Create your views here.


SUCCESS = 'success'
ERROR = 'error'
DELETE_SUCCESS = 'deleted'
UPDATE_SUCCESS = 'updated'
CREATE_SUCCESS = 'created'


############## patient api ###################


@api_view(['GET', ])
@permission_classes((IsAuthenticated,))
def patient_details(request, pk):
    try:
        patient_data = patient.objects.get(id=pk)

    except patient.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(PatientSerializer(patient_data).data)


@api_view(['PUT', ])
@permission_classes((IsAuthenticated, ))
def update_patient(request, pk):

    try:
        patient_data = patient.objects.get(id=pk)
    except patient.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = PatientSerializer(patient_data, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()

            data[SUCCESS] = UPDATE_SUCCESS
            return Response(data=data)
        # print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
@permission_classes((IsAuthenticated, ))
def delete_patient(request, pk):

    try:
        patient_data = patient.objects.get(id=pk)
    except patient.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        operation = patient_data.delete()
        data = {}
        if operation:
            data[SUCCESS] = DELETE_SUCCESS
        return Response(data=data)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def create_patient(request):

    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((IsAuthenticated, ))
class view_patient(ListAPIView):
    queryset = patient.objects.all()
    serializer_class = PatientSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
   # pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('account__id',)


##########################################


######### user views #################
@api_view(['POST', ])
def token(request):
    try:
        if request.method == 'POST':

            try:
                token = request.data['token']
                user_id = Token.objects.get(key=token).user.id
                account_data = account.objects.get(id=user_id)
            except account.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = AccountPropertiesSerializer(account_data)

            res = serializer.data

            return Response(res)
    except:
        return Response({'error': 'token not found'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', ])
def registration_view(request):

    if request.method == 'POST':
        serializer = AccountSeriaizer(data=request.data)
        data = {}
        if serializer.is_valid():
            if(request.data['password'] == request.data['password2']):

                user = User.objects.create_user(
                    request.data['username'], request.data['email'], request.data['password'])
                account = serializer.save(user.id)
                data['response'] = 'successfully registered new user.'
                data['email'] = account.email
                data['username'] = account.username
                data['first_name'] = account.first_name
                data['last_name'] = account.last_name
                #data['account_picture'] = account.account_picture

                #data['is_admin'] = account.is_admin
                #data['is_doctor'] = account.is_doctor

                token = Token.objects.get(user=user).key
                data['token'] = token
            else:
                data = {'errors': {'password': 'Passwords must match.'}}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = {'errors': serializer.errors}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        print(data)
        return Response(data)


@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def account_properties_view(request):

    try:
        user = request.user
        account_data = account.objects.get(username=user.username)
    except account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        token = Token.objects.get(user=user).key
        serializer = AccountPropertiesSerializer(account_data)

        res = serializer.data
        res['token'] = token

        return Response(res)


@api_view(['PUT', ])
@permission_classes((IsAuthenticated, ))
def update_account_view(request):

    try:
        user = request.user
        account_data = account.objects.get(username=user.username)
        u = User.objects.get(username=user)
    except account.DoesNotExist:

        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AccountPropertiesSerializer(
            account_data, data=request.data)
        serializer1 = UserPropertiesSerializer(user, data=request.data)
        data = {}
        if serializer.is_valid():
            if serializer1.is_valid():

                serializer.save()
                serializer1.save()
            else:
                return Response(serializer1.errors, status=status.HTTP_400_BAD_REQUEST)

            data['response'] = 'Account update success'
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# update accounts for admin


@api_view(['PUT', ])
@permission_classes((IsAuthenticated, ))
def update_accounts_view(request, pk):

    try:
        user = User.objects.get(id=pk)
        account_data = account.objects.get(id=pk)

    except account.DoesNotExist:

        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AccountPropertiesSerializer(
            account_data, data=request.data)
        serializer1 = UserPropertiesSerializer(user, data=request.data)
        data = {}
        if serializer.is_valid():
            if serializer1.is_valid():

                serializer.save()
                serializer1.save()
            else:
                return Response(serializer1.errors, status=status.HTTP_400_BAD_REQUEST)

            data['response'] = 'Account update success'
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
@permission_classes((IsAuthenticated, ))
def delete_account(request, pk):

    try:
        account_data = account.objects.get(id=pk)
    except patient.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        operation = account_data.delete()
        u = User.objects.get(id=pk)

        u.delete()

        data = {}
        if operation:
            data[SUCCESS] = DELETE_SUCCESS
        return Response(data=data)


@permission_classes((IsAuthenticated,))
class view_account(ListAPIView):
    queryset = account.objects.all()
    serializer_class = AccountPropertiesSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
   # pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('email',)

    ##################################


############## patient_test api ###################


@api_view(['GET', ])
@permission_classes((IsAuthenticated,))
def test_details(request, pk):
    try:
        test_data = patient_test.objects.get(id=pk)

    except patient_test.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(TestSerializer(test_data).data)


@api_view(['PUT', ])
@permission_classes((IsAuthenticated, ))
def update_test(request, pk):

    try:
        test_data = patient_test.objects.get(id=pk)
    except patient_test.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = TestSerializer(test_data, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()

            data[SUCCESS] = UPDATE_SUCCESS
            return Response(data=data)
        # print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
@permission_classes((IsAuthenticated, ))
def delete_test(request, pk):

    try:
        test_data = patient_test.objects.get(id=pk)
    except patient_test.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        operation = test_data.delete()
        data = {}
        if operation:
            data[SUCCESS] = DELETE_SUCCESS
        return Response(data=data)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def create_test(request):

    if request.method == 'POST':
        serializer = TestSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((IsAuthenticated,))
class view_test(ListAPIView):
    queryset = patient_test.objects.all()
    serializer_class = TestSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
   # pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('patient__id',)

    ##################################
