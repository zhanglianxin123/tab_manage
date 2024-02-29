import React, { useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import Icon, { EditOutlined, EllipsisOutlined, SettingOutlined,PlusOutlined} from '@ant-design/icons';
import {  Avatar, Card,Flex,Modal,Input,Alert  } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Storage } from "@plasmohq/storage"
function TabTags(props) {
  // const { parentState, setParentState } = props;
    const storage = new Storage({area: "local" })
    const { Meta } = Card;
    const {tags,setTags} = props;
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    var new_title =''
    var new_url=''
    var new_icon_url =''
    function addTags(data) {
        setTags((prevData) => {
          return [...prevData, data];
        });
      }
      const handleOk = async () => { //点击确定事件
        if (new_title == ''|| new_url==''||new_icon_url ==''){
            {<Alert message="请输入内容" type="warning" />}
            return 
        }
        const tags = await storage.get("tags")
        if (tags != undefined && Array.isArray(tags)&& tags.length>0){
            const new_tags = [...tags,{favIconUrl:new_icon_url,title:new_title,url: new_url,id:Math.floor(new Date().getTime() / 1000) % 10000000}]
            await storage.set("tags",new_tags)
            setTags(new_tags)
        }else{
            const new_tags = [{avIconUrl:new_icon_url,title:new_title,url: new_url,id:Math.floor(new Date().getTime() / 1000) % 10000000}]
            await storage.set("tags",new_tags)
            setTags(new_tags)
        }
        new_title =''
        new_url =''
        new_icon_url =''
        setOpen(false);
          setConfirmLoading(false);
      };
    
      const handleCancel = () => {
        new_title =''
        new_url =''
        new_icon_url =''
        console.log('Clicked cancel button');
        setOpen(false);
      };

      useEffect(() => {
        async function getData() {
          try {
            const t = await storage.get('tags') //获取所有group的名字
            if (t != undefined && Array.isArray(t)&&t.length>0){
                setTags(t)
            }
            setIsLoading(false);
          } catch (error) {
            console.error('Error:', error);
          }
        }
    
        getData();
        console.log("tags"+tags)
      }, []);
    return (
        <div key={'tab_tags'}>
             <Flex wrap="wrap" gap="small">
                {
                    tags.map((tag)=>{
                        return (<Card
                        onClick={()=>{
                          window.open(tag.url)
                        }}
                            extra={
                                <CloseOutlined onClick={async(event)=>{
                                  event.stopPropagation();
                                    const new_tags = tags.filter(item=> item.id != tag.id)
                                    await storage.set('tags',new_tags)
                                    setTags(new_tags)
                                }}/>    
                            }
                        style={{ width: 200 }}
    cover={
      <img
        alt="example"
        src={tag.favIconUrl}
      />
    }
                        >
                        <Meta
                            
      title={tag.title}
    />
                        </Card>)
                         
                    })
                }
  <Card style={{width:200}} cover={<PlusOutlined onClick={()=>{
    // 弹窗 输入链接和标题
    setOpen(true)
  }} style={{fontSize:100,padding:30}}/>}>
  <Meta
      title="添加卡片"
    />
  </Card>
  </Flex>
  <Modal
        title="添加"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input style={{padding:10}} placeholder="标题" onChange={(e)=>{
          new_title = e.target.value
        }} />
        <div style={{padding:10}}></div>
        <Input style={{padding:10}} placeholder="链接" onChange={(e)=>{
          new_url = e.target.value
        }} />
        <div style={{padding:10}}></div>
        <Input style={{padding:10}} placeholder="图标链接" onChange={(e)=>{
          new_icon_url = e.target.value
        }} />
      </Modal>
  </div>
    )
}
export default TabTags