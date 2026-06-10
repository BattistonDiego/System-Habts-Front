# Etapa 1: Build do Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration=development

# Etapa 2: Servir com Nginx
FROM nginx:alpine
COPY --from=build /app/dist/mfe-habitos-front/browser /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]