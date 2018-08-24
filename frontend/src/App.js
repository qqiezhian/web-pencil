import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Form,Icon } from 'antd';

import {
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./Home";
import Stuff from "./Stuff";
import Contact from "./Contact";
import NormalLoginForm from "./Login"
import UserCtrl from './UserCtrl'
import QuestionManger from './Question'

const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;

require('es6-promise').polyfill()


const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const AppHeader = (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={['home']}
    style={{lineHeight:'64px',
      position:'relative',
      left:'30%'}}
  >
  <Menu.Item key="home">
        <Link to="/" ><Icon type="home" />主页</Link>
      </Menu.Item>
      <Menu.Item key="message">
        <Link to="/Message" ><Icon type="message" />消息</Link>
      </Menu.Item>
      <Menu.Item key="question">
        <Link to="/Question" ><Icon type="question-circle-o" />题库</Link>
      </Menu.Item>
      <SubMenu title={<span><Icon type="setting" />临时账号管理</span>} >
        <Menu.Item key="addAccount">
          <Link to="/ProduceAccount" >批量生成</Link>
        </Menu.Item>
        <Menu.Item key="delAccount">
          <Link to="/DeleteAccount" >删除账号</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu title={<span><Icon type="user" />我的账户</span>}>
        <Menu.Item key="userinfo">
          <Link to="/User" >账户信息</Link>
        </Menu.Item>
        <Menu.Item key="quit">
          <Link to="/User/Quit" >退出</Link>
        </Menu.Item>
      </SubMenu>
  </Menu>
)
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/Login' component={WrappedNormalLoginForm} />
      <Route path='/Message' component={Stuff} />
      <Route path='/Question' component={QuestionManger} />
      <Route path='/User' component={UserCtrl} />
    </Switch>
  </main>
)

class App extends Component {

  render() {
    return (
      <Layout className="layout">
        <Header >
          {AppHeader}
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Main/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Web Pencil ©2018 Created by qqiezhian@163.com
    </Footer>
      </Layout>
    )
  }
}

export default App
