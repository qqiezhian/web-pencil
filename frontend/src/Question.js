import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Row, Col, Modal, Form, Input, Icon, Button, Menu, Dropdown, Card, message, List, Spin } from 'antd';

import './Question.css';
import { Meta } from "antd/lib/list/Item";

const { TextArea } = Input;
const FormItem = Form.Item;

/*props中defaultvalue不为空说明是编辑，否则就是新增 */
class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.uuid = 0;
    this.callback = props.callback;
    this.defaultvalue = null;
    this.defaultkeys = [];
    console.log('question edit, default value..', props.defaultvalue);
    if (props.defaultvalue) {
      this.defaultvalue = props.defaultvalue;
      console.log('question edit, options  ..', this.defaultvalue.options);
      for (var key in this.defaultvalue.options) {
        this.defaultkeys = this.defaultkeys.concat(this.uuid);
        this.uuid++;
        console.log('add default keys..', key, this.defaultvalue.options[key]);
      }
      console.log('question edit, keys value..', this.defaultkeys);
    }else {
      this.defaultvalue = {
        title:'',
        answer:'',
        options:{}
      }
    }
  }
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    this.uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
      }
    });
    const { form } = this.props;
    const key = form.getFieldValue('keys');
    const options = form.getFieldValue('options');
    const answer = form.getFieldValue('answer');
    const title = form.getFieldValue('title');
    console.log('title: ', title);
    console.log(key, ' : ', options);
    console.log('answer ', answer);
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
      }
    });
    const {form} = this.props;
    const content = {};
    content.title = form.getFieldValue('title');
    content.answer = form.getFieldValue('answer');
    content.options = form.getFieldValue('options');

    this.callback.ok(this.defaultvalue, content);
  }
  handleCancel = (e) => {
    this.callback.cancel();
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    
    getFieldDecorator('keys', { initialValue: this.defaultkeys });
    const keys = getFieldValue('keys');
    console.log('render keys..', keys);
    const formItems = keys.map((k, index) => {
      const optionKey = String.fromCharCode('A'.charCodeAt(0) + index);
      return (
        <FormItem
          {...(formItemLayout)}
          label={optionKey}
          required={false}
          key={optionKey}
        >
          {getFieldDecorator(`options[${optionKey}]`, {
            initialValue: this.defaultvalue.options[optionKey],
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            }],
          })(
            <TextArea rows={2}  placeholder="选项描述" style={{ width: '60%', marginRight: 8 }} />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    const titleItem = (
      <FormItem
        {...formItemLayout}
        label="题目"
      >
        {getFieldDecorator('title', {
          initialValue: this.defaultvalue.title,
          rules: [{
            required: true, message: 'Please input your E-mail!',
          }],
        })(
          <TextArea rows={4} style={{ width: '60%' }} />
        )}
      </FormItem>
    );
    const answerItem = (
      <FormItem
        {...formItemLayout}
        label="标准答案"
      >
        {getFieldDecorator('answer', {
          initialValue: this.defaultvalue.answer,
          rules: [{
            required: true, message: 'Please input your answer!',
          }],
        })(
          <TextArea rows={1} style={{ width: '75%' }} />
        )}
      </FormItem>
    );
    return (
      <div>
        <Modal title="题目编辑中"
          visible={true}
          onOk={this.handleOk}
          confirmLoading={false}
          onCancel={this.handleCancel}
        >
      <Form >
        {titleItem}
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加答案选项
          </Button>
        </FormItem>
        {answerItem}
      </Form>
      </Modal>
      </div>
    );
  }
}

const WrappedQuestionEdit = Form.create()(QuestionEdit);


class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    console.log('question constructor.');
  }

  componentWillMount() {
    this.state.value = this.props.value;
    this.callbacks = this.props.callbacks;
  }

  componentWillReceiveProps(nextProps) {
    console.log('willReceiveProps:', nextProps.value);
    this.callbacks = nextProps.callbacks;
    this.setState({
      value: nextProps.value
    })
  }

  onDel = (e) => {

  }
  onEdit = (e) => {
    this.callbacks.edit(this.state.value);
  }

  mm = (
    <Menu>
      <Menu.Item key="edit" onClick={this.onEdit}><Icon type="edit" />编辑</Menu.Item>
      <Menu.Item key="delete" onClick={this.onDel}><Icon type="delete" />删除</Menu.Item>
    </Menu>
  );
  setting = (
    <Dropdown overlay={this.mm}>
      <Button>
        <Icon type="setting" />
      </Button>
    </Dropdown>
  );

  options = () => {
    const list = [];
    var key;
    for (key in this.state.value.options) {
      list.push(<p>{key} {':'} {this.state.value.options[key]}</p>)
    }
    console.log('options..', list);
    return list;
  }
  render() {

    console.log('render:', this.state.value);
    return (
      <Card.Grid style={{ width: '100%' }}>
        <Card
          bodyStyle={{ padding: 0 }}
          bordered={false}
          title={this.state.value.title}
          headStyle={{ width: "100%", fontsize: 0 }}
          extra={this.setting}
        >
          <this.options/>
        </Card>
      </Card.Grid>
    );
  }
}

class QBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    console.log('qbank constructor.');
  }

  componentWillMount() {
    this.state.value = this.props.value;
    this.callbacks = this.props.callbacks;
  }

  componentWillReceiveProps(nextProps) {
    console.log('willReceiveProps:', nextProps.value);
    this.callbacks = nextProps.callbacks;
    this.setState({
      value: nextProps.value
    })
  }

  onAdd = (e) => {

  }
  onDel = (e) => {
    this.callbacks.delete(this.state.value);
  }
  onEdit = (e) => {
    this.callbacks.edit(this.state.value);
  }
  onShow = (e) => {
    this.callbacks.show(this.state.value);
  }

  mm = (
    <Menu>
      <Menu.Item key="show" onClick={this.onShow}><Icon type="eye-o" />查看</Menu.Item>
      <Menu.Item key="edit" onClick={this.onEdit}><Icon type="edit" />编辑</Menu.Item>
      <Menu.Item key="delete" onClick={this.onDel}><Icon type="delete" />删除</Menu.Item>
    </Menu>
  );
  setting = (
    <Dropdown overlay={this.mm}>
      <Button>
        <Icon type="setting" />
      </Button>
    </Dropdown>
  );
  render() {
    return (
      <Card.Grid style={{ width: '50%' }}>
        <Card
        hoverable={true}
          bodyStyle={{ padding: 0 }}
          bordered={false}
          title={this.state.value}
          headStyle={{ width: "100%", fontsize: 0 }}
          extra={this.setting}
        >
          <Meta
            description={'This is the description.This is the description.This is the description.'}
          />
        </Card>
      </Card.Grid>
    );
  }
}

function removeItem(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) {
      array.splice(i, 1);
      return i;
    }
  }
  return -1;
}

function findItem(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) {
      return i;
    }
  }
  return -1;
}

class QBankEdit extends React.Component {
  constructor(props) {
    super(props);
    this.callback = props.callback;
    this.state = {
      ModalText: 'Content of the modal',
      visible: true,
      confirmLoading: false,
      defaultvalue:{
        title:'',
        description:''
      },
      content:{
        title:'',
        description:''
      }
    }
    if (props.defaultvalue)
    {
      this.state.defaultvalue = props.defaultvalue;
    }
    console.log('QBankEdit constructor..',props);
  }
  componentWillMount(){
    
  }
  componentWillReceiveProps(nextProps) {
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  onTextChange = (e) => {
    if (e.target.name == 'title'){
      this.state.content.title = e.target.value;
    }else if (e.target.name == 'description'){
      this.state.content.description = e.target.value;
    }
  }

  handleOk = () => {
    console.log('handleOk..', this.state.content);
    this.callback.ok(this.state.defaultvalue, this.state.content);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.callback.cancel();
  }

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Modal title="编辑中"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <TextArea rows={2} onChange={this.onTextChange} name ="title" defaultValue={this.state.defaultvalue.title}
            placeholder="题库标题" style={{ width: '80%', marginRight: 8 }} />
          <TextArea rows={3} onChange={this.onTextChange} name ="description" defaultValue={this.state.defaultvalue.description} 
            placeholder="题库描述" style={{ width: '80%', marginRight: 8 }} />
        </Modal>
      </div>
    );
  }
}
/*
const history_question = [
  {title:'The second world war ocurs in which year?',answer:'A',options:[{A:1939},{B:1937}]},
  {title:'The first world war ocurs in which year?',answer:'B',options:[{A:1914},{B:1915}]}];

const math_question = [{title:'1+1=?',answer:'A',options:[{A:2},{B:3}]},
{title:'2*31=?',answer:'B',options:[{A:26},{B:62}]},
{title:'24+14=?',answer:'A',options:[{A:38},{B:39}]}];

const english_question = [
{title:'Why didn\'t you buy something for yourself?',answer:'A',options:[{A:'no money'},{B:'just no desire'}]},
{title:'Why don\'t you ask someone to read them for you?',answer:'B',options:[{A:'no desire'},{B:'anyone'}]}];
*/

const history_question = [
  {title:'The second world war ocurs in which year?',answer:'A',options:{A:1939,B:1937}},
  {title:'The first world war ocurs in which year?',answer:'B',options:{A:1914,B:1915}}];

const math_question = [{title:'1+1=?',answer:'A',options:{A:2,B:3}},
{title:'2*31=?',answer:'B',options:{A:26,B:62}},
{title:'24+14=?',answer:'A',options:{A:38,B:39}}];

const english_question = [
{title:'Why didn\'t you buy something for yourself?',answer:'A',options:{A:'no money',B:'just no desire'}},
{title:'Why don\'t you ask someone to read them for you?',answer:'B',options:{A:'no desire',B:'anyone'}}];

const history = ['xia', 'shang', 'zhou', 'qin', 'han', 'sanguo', 'jin', 'nanbeichao'];
const math = ['linear', 'Calculus', 'statistics', 'methmetic', 'discrete math'];
const english = ['CET-4', 'CET-6', 'CET-8'];

class QuestionManager extends React.Component {
  constructor() {
    super();
    this.state = {
      bankList: [],      //bank列表
      bankSelected: null,  //bank实体
      bankInEdit: false,
      questionList: [],  //以bank name为key的question列表 
      questionSelected: null, //question实体
      questionInEdit: false,
      banksNode: {},
      questionsNode: {},
      bankEdit: {},
      questionEdit:{},
      showQBankEdit: false,
      showQuestionEdit: false,
    }
  }
  generateQuestionNode() {
    if (!this.state.bankSelected) {
      return (
        <Button type="dashed">
        <Icon type="plus" /> 新增题目
        </Button>);
    }
    if (!this.state.questionList[this.state.bankSelected] || 
      this.state.questionList[this.state.bankSelected].length == 0) {
      return (null);
    }
    return this.state.questionList[this.state.bankSelected].map(item => (
      <Question value={item} callbacks={this.questionCallback} />
    ));
  }
  generateQbankNode() {
    if (this.state.bankList.length == 0) {
      return (
        <Button type="dashed">
        <Icon type="plus" /> 新增题库
        </Button>
      );
    }
    return this.state.bankList.map(item => (
      <QBank value={item} callbacks={this.bankCallback} />
    ));
  }

  generateQBankEdit(cb,value) {
    if (!this.state.showQBankEdit) {
      return (null);
    }
    return (<QBankEdit defaultvalue={value} callback={cb}/>);
  }

  generateQuestionEdit(cb,value) {
    if (!this.state.showQuestionEdit) {
      return (null);
    }
    return (<WrappedQuestionEdit defaultvalue={value} callback={cb}/>);
  }

  componentWillMount() {
    this.state.bankList = ['history', 'math', 'english'];
    this.state.bankSelected = this.state.bankList[0];
    this.state.questionList.history = history_question;
    this.state.questionList.math = math_question;
    this.state.questionList.english = english_question;

    this.state.banksNode = this.generateQbankNode();
    this.state.questionsNode = this.generateQuestionNode();
    this.state.bankEdit = this.generateQBankEdit(null,null);
    this.state.questionEdit = this.generateQuestionEdit(null, null);
  }

  
  bankAddOkCb = (olddata, newdata) => {
    this.state.bankList = this.state.bankList.concat(newdata.title);
    this.state.showQBankEdit = false;
    this.setState({
      banksNode: this.generateQbankNode(),
      bankEdit: this.generateQBankEdit(this.bankAddCallback,null),
    });
  }
  bankAddCancelCb = () => {
    this.state.showQBankEdit = false;
    this.setState({
      bankEdit: this.generateQBankEdit(this.bankAddCallback,null),
    });
  }

  bankEditOkCb = (olddata,newdata) => {
    console.log('bankEditOkCb..',olddata, newdata);
    const index = findItem(this.state.bankList, olddata.title);
    if (index == -1) return;
    this.state.bankList[index] = newdata.title;
    this.state.questionList[newdata.title] = this.state.questionList[olddata.title];
    this.state.questionList[olddata.title] = undefined;
    if (this.state.bankSelected == olddata.title) {
      this.state.bankSelected = this.state.bankList[index];
    }
    this.state.showQBankEdit = false;
    this.setState({
      banksNode: this.generateQbankNode(),
      bankEdit: this.generateQBankEdit(this.bankEditCallback,null),
    });
  }

  bankEditCancelCb = () => {
    this.state.showQBankEdit = false;
    this.setState({
      bankEdit: this.generateQBankEdit(this.bankEditCallback,null),
    });
  }

  onNewQBank = (e) => {
    this.state.showQBankEdit = true;
    this.setState({
      bankEdit: this.generateQBankEdit(this.bankAddCallback,null),
    });
  }

  onDelQBank = (e) => {
    console.log('delete bank selected:', e);
    const index = removeItem(this.state.bankList, e);
    if (index == -1) {
      console.err('removeItem err, e: ', e, 'banklist: ', this.state.bankList);
      return;
    }

    delete this.state.questionList[e];

    if (this.state.bankSelected == e) {
      //重新选择显示的题库
      let size = this.state.bankList.length;
      if (size == 0) { this.state.bankSelected = null; }
      else if (index + 1 >= size) { this.state.bankSelected = this.state.bankList[size - 1]; }
      else { this.state.bankSelected = this.state.bankList[index]; }

      this.setState({
        banksNode: this.generateQbankNode(),
        questionsNode: this.generateQuestionNode()
      });
    } else {
      this.setState({
        banksNode: this.generateQbankNode(),
      });
    }

  }

  onEditBank = (e) => {
    const index = findItem(this.state.bankList,e);
    if (index == -1) {
      return;
    }
    const value = {title: e, description:'This is description.'};
    this.state.showQBankEdit = true;
    this.setState({
      bankEdit: this.generateQBankEdit(this.bankEditCallback,value),
    });
  }

  onShowBank = (e) => {

    console.log('show bank selected:', e);
    this.state.bankSelected = e;

    this.setState({
      questionsNode: this.generateQuestionNode(),
    });
  }

  
  questionAddOkCb = (olddata, newdata) => {
    if (!this.state.bankSelected) return;
    if (!this.state.questionList[this.state.bankSelected]) {
      this.state.questionList[this.state.bankSelected] = [];
    }
    this.state.questionList[this.state.bankSelected] = this.state.questionList[this.state.bankSelected].concat(newdata);
    this.state.showQuestionEdit = false;
    this.setState({
      questionEdit: this.generateQuestionEdit(null,null),
      questionsNode: this.generateQuestionNode(),
    });
  }
  questionAddCancelCb = () => {
    this.state.showQuestionEdit = false;
    this.setState({
      questionEdit: this.generateQuestionEdit(null,null),
    });
  }

  questionEditOkCb = (olddata, newdata) => {
    if (!this.state.bankSelected) return;
    if (!this.state.questionList[this.state.bankSelected]) {
      return;
    }
    for(let i = 0; i < this.state.questionList[this.state.bankSelected]; i++) {
      if (this.state.questionList[this.state.bankSelected][i].title == olddata.title) {
        this.state.questionList[this.state.bankSelected][i] = newdata;
      }
    }
    this.state.showQuestionEdit = false;
    this.setState({
      questionEdit: this.generateQuestionEdit(null,null),
      questionsNode: this.generateQuestionNode(),
    });
  }

  questionEditCancelCb = () => {
    this.state.showQuestionEdit = false;
    this.setState({
      questionEdit: this.generateQuestionEdit(null,null),
    });
  }

  onAddQuestion = (e) => {
    this.state.showQuestionEdit = true;
    this.setState({
      questionEdit: this.generateQuestionEdit(this.questionAddCallback,null),
    });
  }

  onDelQuestion = (e) => {

  }
  onEditQuestion = (e) => {
    /*待补充 */

    this.state.showQuestionEdit = true;
    this.setState({
      questionEdit: this.generateQuestionEdit(this.questionEditCallback,e),
    });
  }
  bankCallback = {
    show: this.onShowBank,
    edit: this.onEditBank,
    delete: this.onDelQBank
  };

  questionCallback = {
    edit: this.onEditQuestion,
    delete: this.onDelQuestion
  };

  bankAddCallback = {
    ok: this.bankAddOkCb,
    cancel: this.bankAddCancelCb
  }
  bankEditCallback = {
    ok: this.bankEditOkCb,
    cancel: this.bankEditCancelCb
  }
  questionAddCallback = {
    ok: this.questionAddOkCb,
    cancel: this.questionAddCancelCb
  }

  questionEditCallback = {
    ok: this.questionEditOkCb,
    cancel: this.questionEditCancelCb
  }
  render() {
    console.log('banklist...', this.state.bankList);
    console.log('bank selected: ', this.state.bankSelected);
    console.log('question list: ', this.state.questionList);
    console.log('question selected: ', this.state.questionsNode);
    return (
      <Row gutter={24}>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
        {this.state.bankEdit}
        {this.state.questionEdit}
          <Card
            style={{ marginBottom: 12, height: '50%' }}
            title="题库"
            bordered={false}
            extra={<Button onClick={this.onNewQBank}>
              <Icon type="plus"  />新建题库
                </Button>}
            bodyStyle={{ padding: 0 }}
          >
            {this.state.banksNode}
          </Card>
          <Card
            style={{ marginBottom: 12, height: '50%' }}
            title="试卷"
            bordered={false}
            extra={<Button onClick={this.onNewQBank}>
              <Icon type="plus" />新建试卷
                </Button>}
            bodyStyle={{ padding: 0 }}
          >
            {this.state.banksNode}
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginBottom: 12, height: '50%', overflow: 'hidden' }}
            title="题目"
            bordered={false}
            extra={<Button onClick={this.onAddQuestion} >
              <Icon type="plus" />新建题目
                </Button>}
            bodyStyle={{ padding: 0 }}
          >
            {this.state.questionsNode}
          </Card>
        </Col>
      </Row>
    );
  }
}
export default QuestionManager