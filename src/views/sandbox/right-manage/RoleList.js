import { Table, Button, Modal, Tree } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'
import Item from 'antd/es/list/Item'
const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [isModalOpen, setisModalOpen] = useState(false)
  const [currentId, setcurrentId] = useState(0)
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
          <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
            setisModalOpen(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }}></Button>
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

  const handleOk = () => {
    setisModalOpen(false)
    setdataSource(dataSource.map(item => {
      if (currentId === item.id) {
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))

    axios.patch(`http://localhost:8000/roles/${currentId}`, {
      rights: currentRights
    })
  }
  const handleCancel = () => {
    setisModalOpen(false)
  }

  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(res => {
      // console.log(res.data)
      setdataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      // console.log(res.data)
      setrightList(res.data)
    })
  }, [])

  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      {/* Table中每一项必须有key,返回的数据中没有key,则需要将id作为key */}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        >

        </Tree>
      </Modal>
    </div>
  )
}
