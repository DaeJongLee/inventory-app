import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

# Firebase 초기화
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# JSON 파일 로드
with open('inventory_data.json', 'r', encoding='utf-8') as f:
    inventory_data = json.load(f)

# Firestore에 데이터 업로드
def upload_to_firestore(data):
    batch = db.batch()
    count = 0
    
    for item in data:
        # 새 문서 참조 생성 (Firestore가 자동으로 ID 생성)
        doc_ref = db.collection('items').document()
        batch.set(doc_ref, item)
        
        count += 1
        
        # Firestore는 한 번에 최대 500개의 작업을 처리할 수 있음
        if count == 500:
            batch.commit()
            batch = db.batch()
            count = 0
    
    # 남은 항목들 처리
    if count > 0:
        batch.commit()

    print(f"총 {len(data)}개의 항목이 업로드되었습니다.")

# 함수 실행
upload_to_firestore(inventory_data)