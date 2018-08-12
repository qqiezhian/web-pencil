import React from "react";
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './Login.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor() {
    super();
    this.user = {username:'', password:''};
    console.log('NormalLoginForm constructor...');
  }
  handleChange = (e) => {
    let name = e.target.name;
    if (name == 'username') {
      this.user.username = e.target.value;
    } else {
      this.user.password = e.target.value;
    }
    //console.log(e.target.value);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      //console.log('Received values of form: ', values);
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    let history = this.context.router.history;
    console.log(history);
    console.log(this.user);

    fetch('http://localhost:3001/Login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.user)
    })
      .then(res => res.json())
      .then((token) => {
        this.user = {username:null, password:null};
        this.context.onAuthCb(this.user, token);
        history.push('/');
      }).catch((e) => {
        this.user = {username:null, password:null};
        console.log(e);
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input name="username" onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input name="password" onChange={this.handleChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }
}

NormalLoginForm.contextTypes = {
  router: PropTypes.object.isRequired,
  onAuthCb: PropTypes.func,
};

export default NormalLoginForm