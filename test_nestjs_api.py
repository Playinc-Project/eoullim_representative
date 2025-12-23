#!/usr/bin/env python3
import requests
import json

BASE_URL = 'http://localhost:8081/api'

def test_api():
    print("=== NestJS API 테스트 시작 ===\n")
    
    # 1. 서버 연결 테스트
    try:
        print("1. 서버 연결 테스트")
        response = requests.get(f'{BASE_URL}/')
        print(f"   상태 코드: {response.status_code}")
        print(f"   응답: {response.text}")
        print()
    except Exception as e:
        print(f"   오류: {e}")
        return False
    
    # 2. 사용자 목록 조회 (빈 상태)
    try:
        print("2. 사용자 목록 조회")
        response = requests.get(f'{BASE_URL}/users')
        print(f"   상태 코드: {response.status_code}")
        print(f"   응답: {response.json()}")
        print()
    except Exception as e:
        print(f"   오류: {e}")
    
    # 3. 사용자 회원가입
    user_data = {
        "email": "test1@example.com",
        "password": "password123",
        "username": "testuser1",
        "bio": "테스트 사용자입니다"
    }
    
    try:
        print("3. 사용자 회원가입")
        response = requests.post(f'{BASE_URL}/users/signup', 
                                json=user_data, 
                                headers={'Content-Type': 'application/json'})
        print(f"   상태 코드: {response.status_code}")
        if response.status_code == 201:
            user = response.json()
            print(f"   생성된 사용자: {user}")
            user_id = user.get('id')
        else:
            print(f"   응답: {response.text}")
        print()
    except Exception as e:
        print(f"   오류: {e}")
    
    # 4. 로그인 테스트
    login_data = {
        "email": "test1@example.com", 
        "password": "password123"
    }
    
    try:
        print("4. 로그인 테스트")
        response = requests.post(f'{BASE_URL}/users/login',
                                json=login_data,
                                headers={'Content-Type': 'application/json'})
        print(f"   상태 코드: {response.status_code}")
        if response.status_code == 200:
            login_result = response.json()
            print(f"   로그인 결과: {login_result}")
            token = login_result.get('token')
        else:
            print(f"   응답: {response.text}")
        print()
    except Exception as e:
        print(f"   오류: {e}")
    
    # 5. 게시글 생성
    if 'user_id' in locals():
        post_data = {
            "user_id": user_id,
            "title": "첫번째 게시글",
            "content": "NestJS API 테스트용 게시글입니다."
        }
        
        try:
            print("5. 게시글 생성")
            response = requests.post(f'{BASE_URL}/posts',
                                    json=post_data,
                                    headers={'Content-Type': 'application/json'})
            print(f"   상태 코드: {response.status_code}")
            if response.status_code == 201:
                post = response.json()
                print(f"   생성된 게시글: {post}")
                post_id = post.get('id')
            else:
                print(f"   응답: {response.text}")
            print()
        except Exception as e:
            print(f"   오류: {e}")
    
    # 6. 게시글 목록 조회
    try:
        print("6. 게시글 목록 조회")
        response = requests.get(f'{BASE_URL}/posts')
        print(f"   상태 코드: {response.status_code}")
        if response.status_code == 200:
            posts = response.json()
            print(f"   게시글 수: {len(posts)}")
            if posts:
                print(f"   첫번째 게시글: {posts[0]}")
        else:
            print(f"   응답: {response.text}")
        print()
    except Exception as e:
        print(f"   오류: {e}")
    
    print("=== 테스트 완료 ===")

if __name__ == "__main__":
    test_api()