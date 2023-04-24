import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, List, Avatar, Button, Drawer } from "antd";
import {
  BarChartOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as Echarts from "echarts";
import _ from "lodash";

const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [allList, setAllList] = useState([]);
  const barRef = useRef();
  const pieRef = useRef();

  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then((res) => {
        setViewList(res.data);
      });
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then((res) => {
        setStarList(res.data);
      });

    axios.get("/news?publishState=2&_expand=category").then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title));
      renderPieView()
      setAllList(res.data);
    });

    return () => {
      //组件销毁时，删除onresize事件
      window.onresize = null;
    };
  }, []);

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
        },
      },
      yAxis: { minInterval: 1 },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };

  const renderPieView = () => {
    var myChart = Echarts.init(pieRef.current);
    let currentList = allList.filter((data) => data.author === username);
    let groupObj = _.groupBy(currentList, (item) => item.category.title);//以类别进行分组

    let list = [];
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      });
    }
    var option = {
      title: {
        text: "当前用户新闻分类图示",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "70%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  myChart.setOption(option);
  };

  const {
    region,
    username,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                bordered
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                bordered
                dataSource={starList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <BarChartOutlined />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b style={{ marginRight: "10px" }}>
                      {region === "" ? "全球" : region}
                    </b>
                    <span>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
        <div
          ref={pieRef}
          style={{ marginTop: "30px", width: "100%", height: "400px" }}
        ></div>
        <div
          ref={barRef}
          style={{ marginTop: "30px", width: "100%", height: "400px" }}
        ></div>
      </div>
    </div>
  );
}
