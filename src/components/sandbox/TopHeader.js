import React, { useState } from 'react'
import { Layout, Dropdown,Menu,Avatar } from 'antd'
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'

const { Header } = Layout

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {

    props.changeCollapsed()
  }
  const {role:{roleName},username} =JSON.parse(localStorage.getItem('token')) 

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            roleName
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
      {props.isCollapsed ? <MenuFoldOutlined onClick={changeCollapsed} />
        : <MenuUnfoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>

  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))