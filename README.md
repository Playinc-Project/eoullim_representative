# Eoullim - 소셜 네트워크 플랫폼

React + Spring Boot 기반의 소셜 네트워크 서비스

## 배포 링크

https://54.180.226.197/

## 프로젝트 구조

- **Frontend**: React + Firebase (CloudFront로 배포)
- **Backend**: Spring Boot + H2 Database (ECS Fargate로 배포)
- **Infrastructure**: AWS (CloudFront, API Gateway, ALB, ECS)

---

## 📚 API 문서

### Base URL
- **Production**: `https://qmmcl0wmqh.execute-api.us-east-1.amazonaws.com/prod/api`
- **Development**: `http://localhost:8081/api`

---

### 👤 사용자 관련 API

#### 1. 회원가입
```http
POST /api/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "사용자이름",
  "profileImage": "이미지URL (선택)",
  "bio": "자기소개 (선택)"
}
```

#### 2. 로그인
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**응답**: 사용자 정보 객체

#### 3. 사용자 조회
```http
GET /api/users/{id}
```

#### 4. 이메일로 사용자 조회
```http
GET /api/users/email/{email}
```

#### 5. 사용자 정보 수정
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "username": "새이름",
  "profileImage": "새이미지URL",
  "bio": "새자기소개"
}
```

#### 6. 사용자 삭제
```http
DELETE /api/users/{id}
```

---

### 📝 게시글 관련 API

#### 1. 게시글 작성
```http
POST /api/posts
Content-Type: application/json

{
  "userId": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "images": ["이미지URL1", "이미지URL2"] (선택)
}
```

#### 2. 전체 게시글 목록
```http
GET /api/posts
```

#### 3. 페이징된 게시글 목록
```http
GET /api/posts/page?page=0&size=10
```

#### 4. 게시글 상세 조회
```http
GET /api/posts/{id}
```

#### 5. 특정 사용자의 게시글
```http
GET /api/posts/user/{userId}
```

#### 6. 게시글 수정
```http
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "images": ["이미지URL"]
}
```

#### 7. 게시글 삭제
```http
DELETE /api/posts/{id}
```

#### 8. 게시글 좋아요
```http
POST /api/posts/{id}/like?userId={userId}
```

#### 9. 게시글의 댓글 조회
```http
GET /api/posts/{postId}/comments
```

#### 10. 게시글에 댓글 작성
```http
POST /api/posts/{postId}/comments
Content-Type: application/json

{
  "userId": 1,
  "content": "댓글 내용"
}
```

---

### 💬 댓글 관련 API

#### 1. 댓글 작성
```http
POST /api/comments
Content-Type: application/json

{
  "postId": 1,
  "userId": 1,
  "content": "댓글 내용"
}
```

#### 2. 게시글의 댓글 조회
```http
GET /api/comments/post/{postId}
```

#### 3. 댓글 수정
```http
PUT /api/comments/{id}
Content-Type: application/json

{
  "content": "수정된 댓글 내용"
}
```

#### 4. 댓글 삭제
```http
DELETE /api/comments/{id}
```

---

### 📨 쪽지 관련 API

#### 1. 쪽지 보내기
```http
POST /api/messages?senderId={senderId}&recipientId={recipientId}
Content-Type: application/json

{
  "content": "쪽지 내용"
}
```

#### 2. 받은 쪽지 목록
```http
GET /api/messages/received/{userId}
```

#### 3. 보낸 쪽지 목록
```http
GET /api/messages/sent/{userId}
```

#### 4. 쪽지 삭제
```http
DELETE /api/messages/{id}?userId={userId}
```

---

## Getting Started With Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
