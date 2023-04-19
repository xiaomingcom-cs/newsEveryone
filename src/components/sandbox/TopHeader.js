import React, { useState } from 'react'
import { Layout, Dropdown,Menu,Avatar } from 'antd'
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
const { Header } = Layout

function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            '超级管理员'
          ),
        },
        {
          key: '2',
          danger: true,
          label: '退出',
          onClick: () => {
            localStorage.removeItem("token")
            props.history.replace('/login')
          }
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {collapsed ? <MenuFoldOutlined onClick={changeCollapsed} />
        : <MenuUnfoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: "right" }}>
        <span>欢迎admin回来</span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>

  )
}

export default withRouter(TopHeader)