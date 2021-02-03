import { Card, Col, Divider, Form, List, Row, Button, Typography, Select, Switch } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { Redirect, useRequest } from 'umi';
import { Params, BroadcastTemplateListItem, BroadcastFlowList } from './data.d';
import { getTags, queryBroadcastTemplate, sendBroadcast } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { TextComponent, ImageComponent, VideoAttachmentComponent, GenericTemplatesComponent, ButtonTemplatesComponent, FlowComponent } from '@/components/FlowItems/UpdateFlow';
import { NewBroadcastEntry } from '../../data';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const tailLayout = {
  wrapperCol: { offset: 12, span: 24 },
};

const { Option } = Select;

const NewBroadcast: FC = () => {
  let { templateId } = useParams()
  type component = {
    type: string,
    data: {}
  }
  const [componentList, setComponentsList] = useState<component[]>([]);
  const [redirect, setRedirect] = useState(false);

  const { data, loading, run} = useRequest((values: any) => {
    return queryBroadcastTemplate(templateId);
  });

  const { run: postRun } = useRequest(
    (data) => {
      return sendBroadcast(data);
    }, {
      manual: true,
      onSuccess: (result) => {
        console.log(result)
        // message.success('Success');
        // run({}).catch();
      },
      throwOnError: true
    }
  );

  const renderComponent = (component: string, index: number) => {
    let renderedComponent;
    const componentData = { type: component, data: {} }

    if (componentList.length < index + 1) {setComponentsList((prevArray) => [...prevArray, componentData])}
    console.log('componentList', componentList)
    
    console.log(componentData, index)
    switch (component) {
      case 'text':
        renderedComponent = <TextComponent componentKey={index} onChange={setComponentsList} />;
        break;
      case 'image':
        renderedComponent = <ImageComponent componentKey={index} onChange={setComponentsList} />;
        break;
      // case 'videoAttachments':
      //   renderedComponent = <VideoAttachmentComponent key={index} />;
      //   break;
      case 'fileAttachments':
        renderedComponent = <div key={index} >Not implemented yet</div>;
        break;
      case 'genericTemplates':
        renderedComponent = <GenericTemplatesComponent key={index} />;
        break;
      case 'buttonTemplates':
        renderedComponent = <ButtonTemplatesComponent key={index} />;
        break;
      case 'flow':
        renderedComponent = <FlowComponent key={index} />;
        break;
      default:
        renderedComponent = <div key={index} >Cannot render {component}</div>;
    }
    return renderedComponent
  };


  const list = data?.flow || [];

  const onFinish = (values: any) => {
    console.log('Success:', values, componentList);
    postRun({...values, flow: componentList, platforms: ["line"]} as NewBroadcastEntry)
    setRedirect(true) 
  };

  const { data: tags, loading: tagsLoading, run: tagsRun, cancel: tagsCancel } = useRequest(getTags, {
    manual: true
  });

  const [toAll, setToAll] = React.useState(false);

  return (
    redirect? (<Redirect to="/broadcasts/history" />):
    (<PageContainer>
      <div className={styles.coverCardList}>
        <ProCard title="Create New Broadcast">
            <Form 
              name="broadcast-form"
              initialValues={{tags: [], exclude: [], sendToAll: false}} 
              onFinish={onFinish}>
              <Row>
                <Col span={12} key={1}>
                  <FormItem>
                    <ProCard title="Component">
                      {list.map((flowNode, index) => renderComponent(flowNode, index))}
                    </ProCard>
                  </FormItem>
                </Col>
                <Col span={12} key={2}>
                <FormItem >
                <ProCard title="Audience">
                  <Form.Item name="sendToAll" label="Broadcast to Everyone">
                    <Switch checked={toAll} onChange={setToAll} />
                  </Form.Item>
                    <FormItem 
                    name="tags" label="Select Tags">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      disabled={toAll}
                      defaultValue={[]}
                      onSearch={tagsRun}
                      onFocus={tagsRun}
                      onBlur={tagsCancel}
                      loading={tagsLoading}
                      // onChange={handleChange}
                    >
                      {tags && tags.map(i => {
                        return <Option key={i}>{i}</Option>
                      })}
                    </Select>
                  </FormItem>
                  <FormItem 
                    name="exclude" label="Exclude Tags">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onSearch={tagsRun}
                      onFocus={tagsRun}
                      onBlur={tagsCancel}
                      loading={tagsLoading}
                      // onChange={handleChange}
                    >
                      {tags && tags.map(i => {
                        return <Option key={i}>{i}</Option>
                      })}
                    </Select>
                  </FormItem>
                  
                </ProCard>
                </FormItem>
                </Col>
              </Row>

              <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
            </Form>
        </ProCard>
      </div>

    </PageContainer>)
  );
};

export default NewBroadcast;
