#!/bin/bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome http://localhost:8000 --disable-web-security --user-data-dir=/tmp/someDir/ &
python -m SimpleHTTPServer
