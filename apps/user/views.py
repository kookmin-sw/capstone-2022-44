from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import User
from django.db.models import Q
from .serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

from apps.decorator import TIME_MEASURE
import config.policy as POLICY

class UserAPI(APIView):
    # 사용자 유효성 검사 (DB)
    @TIME_MEASURE
    def get(self, request):
        try:
            queryDict = {
                "email": request.GET.get("email"),
                "password": request.GET.get("password"),
            }
            
            if not queryDict["email"] or not queryDict["password"]:
                raise Exception("아이디 / 패스워드 입력 오류입니다.")
            
            user = User.objects.get(Q(email=queryDict["email"]))
            
            if check_password(queryDict["password"], user.password):
                serializer = UserSerializer(user, many=False)
                return Response(serializer.data)
            else:
                raise Exception("패스워드가 올바르지 않습니다.")
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})

    # 회원가입
    @TIME_MEASURE
    def post(self, request):
        try:
            formData = {
                "email": request.POST.get("email"),
                "password": request.POST.get("password"),
                "username": request.POST.get("username"),
                "age": request.POST.get("age", 0),
                "job": request.POST.get("job"),
                "job_field": request.POST.get("job_field"),
                "position": request.POST.get("position"),
                "gender": request.POST.get("gender"),
                "credit": request.POST.get("credit", POLICY.ENROLL_CREDIT),
                "card": request.FILES.get("card"),
            }
            
            # 필수 항목 누락 검증
            for key in formData.keys():
                if not formData[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            # 중복 이메일 체크
            if User.objects.filter(email=formData["email"]):
                raise Exception("이미 존재하는 이메일입니다.")
                
            user = User(
                username=formData["username"],
                password=make_password(formData["password"]),
                email=formData["email"],
                age=formData["age"],
                gender=formData["gender"],
                job=formData["job"],
                job_field=formData["job_field"],
                position=formData["position"],
                credit=formData["credit"],
                card=formData["card"],
            )
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    # 사용자 수정
    @TIME_MEASURE
    def put(self, request):
        try:
            formData = {
                "email": request.POST.get("email"),
                "operator": request.POST.get("operator"),
                "credit": request.POST.get("credit"),
                "username": request.POST.get("username"),
                "age": request.POST.get("age"),
                "job": request.POST.get("job"),
                "job_field": request.POST.get("job_field"),
                "position": request.POST.get("position"),
                "gender": request.POST.get("gender"),
                "password": request.POST.get("password"),
            }
            
            # 필수 항목 누락 검증
            if not formData["email"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email'])
            
            user = User.objects.get(email=formData["email"])
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            # 업데이트 (개별 업데이트는 user.save(update_fields=['', '', '', ...]))
            if formData["operator"] in ["+", "-", "="] and formData["credit"]:
                if formData["operator"] == "+":
                    user.credit += int(formData["credit"])
                elif formData["operator"] == "-":
                    user.credit -= int(formData["credit"])
                elif formData["operator"] == "=":
                    user.credit = int(formData["credit"])
                
            if formData["username"]:
                user.username = formData["username"]
            if formData["age"]:
                user.age = formData["age"]
            if formData["job"]:
                user.job = formData["job"]
            if formData["job_field"]:
                user.job_field = formData["job_field"]
            if formData["position"]:
                user.position = formData["position"]
            if formData["gender"]:
                user.gender = formData["gender"]
            if formData["gender"]:
                user.gender = formData["gender"]
            if formData["password"]:
                user.password = make_password(formData["password"])
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            formData = {
                "email": request.POST.get("email"),
            }
            
            # 요청 데이터 누락 처리
            if not formData["email"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email'])
            
            # 사용자 검증
            user = User.objects.get(email=formData["email"])
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            user.delete()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
                
class UserSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            queryDict = {
                "id": request.GET.get("id"),
                "email": request.GET.get("email"),
                "username": request.GET.get("username"),
            }
            
            # 쿼리 적용 (Q() = 조건 없음)
            query = Q()
            if queryDict["id"]:
                query &= Q(id=queryDict["id"])
            if queryDict["email"]:
                query &= Q(email=queryDict["email"])
            if queryDict["username"]:
                query &= Q(username=queryDict["username"])
            
            user = User.objects.filter(query)
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})