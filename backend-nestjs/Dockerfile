FROM node:18-alpine

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 포트 노출
EXPOSE 8081

# 운영 환경 실행
CMD ["node", "dist/main"]

# Container-level healthcheck (reads readiness endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
	CMD wget -qO- --timeout=5 http://localhost:8081/api/health || exit 1