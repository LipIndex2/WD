@echo off

:: 检查 Node.js 是否安装
echo Checking Node.js installation...
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js not installed. Please install Node.js and npm first.
    pause
    exit /b 1
)

:: 检查 npm 是否安装
echo Checking npm installation...
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo npm not installed. Please install Node.js and npm first.
    pause
    exit /b 1
)

:: 提示 Node.js 和 npm 已安装
echo Node.js and npm are installed.

:: 运行当前目录下的 JavaScript 脚本
echo Running toExcel.js...
node "%~dp0toExcel.js"
if %ERRORLEVEL% NEQ 0 (
    echo Error occurred while running toExcel.js.
    pause
    exit /b 1
)

:: 暂停以查看输出结果
pause
