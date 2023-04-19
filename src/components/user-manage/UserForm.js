
import React, { forwardRef, useEffect, useState, } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch, Form, Input, Select } from 'antd'
import axios from 'axios'
const { confirm } = Modal
const {Option} = Select
const UserForm = forwardRef((props,ref)=> {
  const [isDisabled, setisDisabled] = useState(false);
  useEffect(() => {
    setisDisabled(props.isUpdateDisabled)
  },[props.isUpdateDisabled])//依赖的值(父组件传过来的)改变就会重新执行一遍
  return (
    <div>
      <Form
        ref={ref}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="地区"
          rules={isDisabled?[]:[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Select disabled={isDisabled}>
            {props.regionList.map((item) => {
              return <Option value={item.value} key={item.value}>{item.title}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Select onChange={(value) => {
            if (value === 1) {
              setisDisabled(true)
              ref.current.setFieldsValue({
                region:""
              })
            } else {
              setisDisabled(false)
            }
          }}>
            {props.roleList.map((item) => {
              return <Option value={item.id} key={item.id}>{item.roleName}</Option>
            })}
          </Select>
        </Form.Item>

      </Form>
    </div>
  )
})
export default UserForm
