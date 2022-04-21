from distutils.command.upload import upload
from django.db import models
from user.models import User

from apps.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_STORAGE_BUCKET_NAME
import boto3

from pdf2image import convert_from_bytes
from io import BytesIO


s3r = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY_ID, aws_secret_access_key= AWS_SECRET_ACCESS_KEY)


def pdf_path(instance, filename):
    return "pdfs/{0}/{1}/{2}".format(instance.user.id, instance.id, filename)


def pdf_to_image(instance):
    # pdf_bytes = s3r.Bucket(AWS_STORAGE_BUCKET_NAME).Object("pdf/{0}/{1}/{2}".format(str(instance.user.id), str(instance.id), str(instance.name))).get()['Body'].read()
    pdf_bytes = instance.pdf.open('rb').read() # PDF를 저장하지 않고 bytes data로 직접 가져오도록 변경
    try:
        images = convert_from_bytes(pdf_bytes, fmt="jpeg")
    except:
        images = convert_from_bytes(pdf_bytes, fmt="jpeg", poppler_path="pdf/poppler/Library/bin/")
        
    for i, image in enumerate(images):
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        s3r.Bucket(AWS_STORAGE_BUCKET_NAME).put_object(Key='pdf/{0}/{1}/{2}.jpg'.format(str(instance.user.id), str(instance.id), str(i)), 
                                                    Body=buffer, 
                                                    ContentType='image/jpeg')
    return len(images)


class PDFModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="user", db_column="user", null=True)
    name = models.CharField(default="unknown", max_length=255)
    pdf = models.FileField(upload_to=pdf_path)
    img_length = models.IntegerField(default=0, editable=False)
    upload_at = models.DateField(auto_now_add=True)
    deadline = models.DateField(default=None)
    views = models.IntegerField(default=0)
    
    def save(self, *args, **kwargs):
        if self.id is None:
            temp_pdf = self.pdf
            self.pdf = None
            super().save(*args, **kwargs)
            self.pdf = temp_pdf
            self.img_length = pdf_to_image(self)
            super().save(*args, **kwargs)

    def __str__(self):
        return self.name