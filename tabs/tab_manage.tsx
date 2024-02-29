import React, { useEffect, useState } from 'react';
import { Storage } from "@plasmohq/storage"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme,Modal,Input  } from 'antd';
import './tab_manage.css'
import TabManageQuery from './tab_manage_query';
import TabContent from './tab_content';
import TabTags from './tab_tags';

function DeltaFlyerPage() {
  // 创建一个名为 parentState 的状态变量，并初始化为空对象
  const [tags, setTags] = useState([]);


  const storage = new Storage({area: "local" })
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  // const [group, addGroup] = useState([]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let group =await  storage.get('group_name')
    if (group == undefined) {
      await storage.set('group_name',[new_group_name])
    }else{
      let new_group = [...group,new_group_name]
      await storage.set('group_name',new_group)
      
    }
    setOpen(false);
      setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  let new_group_name;
  
  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={1} width={250}  style={{maxHeight:'calc(100vh)', overflowY: 'auto'}}>
      <div  style={{ display: collapsed? 'none':'block',}}>
    {!collapsed && <TabManageQuery tags={tags} setTags={setTags}></TabManageQuery>}
  </div>
        
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
           <div style={{ float: 'right' ,paddingRight:20 }}> 
           <Button type="primary" onClick={showModal}>添加分组</Button>
           <Modal
        title="添加分组"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input onChange={(e)=>{
          new_group_name = e.target.value
        }} />
      </Modal>
           </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            paddingTop: 60,
            paddingLeft:100,
            paddingRight: 100,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <TabTags tags={tags} setTags={setTags}></TabTags>
          <TabContent></TabContent>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DeltaFlyerPage