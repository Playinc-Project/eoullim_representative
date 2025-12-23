@echo off
echo 🐳 Eoullim Docker 환경 시작
echo ================================

echo 📦 기존 컨테이너 정리 중...
docker-compose down

echo 🔨 이미지 빌드 및 컨테이너 시작...
docker-compose up --build -d

echo ⏳ 서비스 준비 대기 중...
timeout /t 30

echo 📊 컨테이너 상태 확인...
docker-compose ps

echo ✅ 서비스 URL:
echo   - Frontend: http://localhost:3001
echo   - Backend:  http://localhost:8081
echo   - MySQL:    localhost:3306

echo 📝 로그 확인하려면: docker-compose logs -f [service명]
echo 🛑 서비스 중지하려면: docker-compose down

pause