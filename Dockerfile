FROM node:latest AS builder
WORKDIR /accHandler
COPY . .
RUN npm config set legacy-peer-deps true && npm install
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./* && rm -rf /etc/nginx/conf.d/default.conf
COPY --from=builder /accHandler/build .
COPY nginx.conf /etc/nginx/conf.d/

# run docker with --network="host"
RUN sed -i "s,back_end_server,127.0.0.1:8080," /etc/nginx/conf.d/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]