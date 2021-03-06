from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import User
from pdf.models import PDFModel
from .models import Eyetracking
from .serializers import EyetrackingSerializer,EyetrackingUserList,Userlist
from django.db.models import F
from apps.settings import STATIC_URL
from .heatmap import Heatmapper
from django.db.models.functions import TruncDate
from PIL import Image,ImageDraw
import matplotlib.pyplot as plt
from apps.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_CUSTOME_DOMAIN, AWS_STORAGE_BUCKET_NAME
import boto3
from io import BytesIO
import datetime
import urllib.request
import ast
from apps.decorator import TIME_MEASURE
import asyncio # 비동기 처리

from drf_yasg.utils import swagger_auto_schema
from drf_yasg       import openapi

heatmapper = Heatmapper(
    point_diameter=100,  # the size of each point to be drawn
    point_strength=1,  # the strength, between 0 and 1, of each point to be drawn
    opacity=0.6,  # the opacity of the heatmap layer
    colours='default',  # 'default' or 'reveal'
                        # OR a matplotlib LinearSegmentedColorMap object 
                        # OR the path to a horizontal scale image
    grey_heatmapper='PIL'  # The object responsible for drawing the points
                           # Pillow used by default, 'PySide' option available if installed
)

s3r = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY_ID, aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

class EyetrackList(APIView):
    def visualization(self, user_id, pdf_id, page_num, owner_id, coordinate):
        global heatmapper
        global s3r
        print("시각화 처리")
        try:
            save_flow_path = "media/public/user_{0}/pdf/{1}/{2}/{3}/images/{4}.jpg".format(owner_id,pdf_id,user_id,"flow",page_num)
            save_distribution_path = "media/public/user_{0}/pdf/{1}/{2}/{3}/images/{4}.jpg".format(owner_id,pdf_id,user_id,"distribution",page_num)
            # 이미지 url
            img_path = STATIC_URL+"media/public/user_{0}/pdf/{1}/images/{2}.jpg".format(owner_id, pdf_id, page_num)
            
            
            try:
                web_img = urllib.request.urlopen(img_path).read()
                _img = Image.open(BytesIO(web_img))
            except Exception as e:
                print("이미지 에러",e)
                return Response({'error_message': "이미지 에러"})
            
            if type(coordinate) == str:
                coordinate = ast.literal_eval(coordinate)

            try:
                heatmap = heatmapper.heatmap_on_img(coordinate, _img)
                heatmap = heatmap.convert("RGB")

                buffer = BytesIO()
                heatmap.save(buffer,format='jpeg')
                buffer.seek(0)

                s3r.Bucket(AWS_STORAGE_BUCKET_NAME).put_object(
                                    Key=save_distribution_path, 
                                    Body=buffer,  
                                    ContentType='image/jpeg')
                print("시선분산 처리 완료")
            except Exception as e:
                print("히트맵 오류",e)
                return Response({'error_message': "히트맵 에러"})
                 
            try:   
                draw = ImageDraw.Draw(_img)
                color = ["#FF0000", "#FF5E00", "#FFBB00", "#FFE400", "#ABF200", "#1DDB16", "#00D8FF", "#0054FF", "#0100FF", "#5F00FF"]
                for i in range(len(coordinate)-1):
                    x,y = coordinate[i]
                    x2,y2 = coordinate[i+1]
                    draw.line((x,y,x2,y2),fill = color[i//10%10] ,width = 5)
                
                buffer = BytesIO()
                _img.save(buffer, format='jpeg')
                buffer.seek(0) # 대기

                s3r.Bucket(AWS_STORAGE_BUCKET_NAME).put_object(
                                    Key=save_flow_path, 
                                    Body=buffer,  
                                    ContentType='image/jpeg')
                print("flow 처리 완료")
            except Exception as e:
                print("flow 처리 에러 ",e)
                return Response(e, status=status.HTTP_200_OK)
            
        except Exception as e: 
            print(e)
            return Response({'error_message': "시각화 오류"})
   
    @swagger_auto_schema(
            operation_summary="/eyetracking", 
            operation_description="Eyetracking을 한 데이터를 데이터베이스에 추가하는 POST API입니다. PPT 한장을 평가할 때마다 DB에 요청됩니다.", 
            request_body=openapi.Schema(
           'Eyetrack 등록',
            type=openapi.TYPE_OBJECT,
            properties={
                'user_email': openapi.Schema('평가자 이메일', type=openapi.TYPE_STRING),
                'owner_email': openapi.Schema('PPT 소유자 이메일', type=openapi.TYPE_STRING),
                'coordinate': openapi.Schema('시각 데이터', type=openapi.TYPE_STRING),
                'page_num': openapi.Schema('PPT 페이지 번호', type=openapi.TYPE_STRING),
                'pdf_id': openapi.Schema('PPT 고유 ID', type=openapi.TYPE_STRING),
                'rating_time': openapi.Schema('평가 소요 시간', type=openapi.TYPE_STRING),

            }),
        responses={200: EyetrackingSerializer})
    def post(self,request):
        try:
            user_email = request.data.get('user_email')
            owner_email = request.data.get('owner_email')
            coordinate = request.data.get('coordinate')
            page_num = request.data.get('page_number')
            pdf_id = request.data.get('pdf_id')
            rating_time = request.data.get('rating_time')
            
            user_id =  User.objects.get(email=user_email).pk
            owner_id = User.objects.get(email=owner_email).pk
            # 트래킹 데이터 이어쓰기
            if Eyetracking.objects.filter(pdf_fk=PDFModel.objects.get(pk=pdf_id),
                                        user_id=User.objects.get(pk=user_id),
                                        owner_id=User.objects.get(pk=owner_id),
                                        page_num=page_num):
                return self.put(request)

            eyetrackdatas = Eyetracking(user_id = User.objects.get(email=user_email),
                                        owner_id = User.objects.get(email=owner_email),
                                        page_num = page_num, 
                                        pdf_fk = PDFModel.objects.get(pk=pdf_id),
                                        rating_time= rating_time,
                                        coordinate= coordinate)
                                        
            eyetrackdatas.save()
            try:
                self.visualization(user_id, pdf_id, page_num, owner_id, coordinate)
                print("post 시각화 처리")
            except Exception as e:
                print(e)

            serializer = EyetrackingSerializer(eyetrackdatas, many=False)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(e)
    
    @swagger_auto_schema(
			operation_summary="/eyetracking", 
            operation_description="Eyetracking을 한 데이터를 데이터베이스에 수정하는 PUT API입니다. PPT를 평가하다가 뒷장을 넘어가 추가로 평가하는 경우에 요청됩니다.", 
            request_body=openapi.Schema(
           'Eyetrack 수정',
            type=openapi.TYPE_OBJECT,
            properties={
                'user_email': openapi.Schema('평가자 이름', type=openapi.TYPE_STRING),
                'owner_email': openapi.Schema('PPT 소유자 이메일', type=openapi.TYPE_STRING),
                'pdf_id': openapi.Schema('PPT 고유 ID', type=openapi.TYPE_STRING),
                'page_number': openapi.Schema('PPT 페이지 번호', type=openapi.TYPE_STRING),
            }),
        responses={200: EyetrackingSerializer})
    def put(self, request):
        user_id =  User.objects.get(email=request.data['user_email']).pk
        owner_id = User.objects.get(email=request.data['owner_email']).pk
        pdf_id = request.data['pdf_id']
        page_num = request.data['page_number']

        eyetrackdatas = Eyetracking.objects.get(pdf_fk=PDFModel.objects.get(pk=request.data['pdf_id']),
                                                user_id=User.objects.get(pk=user_id),
                                                owner_id=User.objects.get(pk=owner_id),
                                                page_num=page_num)
        
        delta_time = datetime.time.fromisoformat(request.data['rating_time'])
        
        # 시, 분, 초 업데이트
        previous_time = datetime.datetime(year=1900, month=1, day=1,
                                          hour=eyetrackdatas.rating_time.hour,
                                          minute=eyetrackdatas.rating_time.minute,
                                          second=eyetrackdatas.rating_time.second)
        
        delta_time = datetime.timedelta(hours=delta_time.hour,
                                        minutes=delta_time.minute,
                                        seconds=delta_time.second)
        
        eyetrackdatas.rating_time = (previous_time + delta_time).time()

        # 시선 추적 데이터 이어쓰기
        coordinate = eyetrackdatas.coordinate
        if type(coordinate) == str:
            coordinate = ast.literal_eval(coordinate)
        print("4")    
        request_coordinate = request.data['coordinate']
        if type(request_coordinate) == str:
            request_coordinate = ast.literal_eval(request_coordinate)
        
        coordinate.extend(request_coordinate)
        eyetrackdatas.coordinate = coordinate
        eyetrackdatas.save()
        
        # async 비동기 처리 
        self.visualization(user_id, pdf_id, page_num, owner_id, coordinate)

        serializer = EyetrackingSerializer(eyetrackdatas, many=False)
        return Response(serializer.data)

class EyetrackUser(APIView):
    @swagger_auto_schema(
            operation_summary = '/eyetrack/user',
            operation_description="PPT를 평가한 User 정보를 제공하는 API입니다.",
            responses={200 : 'Visualization Image Link'},
            manual_parameters=[
            openapi.Parameter(
            'pdf_id', 
            openapi.IN_QUERY, 
            description="PPT의 고유 ID", 
            type=openapi.TYPE_STRING)
            ])
    def get(self,request):
        try:
            queryDict = {
                'pdf_id' : request.GET.get('pdf_id')
            }
            owner_id = PDFModel.objects.get(pk=queryDict["pdf_id"]).user.pk
            queryset = Eyetracking.objects.filter(pdf_fk = queryDict['pdf_id']).annotate(
                pdf_id=F('pdf_fk__pk'),
                age=F('user_id__age'),
                job = F("user_id__job"),
                job_field=F('user_id__job_field'),
                position=F('user_id__position'),
                gender=F('user_id__gender'),
                username=F('user_id__username'),
                email=F('user_id__email'),
                date = TruncDate('create_date')
            ).values('user_id','date','age','job','job_field','position','gender','username','email','pdf_id').exclude(user_id=owner_id).distinct().order_by('pdf_fk')
     
            print("query",queryset)
            serializer = EyetrackingUserList(queryset,many = True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': "user list 오류"})
    
        
class EyetrackVisualization(APIView):
    @swagger_auto_schema(
            operation_summary = '/eyetrack/visualization',
            responses={200 : '시각화 이미지 리스트'},
            operation_description="시각 분포와 시각 흐름에 대한 시각화를 진행하여 보관합니다. AWS S3에 데이터를 저장하고 있어 빠른 제공이 가능합니다.",
            manual_parameters=[
            openapi.Parameter(
            'pdf_id', 
            openapi.IN_QUERY, 
            description="PPT 고유 ID", 
            type=openapi.TYPE_STRING)
            ,
            openapi.Parameter(
            'visual_type', 
            openapi.IN_QUERY, 
            description="시각 분포, 시각 흐름 중 원하는 데이터를 입력받습니다. (distrubution,flow)", 
            type=openapi.TYPE_STRING)
            ]) 
    def get(self,request): 
        try:
            queryDict = {
                'pdf_id' : request.GET.get('pdf_id'),
                'visual_type' : request.GET.get('visual_type'),
                'user_email' : request.GET.get('user_email')
            }

            owner_id = PDFModel.objects.get(pk=queryDict["pdf_id"]).user.pk
            user_id = User.objects.get(email=queryDict["user_email"]).pk
            
            img_path = STATIC_URL+"media/public/user_{0}/pdf/{1}/{2}/{3}/images/".format(owner_id, queryDict['pdf_id'],user_id, queryDict['visual_type'])
            image_page = Eyetracking.objects.filter(owner_id=owner_id, pdf_fk=queryDict['pdf_id'],user_id = user_id).values_list('page_num',flat=True).distinct()
            
            visual_img = []
            for i in list(image_page):
                visual_img.append(img_path +str(i)+".jpg")
            if not visual_img:
                print("해당 pdf_id 및 이메일을 확인해주세요.")
                return Response({'visual_img': visual_img},status = status.HTTP_200_OK)
            return Response({'visual_img': visual_img},status = status.HTTP_200_OK)
            
        except Exception as e:
            print("visual error", e)
            return Response({'visual_err': e})

            

