from rest_framework import serializers
from .models import Eyetracking
from user.models import User
import datetime

# from user.serializers import UserSerializer
# get 요청이 왔을 때 응답할 data 가공
class EyetrackingSerializer(serializers.ModelSerializer):
    # user_email = serializers.SerializerMethodField()
    # def get_user
    # owner_email = serializers.SerializerMethodField()
    # page_number =  serializers.SerializerMethodField()
    # rating_time = serializers.SerializerMethodField()
    # pdf_id = serializers.SerializerMethodField()
    # visual_type = serializers.SerializerMethodField()
    
    class Meta :
        model = Eyetracking     # product 모델 사용
        fields = '__all__'
class CoordinateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eyetracking
        fields = 'coordinate'
class Userlist(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = '__all__'
        fields =(
            'email',
            'job',
            'job_field',
            'age',
            'position',
            'gender',
            'pk',
        )
class EyetrackingUserList(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    def get_user_name(self, obj):
        return obj['username']
    
    user_email = serializers.SerializerMethodField()
    def get_user_email(self, obj):
        return obj['email']
    
    job = serializers.SerializerMethodField()
    def get_job(self,obj):
        return obj['job']

    job_field = serializers.SerializerMethodField()
    def get_job_field(self,obj):
        return obj['job_field']

    age = serializers.SerializerMethodField()
    def get_age(self,obj):
        return obj['age']

    position = serializers.SerializerMethodField()
    def get_position(self,obj):
        return obj['position']
    
    gender = serializers.SerializerMethodField()
    def get_gender(self,obj):
        return obj['gender']
    
    create_date = serializers.SerializerMethodField()
    def get_create_date(self,obj):
        return obj['date']

    id = serializers.SerializerMethodField()
    def get_id(self,obj):
        return obj['user_id']

    pdf_id = serializers.SerializerMethodField()
    def get_pdf_id(self, obj):
        return obj['pdf_id']
    
    class Meta:
        model = Eyetracking
        # fields = '__all__'
        fields= (
            'id',
            'pdf_id',
            'user_email',
            'user_name',
            'job',
            'job_field',
            'age',
            'position',
            'gender',
            'create_date',
        )