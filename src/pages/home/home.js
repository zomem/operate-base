import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Row, Col } from 'antd'

import TableList from '../../component/setting/table/table'

import './home.css'
import '../../App.css'

const { SubMenu } = Menu
const { Header, Content, Sider, Footer } = Layout


function Home(){
  const [openKeys, setOpenKeys] = useState([])
  const [itemKey, setItemKey] = useState('test')
  
  const onOpenChange = (key) => {
    if(openKeys.length === 0){
      setOpenKeys(key)
    }else{
      setOpenKeys([key[key.length-1]])
    }
  }


  const handleMenuItem = (e) => {
    setItemKey(e.key)
  }

  return(
    <Layout className='layout'>
      <Header className='header'>
        <div className='frsc'>
          <div style={{width: '100px'}}>运营管理后台</div>
        </div>
      </Header>
      <Layout> 

        <Sider width={200} className='sider'>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ width: 200 }}
            onClick={handleMenuItem}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="area-chart" />
                  <span>栏目</span>
                </span>
              }
            >
              <Menu.Item key="test">标题一</Menu.Item>
            </SubMenu>
            
            <SubMenu
              key="setting"
              title={
                <span>
                  <Icon type="setting" />
                  <span>设置</span>
                </span>
              }
            >
              <Menu.Item key="table-list">表和字段检测</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Content className='content'>
            {
              {
                'test': <div style={{width: '100%', height: '70%', textAlign: 'center', marginTop: '5%' }}>使用React组件开发想要的功能</div>,
                'table-list': <TableList />
              }[itemKey]
            }
            <Footer className='footer'>Copyright © 2019 重庆朝默网络科技有限公司提供技术支持</Footer>
          </Content>
        </Layout>

      </Layout>
    </Layout>
  )
}

export default Home