# #制定node镜像的版本
# FROM node:8.9-alpine
# #移动当前目录下面的文件到app目录下
# ADD . /app/
# #进入到app目录下面，类似cd
# WORKDIR /app
# #安装依赖
# RUN npm install
# #对外暴露的端口
# EXPOSE 3001
# #程序启动脚本
# CMD ["node", "."]

# pull nginx image

FROM nginx:alpine

ADD . /app/

WORKDIR /app

# 從第一階段的檔案copy
COPY ./dist/healthmonitor /usr/share/nginx/html

# 覆蓋image裡的設定檔
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf 

