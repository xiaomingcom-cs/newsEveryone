# newsEveryone

 news manage system to make everyone can view,write and publish  news!

 部署指南
 ```shell
 cd db
 #启动接口服务
 json-server --watch db.json --port 8000 
 cd ..
 npm start
```
 首次登陆没有token，可通过localStorage.setItem("token","xxx")的方式模拟token，即可进入home页面


