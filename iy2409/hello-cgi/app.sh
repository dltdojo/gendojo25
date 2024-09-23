#!/bin/sh
chmod +x /www/cgi-bin/cgiapp.sh
busybox httpd -fv -p 3000 -h /www
