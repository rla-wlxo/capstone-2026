# 1. Node.js 환경 설정 (사용 중인 노드 버전이 있다면 숫자를 바꾸세요)
FROM node:18-alpine

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치 (라이브러리 목록부터 복사해서 캐시 효율을 높임)
COPY package*.json ./
RUN npm install

# 4. 프로젝트의 모든 소스 코드 복사
# (public, src, index.ejs 등 모든 파일이 컨테이너 안으로 들어갑니다)
COPY . .

# 5. 실행 명령
# 보통 Node.js 앱은 'npm start' 또는 'node src/app.js'로 실행합니다.
# package.json의 scripts에 정의된 명령어를 확인해 보세요.
CMD ["npm", "start"]