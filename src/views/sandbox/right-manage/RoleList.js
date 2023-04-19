import { Table,Button,Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'
import Item from 'antd/es/list/Item'
const {confirm} = Modal
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: "角色名称",
      dataIndex: 'roleName'
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
          onClick={() => confirmMethod(item)}
          ></Button>
          <Button type='primary' shape='circle' icon={<EditOutlined />}></Button>
        </div>
      }
    }


  ]
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
    // console.log(item)
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/roles/${item.id}`)
  }

  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(res => {
      // console.log(res.data)
      setdataSource(res.data)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      {/* Table中每一项必须有key,返回的数据中没有key,则需要将id作为key */}
    </div>
  )
}
