FROM nginx:alpine

# WORKDIR /app

COPY . /usr/share/nginx/html
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/javascript application/json image/svg+xml; \
    gzip_min_length 1000; \
    \
    # Cache static assets \
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ { \
        expires 1d; \
        add_header Cache-Control "public, max-age=86400"; \
    } \
    \
    # For single page applications \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Health check endpoint for load balancers \
    location /health { \
        access_log off; \
        return 200 "healthy\\n"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080