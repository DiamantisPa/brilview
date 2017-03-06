while true ; do  echo -e "HTTP/1.1 200 OK\n\n hello" | nc -l -p 1500  ; done
