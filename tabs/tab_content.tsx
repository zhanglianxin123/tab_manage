import React, { useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, Tag } from 'antd';
import { Storage } from "@plasmohq/storage"

function TabContent() {
    const storage = new Storage({area: "local" })
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [items,setItems] =useState([])
  const [isVisible, setIsVisible] = useState(false);
  function addItems(data) {
    setItems((prevData) => {
      return [...prevData, data];
    });
  }
    useEffect(() => {
        async function getData() {
          try {
            const group = await storage.get('group_name') //获取所有group的名字
            if (group != undefined && Array.isArray(group)){ //判断异常
                setData(group); // 将group放到数组
                var fns = []
                group.map(
                      async (group_name,index) =>{
                        var collections = await storage.get("tabs_"+group_name)
                        if (collections != undefined && Array.isArray(collections) && collections.length >0){
                            const child = <div key={index}>
                                {collections.map((collection)=>{
                                    return <Tag closeIcon onClose={async()=>{
                                        if (Array.isArray(collections)){
                                            await storage.set("tabs_"+group_name,collections.filter(item=>item.id != collection.id))
                                            setIsVisible(!isVisible)
                                        }
                                    }}><a style={{textDecoration: "none",color: 'whilt'}} target='_blank' href={collection.url}>{collection.title}</a></Tag>
                                })}
                            </div>
                            const item = {label: group_name,children:child,key:index}
                            addItems(item)
                        }
                    }
                )
            }
            setIsLoading(false);
          } catch (error) {
            console.error('Error:', error);
          }
        }
    
        getData();
      }, []);
   

    return (
        <div key={'tab-content'} style={{paddingTop: 20}}>
            <Collapse accordion items={items} />
        </div>
    )
}

export default TabContent