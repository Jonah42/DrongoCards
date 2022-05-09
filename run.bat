@ECHO OFF
del .\dist /Q
CALL node_modules\.bin\webpack && (CALL ROBOCOPY .\src .\dist *.css *.html /S || CALL http-server .\dist)
