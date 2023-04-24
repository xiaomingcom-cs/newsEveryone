import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./index.css"
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {connect} from 'react-redux'

const { Sider } = Layout
const { SubMenu } = Menu
const menuList = [
  {
    key: '/home',
    icon: <UserOutlined />,
    label: '首页'
  },//需要加/，否则是在原有路由上追加，出现一个不存在的路由
  {
    key: '/user-manage',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      {
        key: '/user-manage/list',
        icon: <UserOutlined />,
        label: '用户列表'
      }
    ]
  },
  {
    key: '/right-manage',
    icon: <UserOutlined />,
    label: '权限管理',
    children: [
      {
        key: '/right-manage/role/list',
        icon: <UserOutlined />,
        label: '角色列表'
      },
      {
        key: '/right-manage/right/list',
        icon: <UserOutlined />,
        label: '权限列表'
      }
    ]
  }
]
//模拟icon的映射表
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage/": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      res => {
        setMenu(res.data)
      }

    )
  }, [])

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

  const checkPagePermission = (item) => {
    return item.pagepermisson !== undefined && rights.includes(item.key)//直接返回item.pagepermisson有时候可以，有时候不行，还是这样写保险
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      if (checkPagePermission(item)) {
        return <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
          // console.log(props)
          // console.log(item.title)
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
      }

    })
  } 
  const selectKey = [props.location.pathname]
  const openKey = ["/" + props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme='dark' mode='inline' selectedKeys={selectKey}
            defaultOpenKeys={openKey}>
            {renderMenu(menu)}

          </Menu>
        </div>
      </div>

    </Sider>
  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))