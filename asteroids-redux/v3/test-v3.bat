@echo off
echo Starting Asteroids Redux V2 Test Server...
echo.
echo Server starting in v2 folder...
echo Open your browser to: http://localhost:8000/splash-v2.html
echo.
echo Press Ctrl+C to stop the server
echo.
start http://localhost:8000/splash-v2.html
python -m http.server 8000
