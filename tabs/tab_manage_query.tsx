import React, { useEffect, useState } from 'react';
import { Button, Flex,Modal } from 'antd';
import { Space, Tag,Tooltip,Select } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import { Storage } from "@plasmohq/storage"


function TabManageQuery(props) {
  const { tags, setTags } = props;
  const storage = new Storage({area: "local" })
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [select, setSlect] = useState([])
  const [clickTab, setclickTab] = useState({title:'',url:'',favIconUrl: '',id: 11})
  var group_name='';
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const handleChange = (value: string) => {
    group_name = value
  };
  // 异步获取数据
  useEffect(() => {
    async function getData() {
      try {
        const tabs = await chrome.tabs.query({});
        setData(tabs);
        const t = await storage.get(tags);
        if( t != undefined && Array.isArray(t)&&t.length>0) {
          setTags(t)
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    getData();
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    
  }, []);

  async function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // 页面变为可见状态
      const tabs =await chrome.tabs.query({});
      setData(tabs);
    } else {
    
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }
  return ( 


    <div style={{
      flexDirection: "column",
      padding: 16
    }}>
      {console.log(data)}
      {console.log(Array.isArray(data))}
      {data.map(tab => (
        <div key={tab.id}>
          
            {/* <Button type="primary" size ='middle' style={{width: 200}}>{tab.title}</Button> */}
            <Tooltip placement="topRight" title={tab.title} color={'#108ee9'}>
            
            <Tag color="#108ee9" style={{width: "95%",textOverflow: 'ellipsis',overflow: 'hidden',}} >
            <Button  type="primary" style={{ width: 18, height: 18,minWidth:18 ,padding: 0}}  shape="circle" icon={<CloseOutlined  />} onClick={()=>{
                chrome.tabs.remove(tab.id)
                setData(data.filter(item => item.id != tab.id))
              }}/>
        <span onClick={async () => {
              console.log(tab)
              setclickTab({title:tab.title,url:tab.url,favIconUrl: tab.favIconUrl,id: tab.id})
              var group = await storage.get('group_name')
              if (group == undefined ){
                
              }else if(Array.isArray(group)){
                var s =[]
                group.map(
                  (g) =>{
                    s.push({value:g,label:g})
                  }
                )
                setSlect(s)
              }
              setOpen(true);
            }} style={{overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', color: 'black',fontWeight: 'bold'}}> {tab.title}</span>
    </Tag>
    <Modal
        title="收藏"
        open={open}
        onOk={async () => {
          setConfirmLoading(true);
          if (group_name != ''){
            var g = await storage.get("tabs_"+group_name)
            var new_group_value;
            console.log(g)
            console.log("clicketab:"+clickTab)
            if (g==undefined){
              new_group_value =[clickTab]
            }else if (Array.isArray(g)){
              new_group_value =[...g,clickTab]
            }
            // await storage.set(group_name,[])
            await storage.set("tabs_"+group_name,new_group_value)
          }
          setOpen(false);
          setConfirmLoading(false);
        }
      }
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Select
      defaultValue="选择分组"
      style={{ width: 120 }}
      onChange={handleChange}
      options={select}
    />
    <Button style={{marginLeft:100}} type="primary"  onClick={async ()=>{
      console.log("tab:"+clickTab)
      console.log(clickTab)
      const tags = await storage.get('tags')
      if (tags != undefined && Array.isArray(tags)&& tags.length>0){
        const new_tags = [...tags,{title: clickTab.title,url: clickTab.url,id:clickTab.id,favIconUrl:clickTab.favIconUrl}]
        await storage.set("tags",new_tags)
        setTags(new_tags)
      }else{
        const new_tags = [{title: clickTab.title,url: clickTab.url,id:clickTab.id,favIconUrl:clickTab.favIconUrl}]
        await storage.set("tags",new_tags)
        setTags(new_tags)
      }
      setOpen(false);
      setConfirmLoading(false);
    }}>添加到卡片</Button>
      </Modal>
        </Tooltip>
            
          {/* <a style={{textDecoration: "none",color: 'whilt'}} target = '_blank' href= {tab.url} >{tab.title}</a> */}
        </div>
      ))}
    </div>

  )
}

export default TabManageQuery