@echo off
echo 🚀 Eoullim 로컬 환경 실행
echo ================================

echo 📊 현재 실행 중인 서비스 확인...
netstat -an | findstr :8080
netstat -an | findstr :3000

echo.
echo 🔧 백엔드 서버 시작 (새 창에서)...
start "Eoullim Backend" cmd /k "cd /d C:\Eoullim\backend && mvn spring-boot:run"

echo ⏳ 백엔드 서버 시작 대기 (15초)...
timeout /t 15

echo 🎨 프론트엔드 서버 시작 (새 창에서)...
start "Eoullim Frontend" cmd /k "cd /d C:\Eoullim\frontend && npm start"

echo.
echo ✅ 서비스 시작됨:
echo   - Frontend: http://localhost:3001 (자동으로 브라우저에서 열림)
echo   - Backend:  http://localhost:8080
echo.
echo 📝 서비스를 중지하려면 각 창을 닫거나 Ctrl+C를 누르세요.

pause