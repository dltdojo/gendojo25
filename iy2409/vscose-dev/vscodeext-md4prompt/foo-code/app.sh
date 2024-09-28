#!/bin/bash
chmod +x /www/cgi-bin/todo.sh
busybox httpd -fv -p 3000 -h /www
