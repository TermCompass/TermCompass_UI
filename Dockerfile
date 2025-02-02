# Node.js 18을 베이스 이미지로 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production

# 의존성 설치를 위해 package.json과 package-lock.json 복사
COPY package.json package-lock.json* ./

# 의존성 설치 (생산 환경 종속성만 설치)
RUN npm ci --only=production

# 프로젝트 전체 파일 복사
COPY . .

# 빌드 실행
RUN npm run build

# 포트 개방
EXPOSE 3000

# Next.js 서버 시작 명령어
CMD ["npm", "run", "start"]
