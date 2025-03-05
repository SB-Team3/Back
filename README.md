# 심부릉 - 커뮤니티 기반 심부름 앱
심부릉은 커뮤니티 기반의 **심부름 요청 및 수행 플랫폼**입니다.  
사용자들은 심부름을 등록하고, 주변 사용자들이 이를 수행하여 보상을 받을 수 있습니다.

---

## 📌 주요 기능
### ✅ **사용자 기능**
- 📝 **심부름 등록**: 사용자는 심부름을 요청하고, 보상 금액을 설정할 수 있습니다.
- 🔍 **심부름 목록 조회**: 등록된 심부름을 홈에서 확인하거나 검색창을 이용해 검색할 수 있습니다.
- 🤝 **심부름 수행 신청**: 원하는 심부름에 지원하고, 요청자와 채팅을 통해 세부 조율이 가능합니다.
- 🧾 **이용 내역**: 사용자는 자신이 신청한 심부름과 수행 요청한 심부름을 확인 할 수 있습니다.
- 💬 **실시간 채팅**: 심부름 요청자와 수행자가 원활하게 소통할 수 있도록 채팅 기능을 제공합니다.
- 💳 **보상 시스템**: 심부름 완료 후, 요청자가 수행자에게 보상을 지급할 수 있습니다.

---

## ⚙️ 기술 스택

| 분야        | 기술 |
|------------|------------------------------------------------------|
| **Frontend** | `React`, `module.CSS` |
| **Backend**  | `Node.js`, `Express.js`, `MongoDB` |
| **Database** | `MongoDB Atlas` |
| **Authentication** | `JWT (JSON Web Token)` |
| **Deployment** | `AWS EC2`|

---

## 🚀 프로젝트 실행 방법

### 1️⃣ **백엔드 실행**
```bash
# 레포지토리 클론
git clone https://github.com/your-repo/shimburung.git
cd shimburung/backend

# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일 필요)
.env

# 서버 실행
npm start
