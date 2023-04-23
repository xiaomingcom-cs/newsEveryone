import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch, Form, Input, Select } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal
const { Option } = Select
export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [current, setcurrent] = useState(null)
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const addForm = useRef([])
  const updateForm = useRef([])

  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      console.log(roleObj[roleId] === "superadmin")
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球",
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}
          onChange={() => handleChange(item)}
        ></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}
            disabled={item.default}
          ></Button>
          <Button type='primary' shape='circle' icon={<EditOutlined />}
            disabled={item.default} onClick={() => handleUpdate(item)}></Button>
        </div >
      }
    }
  ]

  //woc 随便试试用async await竟然可以了！！！
  const handleUpdate = async (item) => {
    //让模态框出现并且预填好该项的内容
    await setisUpdateVisible(true)
    if (item.roleId === 1) {
      //禁用
      setisUpdateDisabled(true)
    } else {
      //取消禁用
      setisUpdateDisabled(false)
    }

    //ref绑定在表单实例中的方法，下面的方法可以动态设定表单中的值
    updateForm.current.setFieldsValue(item)
    setcurrent(item)
    //react中状态的更新并不保证是同步的，设置为true的时候状态还没更新完，模态框没有创建出来，表单组件也没有生成出来
    //也就拿不到form值，因此要保证上面两条语句是同步的

    //为什么刷新之后第一次输出空，后续点击才能正常输出呢
    // console.log(updateForm)
    // setTimeout(() => {
    //   setisUpdateVisible(true)
    //   updateForm.current.setFieldsValue(item)
    // }, 0)
  }
  const handleChange = (item) => {
    //改变roleState
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    //同步后端
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
    //后续还需实现角色状态与是否能够登录联动
  }

  const confirmMethod = (item) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {

      },
    })
  }

  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOk = () => {
    console.log("add", addForm)
    addForm.current.validateFields().then(value => {
      console.log(value)
      setisAddVisible(false)

      //重置表单
      addForm.current.resetFields()

      //先post到后端，生成id(后端自增长生成)，再设置dataSource，方便后面的删除和更新，否则没有id不好处理
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data)
        //dataSource里面是有role的，而res.data只有roleId,因此需要加上role字段，否则添加之后不显示角色名称，刷新之后才显示
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })

    }).catch(err => {
      console.log(err)
    })
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setisUpdateVisible(false)
      console.log(value)
      console.log(isUpdateDisabled)
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      // setTimeout(setisUpdateDisabled(!isUpdateDisabled), 0)
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`, value)

    })
  }
  return (
    <div>
      <Button type='primary' onClick={() => setisAddVisible(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />

      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddVisible(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={addForm}
        ></UserForm>
      </Modal>

      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}
        ></UserForm>
      </Modal>

    </div>
  )
}
