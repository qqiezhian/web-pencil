import React from "react";
import PropTypes from 'prop-types';
import { Modal, Tabs, Input, Button, message,Table } from 'antd';

import {
    Switch,
    Route,
} from "react-router-dom";

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class UserQuit extends React.Component {
    constructor() {
        super();
        this.isQuit = false;
        this.quit = this.quit.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
    }
    quit() {
        this.isQuit = true;
        let onUserQuitCb = this.context.onUserQuitCb;
        onUserQuitCb();
        let history = this.context.router.history;
        history.push('/Login');
    }
    showConfirm(okCb, cancelCb) {
        confirm({
            title: 'Do you want to quit?',
            content: 'When clicked the OK button, this dialog will be closed after 1 second',
            onOk() {
                if (okCb) {
                    okCb();
                }
            },
            onCancel() {
                if (cancelCb) {
                    cancelCb();
                }
            },
        });
    }
    componentDidMount() {
        this.showConfirm(this.quit);
    }

    render() {
        /*
        return (
            <div>
            <h2>{this.isQuit}</h2>
            </div>
        )*/

        return ((this.isQuit) ?
            (<div>退出成功！</div>) : (<div></div>)
        );
    }
}
const columns = [{
    title: 'Name',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: 'Password',
    dataIndex: 'password',
    key: 'password',
  }, {
    title: 'Userid',
    dataIndex: 'userid',
    key: 'userid',
  }, ];

class UserList extends React.Component {
    
    constructor() {
        super();
        this.state = {
            element: [],
        };
        console.log('UserList constructor...');
    }
    componentDidMount() {
         fetch('http://localhost:3001/users', {
             method: 'GET',
             headers: {
                 'Accept': 'application/json',
             },
         })
             .then(res => res.json())
             .then(users => {
                 console.log('Users...',users);
                 this.setState({
                     element: users,
                 });
             }).catch((e) => {
                 console.log(e);
             })
    }
    render() {
        return (
        <div>
            <Table columns={columns} dataSource={this.state.element} />
        </div>
        
        );
    }
}

class ModPassword extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.currentpwd = '';
        this.newpwd = '';
        this.confirmpwd = '';
    }
    msgDisplay(level, msg) {
        let display;
        switch (level) {
            case 'warning':
                display = message.success;
                break;
            case 'error':
                display = message.error;
                break;
            case 'succ':
                display = message.success;
                break;
            default:
                display = message.success;
                break;
        }
        display(msg, 3);
    };

    onChange(e) {
        let name = e.target.name;
        if (name == 'currentpwd') {
            this.currentpwd = e.target.value;
        } else if (name == 'newpwd') {
            this.newpwd = e.target.value;
        } else {
            this.confirmpwd = e.target.value;
        }
    }
    onSubmit() {
        console.log('currentpwd ', this.currentpwd);
        console.log('newpwd ', this.newpwd);
        console.log('confirmpwd ', this.confirmpwd);
        if (this.confirmpwd != this.newpwd) {
            this.msgDisplay('error', '新密码不匹配');
            return;
        } else {
            this.msgDisplay('succ', '修改成功');
        }
    }
    render() {
        return (
            <div>
                <Input addonBefore="请输入当前密码" type="password" name="currentpwd" onChange={this.onChange} />
                <Input addonBefore="请输入新密码" type="password" name="newpwd" onChange={this.onChange} />
                <Input addonBefore="请确认新密码" type="password" name="confirmpwd" onChange={this.onChange} />
                <Button htmlType="submit" onClick={this.onSubmit}>确定</Button>
            </div>
        )
    }
}
class UserInfo extends React.Component {
    render() {
        return (
            <div>
                <h2>This is UserInfo !</h2>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="用户信息" key="1"><UserList /></TabPane>
                    <TabPane tab="修改密码" key="2"><ModPassword /></TabPane>
                    <TabPane tab="重置邮件" key="3">Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        )
    };
}
const Main = () => (
    <main>
        <Switch>
            <Route exact path='/User' component={UserInfo} />
            <Route path='/User/Quit' component={UserQuit} />
        </Switch>
    </main>
)

class UserCtrl extends React.Component {
    render() {
        return (
            <div>
                <Main />
            </div>
        );
    }
}
UserList.contextTypes = {
    token: PropTypes.string,
};

UserCtrl.contextTypes = {
    router: PropTypes.object.isRequired,
    onUserQuitCb: PropTypes.func,
};

UserQuit.contextTypes = {
    router: PropTypes.object.isRequired,
    onUserQuitCb: PropTypes.func,
};

export default UserCtrl