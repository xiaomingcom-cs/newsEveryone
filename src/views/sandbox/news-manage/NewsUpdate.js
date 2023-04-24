import React, { useEffect, useState,useRef } from 'react'
import { Steps, Button,Form,Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { PageHeader } from '@ant-design/pro-layout'

const {Option} = Select
export default function NewsUpdate(props) {
  const [current, setcurrent] = useState(0) 
  const [categoryList, setcategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")
  const handleNext = () => {
    
    if (current == 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setcurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content === "" || content.trim()==="<p></p>") {
        message.error("请输入新闻内容")
      } else {
        setcurrent(current+1)
      }
    }
  }
  const handlePre = () => {
    setcurrent(current-1)
  }
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: {span: 20}
  }
  useEffect(() => {
    axios.get("/categories").then(res => {
      setcategoryList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      let { title, categoryId, content } = res.data;
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, [])
  const NewsForm = useRef(null)

  const {region,username,roleId} = JSON.parse(localStorage.getItem("token"))
  const handleSave = (auditState) => {
    axios.patch( `/news/${props.match.params.id}`, {
      ...formInfo,
      "content": content,  
      "auditState": auditState,
      // "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: '通知',
        description: `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:'bottomRight',
      })
    })
  }
  return (
    <div>
      <PageHeader
        className='site-page-header'
        title="更新新闻"
        onBack={()=>props.history.goBack()}
        subTitle="This is a subtitle"
      />
      <Steps style={{marginTop:'50px'}}
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类'
          },
          {
            title: '新闻内容',
            description: '新闻主体内容'
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核'
          }
          
        ]}

      />
      <div style={{marginTop:"50px"}}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            {...layout}
            name='basic'
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{required: true,message:'Please input the news title!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{required: true,message:'please select the news category!'}]}
            >
              <Select>
                {
                  categoryList.map(item => 
                    <Option value={item.id} key={item.id}>{item.value}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => { setContent(value) }}
            content={content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>
      <div style={{marginTop:"50px"}}>
        {
          current===2 && <span>
            <Button type='primary' onClick={()=>handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current<2 && <Button type='primary' onClick={handleNext} >下一步</Button>
        }
        {
          current>0 && <Button onClick={handlePre}>上一步</Button>
        }
      </div>
    </div>
  )
}
