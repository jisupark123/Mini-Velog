# 미니 갤러리

facebook 같이 다양한 기능과 velog 같이 깔끔한 UI를 가진 미니 SNS를 만드는 것이 목표다.

## Detail

썸네일은 세로 사진
만약 올린 사진이 가로 사진이면 추가로 설정

## 🧷 URL

### Root

/ -> Home - 세로 무한 스크롤로 컨텐츠를 표시 (중요)
/join -> 회원가입
/login -> 로그인

### User

/users/[userId] -> User Dashboard

### Post

/posts/[postId] -> 게시물 보기 (중요)
/posts/upload -> 새 글 작성 - 사진 하나에 멘트, 태그달기 (중요)

### API

/api/posts(post) -> 새 게시글 생성
/api/posts/[id]/comments -> 게시글에 댓글 작성
