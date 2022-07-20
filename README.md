# 미니 갤러리

facebook 같이 다양한 기능과 velog 같이 깔끔한 UI를 가진 미니 SNS를 만드는 것이 목표다.

## Detail

썸네일은 세로 사진
만약 올린 사진이 가로 사진이면 추가로 설정

## 🧷 URL

### Root

/ -> Home - 세로 무한 스크롤로 컨텐츠를 표시 / + 버튼 눌러서 새로운 포스트 작성
/join -> 회원가입
/login -> 로그인

### User

/users/[userId] -> User Dashboard
/users/kakao-callback -> 카카오 로그인 인가코드 받기 && 백엔드에 로그인 요청 && 리다이렉트

### Post

/posts/[id] -> 게시물 보기 (중요)

### Tag

/tags -> 태그들 모음
/tags/[name] -> 태그에 해당하는 포스트들

### API

POST /api/users/kakao-login -> 카카오 로그인 요청 처리
GET /api/users/me -> 세션의 아이디와 일치하는 유저의 정보 반환 / 해당하는 유저가 없다면 에러 반환
POST /api/posts -> 새 게시글 생성
GET /api/posts -> 전체 게시물 정보 받아오기
GET /api/posts/[id] -> 특정 게시물 정보 받아오기
POST /api/comments-> 게시글에 새 댓글 작성
POST /api/comments/[id]-> 댓글 수정
DELETE /api/comments/[id]-> 댓글 삭제
