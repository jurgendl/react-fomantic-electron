call node clean.cjs
call yarn build
@echo off
:: Get start time
for /f "tokens=1-4 delims=:.," %%a in ("%TIME%") do (
    set /a start_hour=%%a
    set /a start_minute=%%b
    set /a start_second=%%c
)
@echo on
call npx electron-builder
@echo off
:: Get end time
for /f "tokens=1-4 delims=:.," %%a in ("%TIME%") do (
    set /a end_hour=%%a
    set /a end_minute=%%b
    set /a end_second=%%c
)
:: Convert times to total seconds
set /a start_total=%start_hour%*3600 + %start_minute%*60 + %start_second%
set /a end_total=%end_hour%*3600 + %end_minute%*60 + %end_second%
:: Handle midnight rollover
if %end_total% lss %start_total% (
    set /a end_total+=86400
)
:: Calculate elapsed time
set /a elapsed_seconds=end_total - start_total
set /a elapsed_minutes=elapsed_seconds / 60
set /a remaining_seconds=elapsed_seconds %% 60
echo Time taken: %elapsed_minutes% minute(s) %remaining_seconds% second(s)
pause
