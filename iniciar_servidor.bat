@echo off
title Servidor Localhost - Tabela Periodica Interativa
echo ========================================================
echo  Iniciando Servidor Localhost em http://localhost:8000/
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
