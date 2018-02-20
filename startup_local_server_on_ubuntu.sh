#!/bin/bash
google-chrome http://localhost:8000 --disable-web-security --user-data-dir=/tmp/someDir/ &
python -m SimpleHTTPServer
