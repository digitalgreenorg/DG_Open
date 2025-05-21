server {
    listen      80;
    server_name ${PUBLIC_DOMAIN};
    server_tokens off;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$$host$$request_uri;
    }
}

server{
    listen      443 ssl;
    server_name ${PUBLIC_DOMAIN};
    client_max_body_size 100M;

    ssl_certificate_key /etc/nginx/cert/private.key;
    ssl_certificate /etc/nginx/cert/public.crt;

    location /be/ {
        proxy_redirect off;
        proxy_pass http://datahub-be:8000/;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }

    location /media/ {
        proxy_redirect off;
        proxy_pass http://datahub-be:8000/media/;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }

    location /django_cache/ {
        proxy_redirect off;
        proxy_pass http://datahub-be:8000/django_cache/;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }

    location / {
        root      /usr/share/nginx/html;
        index     index.html index.htm;
        try_files $uri /index.html;
    }

}