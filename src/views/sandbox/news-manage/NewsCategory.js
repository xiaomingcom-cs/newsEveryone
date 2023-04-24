import React, { useEffect, useState, useContext, useRef } from "react";
import { Button, Table, Form, Input,Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  const EditableContext = React.createContext(null);

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setDataSource(res.data);
    });
  }, []);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = (record) => {
    setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.value
        }
      }
      return item
    }))
    axios
      .patch(`/categories/${record.id}`, {
        title: record.title,
        value: record.value
      })
      
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave: handleSave,
      }),
    },
    {
      title: "操作",
      render: (item) => {
        return <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)}/>;
      },
    },
  ];

  const confirmMethod = (item) => {
    confirm({
      title: "您确定要删除?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onConcel() {
        
      }
    })
  }

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data=>data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
        }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      ></Table>
    </div>
  );
}
