
# Build react app
FROM node:14 as build-image
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# copy static files and run nginx server
FROM nginx:alpine
COPY --from=build-image /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

