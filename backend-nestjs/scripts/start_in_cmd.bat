@echo off
rem 실행 방법: 이 파일을 더블클릭하거나 어떤 터미널에서든 아래 명령으로 실행하세요:
rem cmd.exe /c "C:\Eoullim\backend-nestjs\scripts\start_in_cmd.bat"

rem 스테이징 환경에서 TypeORM 쿼리 로깅을 임시 활성화하고 개발 서버로 시작합니다.
cd /d "%~dp0.."

rem ENABLE_QUERY_LOGGING=true 설정
set ENABLE_QUERY_LOGGING=true
echo ENABLE_QUERY_LOGGING=%ENABLE_QUERY_LOGGING%

rem 개발 모드로 실행
echo Starting NestJS (development)...
npm run start:dev

rem 프로덕션으로 실행하려면 아래 주석을 사용하세요:
rem set ENABLE_QUERY_LOGGING=true && npm run build && npm run start:prod
