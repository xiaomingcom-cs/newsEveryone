import React from "react";
import { Table} from "antd";

export default function AuditList(props) {
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      render: (author) => {
        return <span>{author}</span>;
      },
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <span>{category?.value}</span>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
