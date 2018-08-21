import React, { Component } from "react";
import { Form, Input, Icon, Button } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

let uuid = 0;
class QuestionEdit extends React.Component {
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
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const { form } = this.props;
    const key = form.getFieldValue('keys');
    const name = form.getFieldValue('names');
    const answer = form.getFieldValue('answer');
    const title = form.getFieldValue('title');
    console.log('title: ', title);
    console.log(key,' : ', name);
    console.log('answer ', answer);
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
        const optionKey = String.fromCharCode('A'.charCodeAt(0) + index);
      return (
        <FormItem
          {...(formItemLayout)}
          label={optionKey}
          required={false}
          key={optionKey}
        >
          {getFieldDecorator(`names[${optionKey}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            }],
          })(
            <TextArea rows={2} placeholder="选项描述" style={{ width: '60%', marginRight: 8 }} />
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
              rules: [{
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <TextArea rows={4} style={{width:'60%'}}/>
            )}
          </FormItem>
    );
    const answerItem = (
        <FormItem
        {...formItemLayout}
        label="标准答案"
      >
        {getFieldDecorator('answer', {
          rules: [{
            required: true, message: 'Please input your answer!',
          }],
        })(
          <TextArea rows={1} style={{width:'60%'}}/>
        )}
      </FormItem>
);
    return (
      <Form onSubmit={this.handleSubmit}>
        {titleItem}
        {formItems}
        {answerItem}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加答案选项
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
function QuestionDisplay() {
    return (
        <Card title="Card title" 
        extra={<Dropdown overlay={menu}>
        <Button>
         <Icon type="setting" />
        </Button>
      </Dropdown>} 
        style={{ width: "50%" }}>
        
            <WrappedDynamicFieldSet />
        </Card>
    )
}

class QuestionManager extends React.Component {
}
export default QuestionEdit