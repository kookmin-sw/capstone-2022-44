'''
웹 서비스 정책에 대한 설정 파일
'''
import datetime


# PDF 보관 기간
def DEADLINE(days=7):
    return (datetime.datetime.now()+datetime.timedelta(days=days)).strftime("%Y-%m-%d")


# 가입 크레딧
ENROLL_CREDIT = 0


# 데이터 정렬 규칙
def ORDER_BY_RECENT(data):
    return data.order_by('-pk')
    

# 요청 데이터 이름 영한 변환
QUERY_NAME_MATCH = {
    "email": "이메일",
    "username": "닉네임",
    "password": "비밀번호",
    "age": "나이",
    "job_field": "분야",
    "job": "직무",
    "position": "직책",
    "gender": "성별",
    "credit": "크레딧",
    "card": "명함 이미지",
    "id": "고유번호",
    "name": "이름",
    "phoneNumber": "연락처",
    "content": "내용",
}