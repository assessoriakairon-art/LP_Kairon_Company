FROM nginx:alpine

# Configuração customizada: gzip + cache de assets estáticos
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

EXPOSE 80
