import React, { FC, useState } from 'react';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import { FormattedMessage, useIntl, useRequest } from 'umi';
import { changeLanguage } from '@/utils/language';
import { Button, Divider, Form, Input, Popover } from 'antd';
import styles from './index.less';
import NewComponentsList from '../components/NewComponentsList';
import FlowComponentsList from '@/pages/FlowList/components/FlowComponentsList';
import {
  GenericTemplateComponent,
  TextComponent,
  FlowComponent,
  ButtonTemplateComponent,
  ImageComponent,
  QuickReplyComponent,
  VideoComponent,
  FileComponent,
} from '@/components/FlowItems/UpdateFlow';
import { FooterToolbar } from '@ant-design/pro-layout';
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { addFlow } from '../service';
import { FlowEditableComponent, FlowItemData } from 'models/flows';


changeLanguage('en-US');

type InternalNamePath = (string | number)[];

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const NewFlow: FC = (props) => {
  const [componentList, setComponentList] = useState<FlowEditableComponent[]>([]);
  const [error, setError] = useState<ErrorField[]>([]);

  const { run: postRun } = useRequest(
    (data) => {
      return addFlow(data);
    }, {
      manual: true,
      onSuccess: (result) => {
        console.log(result)
      },
      throwOnError: true
    }
  );

  const onFinish = (values: any) => {
    let toSubmit: FlowItemData[] = [];
    // let lastElement = array.pop();
    componentList.map((item)=> {
      if (item.type === 'quickReplies') {
        let prevItem = toSubmit.pop()
        toSubmit.push({...prevItem, data: {...prevItem.data, ...item.data}})
      } else {
        toSubmit.push({type: item.type, data: item.data})
      }
    })
    // const toSubmit = componentList.map((item)=> {
    //   return {type: item.type, data: item.data}
    // })
    console.log('values: ', values);
    console.log('componentList: ', toSubmit);
    postRun({name: values.name, flow: toSubmit})

  };

  const renderComponent = (component: { data: any, type: string }, index: number) => {
    const { data, type } = component;
    let renderedComponent;
    console.log(type)
    switch (type) {
      case 'message':
        renderedComponent = <TextComponent componentKey={index} componentData={data} onChange={setComponentList} />
        break;
      case 'image':
        renderedComponent = <ImageComponent componentKey={index} componentData={data}  onChange={setComponentList} />
        break;
      case 'genericTemplate':
        renderedComponent = <GenericTemplateComponent componentKey={index} componentData={data} onChange={setComponentList} />
        break;
      case 'buttonTemplate':
        renderedComponent = <ButtonTemplateComponent componentKey={index} componentData={data} onChange={setComponentList} />
        break;
      case 'video':
        renderedComponent = <VideoComponent componentKey={index} componentData={data}  onChange={setComponentList} />
        break;
      case 'file':
        renderedComponent = <FileComponent componentKey={index} componentData={data}  onChange={setComponentList} />
        break;
      case 'flow':
        renderedComponent = <FlowComponent componentKey={index} componentData={data}  onChange={setComponentList} />
        break;
      case 'quickReplies':
        renderedComponent = <QuickReplyComponent componentKey={index} componentData={data}  onChange={setComponentList} />
        break;
      default:
        renderedComponent = <div>Cannot render {type}</div>;
    }
    return renderedComponent;
  };

  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          {/*<div className={styles.errorField}>{fieldLabels[key]}</div>*/}
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  let newComponentsImplementation = [];
  return (
    <div className={styles.componentsList}>
      <Form name="complex-form" onFinish={onFinish}>
        <ProCard
          title={<Form.Item
            name="name"
          >
            <Input placeholder="Flow Name" />
          </Form.Item>}
          extra={<Button size="small"><DeleteOutlined /></Button>}
          split="vertical"
          bordered
          headerBordered
        >
          <ProCard title="Flow Panel" colSpan="300px">
            <Divider style={{ marginTop: -6 }} orientation="center">
              Components
            </Divider>
            <FlowComponentsList setNewComponentsList={setComponentList}
            />
            <Divider orientation="center">Current Flow</Divider>
            <NewComponentsList
              componentList={componentList}
              setComponentsList={setComponentList}
            />
          </ProCard>
          <ProCard title="Flow Content" colSpan={{ xs: 20, sm: 20, md: 20, lg: 20, xl: 16 }}>
              {console.log('componentList', componentList)}
              {componentList.map((flowNode, index) => renderComponent(flowNode, index))}
              <FooterToolbar>
                {getErrorInfo(error)}
                {/*<Button type="primary" onClick={() => form?.submit()} loading={submitting}>*/}
                <Button key="3">重置</Button>
                <Button type="primary" htmlType="submit" loading={false}>
                  提交
                </Button>
              </FooterToolbar>
            {componentList.length === 0 && (
              <div style={{ height: 360 }}>Add a flow to see the contents here</div>
            )}
          </ProCard>
          <ProCard title="Placeholder" colSpan={{ xs: 4, sm: 4, md: 10, lg: 10, xl: 8 }}></ProCard>
        </ProCard>
      </Form>
    </div>
  );
};

export default NewFlow;
