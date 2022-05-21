from django.urls import path
from .views import EyetrackList,EyetrackVisualization,EyetrackUser

urlpatterns = [
    path('', EyetrackList.as_view()),
    path('visualization/',EyetrackVisualization.as_view()),
    path('user/',EyetrackUser.as_view()),
]