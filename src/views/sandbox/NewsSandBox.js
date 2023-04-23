import React, { useEffect, useState } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import Nopermission from './nopermission/Nopermission'
import { Layout, Menu } from 'antd'
import './NewsSandBox.css'
import NewsAdd from './news-manage/NewsAdd'
import NewsDraft from './news-manage/NewsDraft'
import NewsCategory from './news-manage/NewsCategory'
import Audit from './audit-manage/Audit'
import AuditList from './audit-manage/AuditList'
import Unpublished from './publish-manage/Unpublished'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
const { Content } = Layout

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}

export default function NewsSandBox() {
  nProgress.start()
  useEffect(() => {
    nProgress.done()
  })
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const checkRoute = (item) => {
    return item.pagepermisson
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
          <Switch>
            {
              BackRouteList.map(item => {
                if (LocalRouterMap[item.key]) {
                  if (checkRoute(item) && checkUserPermission(item)) {
                    return <Route path={item.key} key={item.key}
                      component={LocalRouterMap[item.key]} exact />
                  }
                  return <Nopermission />
                }
              })
            }
            <Redirect from='/' to="/home" exact />
            {/* 如果此时是/路径(模糊匹配，只要是/开头都能匹配到)，不能不显示，就默认显示/home */}
            {
              BackRouteList.length > 0 && <Route path="*"
                component={Nopermission} />
            }
          </Switch>
        </Content>
      </Layout>
    </Layout>

  )
}
