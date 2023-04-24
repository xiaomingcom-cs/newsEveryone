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
新闻管理 审核 发布 状态管理
* 业务字段
  * 审核流程 auditState(0：未审核/1：正在审核/2：已通过/3：未通过)
  * 发布流程 publishState(0：未发布/1：待发布(审核通过)/2：已发布/3：已下线)

redux状态保存在内存中，刷新之后状态就会变为初始状态，因此需要对某些状态持久化(redux-persist,比如isCollapsed状态)

特点
* 路由和权限挂钩 不能通过路由渗透没有权限的页面(路由校验)
  * 动态创建路由(根据pagePermisson和用户具有的权限列表进行动态创建)
