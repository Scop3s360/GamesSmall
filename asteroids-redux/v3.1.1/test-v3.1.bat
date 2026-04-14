@echo off
echo Starting Asteroids Redux V3.1 Test Server...
echo.
echo Server starting in v3.1 folder...
echo Open your browser to: http://localhost:8000/splash-v3.1.html
echo.
echo Press Ctrl+C to stop the server
echo.
start http://localhost:8000/splash-v3.1.html
python -m http.server 8000
