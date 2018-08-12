import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { Form, Menu } from 'antd';

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

const SubMenu = Menu.SubMenu;

require('es6-promise').polyfill()


const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

function AppHeader(props) {
  const isAuthenticated = props.isAuthenticated;

  return (
    <Menu mode="horizontal">
      <Menu.Item key="home">
        <Link to="/" >主页</Link>
      </Menu.Item>
      <Menu.Item key="message">
        <Link to="/Message" >消息</Link>
      </Menu.Item>
      <Menu.Item key="question">
        <Link to="/Question" >题库</Link>
      </Menu.Item>
      <SubMenu title={<span>临时账号管理</span>}>
        <Menu.Item key="addAccount">
          <Link to="/ProduceAccount" >批量生成</Link>
        </Menu.Item>
        <Menu.Item key="delAccount">
          <Link to="/DeleteAccount" >删除账号</Link>
        </Menu.Item>
      </SubMenu>
      {isAuthenticated ? (<SubMenu title={<span>我的账户</span>}>
        <Menu.Item key="userinfo">
          <Link to="/User" >账户信息</Link>
        </Menu.Item>
        <Menu.Item key="quit">
          <Link to="/User/Quit" >退出</Link>
        </Menu.Item>
      </SubMenu>) : (
          <Menu.Item key="login">
            <Link to="/Login" >登录</Link>
          </Menu.Item>
        )}
    </Menu>
  );
}

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/Login' component={WrappedNormalLoginForm} />
      <Route path='/Message' component={Stuff} />
      <Route path='/Question' component={Contact} />
      <Route path='/User' component={UserCtrl} />
    </Switch>
  </main>
)

class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      jwToken: null,
      user: null,
    };
    this.onAuthCb = this.onAuthCb.bind(this);
    this.onUserQuitCb = this.onUserQuitCb.bind(this);
    console.log('App constructor...');
  }
  componentDidMount(){
    if(!window.localStorage){
      alert("浏览器不支持localstorage");
      return false;
    }else {
      let storage = window.localStorage;
      let token = storage.getItem('jwToken');
      console.log('componentDidMount...,jwToken', token);
      if (token) {
        this.setState({
          jwToken: token,
          isAuthenticated: true
        });
      }
    }
  }
  getChildContext() {
    return {
      onAuthCb: this.onAuthCb.bind(this),
      onUserQuitCb: this.onUserQuitCb.bind(this),
      token: this.jwToken,
    };
  }
  onAuthCb(user, token) {
    console.log('jwToken =', token);
    if (token) {
      this.setState({
        jwToken: token,
        isAuthenticated: true,
        user: user
      });
      let storage = window.localStorage;
      storage.setItem('jwToken', token);
    }
  }
  onUserQuitCb() {
    this.setState({
      jwToken: null,
      isAuthenticated: false,
      user: null,
    });
    let storage = window.localStorage;
    storage.removeItem('jwToken');
  }

  render() {
    return (
      <div>
        <AppHeader isAuthenticated={this.state.isAuthenticated} />
        <Main />
      </div>
    )
  }
}

App.childContextTypes = {
  onAuthCb: PropTypes.func,
  onUserQuitCb: PropTypes.func,
  token: PropTypes.string,
};
export { App, Main };
