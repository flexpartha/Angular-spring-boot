# Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
# Use npm install in Docker to avoid CI lockfile strictness in the build container.
# Omitting optional deps avoids native build failures for packages that only target
# non-Linux platforms.
RUN npm install --omit=optional
COPY . .
RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/basic-spring-boot-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -i 's|BACKEND_URL|'\"$BACKEND_URL\"'|g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
