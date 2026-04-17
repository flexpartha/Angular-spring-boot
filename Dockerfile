# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/basic-spring-boot-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -i 's|BACKEND_URL|'\"$BACKEND_URL\"'|g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
