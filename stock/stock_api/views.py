'''Views for API'''
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from functools import reduce
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from stock_api.models import Profile, Record
from stock_api.serializers import UserSerializer, ProfileSerializer, RecordSerializer

# Create your views here.

class BalanceView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def post(self, request, username):
        print(request.data)
        try:
            current_user = User.objects.get(username=username)
            if request.data['type'] == 'Topup':
                current_user.profile.balance += request.data['value']
            elif request.data['type'] == 'Withdraw':
                current_user.profile.balance -= request.data['value']
            current_user.save()
            current_user.profile.save()
        
            serializer = UserSerializer(current_user)
            return JsonResponse(serializer.data, status=200)
        except User.DoesNotExist:
            HttpResponse(status=404)

class RecordView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def post(self, request, username):
        try:
            current_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponse(status=404)
        print(request.data)
        serializer = RecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(profile=current_user.profile)
        if request.data['type'] == 'BUY':
            current_user.profile.balance -= request.data['amount'] * request.data['price']
        elif  request.data['type'] == 'SELL':
            current_user.profile.balance += request.data['amount'] * request.data['price']

        current_user.save()
        current_user.profile.save()
        serializer = UserSerializer(current_user)
        return JsonResponse(serializer.data, safe=True, status=201)

    def get(self, request, username):
        try:
            current_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponse(status=404)

        queryset = current_user.profile.records.all()
        serializer = RecordSerializer(queryset, many=True)
        return JsonResponse(serializer.data, status=200, safe=False)

class UserSumarryView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, username):
        try:
            current_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponse(status=404)

        def calculate_total(acc, record):
            if record.type == 'BUY':
                acc['net'] -= record.amount * record.price
                acc['hold'] += record.amount
            elif record.type == 'SELL':
                acc['net'] += record.amount * record.price
                acc['hold'] -= record.amount
            acc['net'] = round(acc['net'], 2)
            return acc

        records = current_user.profile.records
        symbols = records.order_by().values('symbol').distinct()
        summary = {'total_asset': 0, 'symbols_summary': []}
        symbols_summary = []
        i = 1

        for symbol in symbols:
            symbol = symbol.pop('symbol')
            symbol_summary = {'symbol': symbol, 'key': i,'net': 0, 'hold': 0}
            symbol_records = records.filter(symbol=symbol)
            reduce(calculate_total, symbol_records, symbol_summary)
            summary['total_asset'] += symbol_summary['net']
            symbols_summary.append(symbol_summary)
            i +=1

        summary['total_asset'] = round(summary['total_asset'], 2)
        summary['symbols_summary'] = symbols_summary
        return JsonResponse(summary, status=200, safe=False)


@csrf_exempt
def user_list(request):
    """
    List all user, or create a user.
    """
    if request.method == 'GET':
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def profile_list(request):
    if request.method == 'GET':
        profile = Profile.objects.all()
        serializer = ProfileSerializer(profile, many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def record_list(request):
    if request.method == 'GET':
        records = Record.objects.all()
        serializer = RecordSerializer(records, many=True)
        return JsonResponse(serializer.data, safe=False)       

@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
def get_current_user(request):
    ''' verify current user and return user info to frontend'''
    print(request)
    username = request.user
    try:
        serializer = UserSerializer(User.objects.get(username=username))
        print(serializer.data)
        return JsonResponse(serializer.data, status=200)
    except User.DoesNotExist:
        return HttpResponse(status=404)