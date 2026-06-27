# Build stage
FROM node:24-bullseye-slim AS build
WORKDIR /app
COPY package*.json ./
# Use npm ci for reproducible installs and skip optional native deps.
# Debian-based image is more compatible than Alpine for npm install.
RUN npm ci --omit=optional
COPY . .
RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/basic-spring-boot-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -i 's|BACKEND_URL|'\"$BACKEND_URL\"'|g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
