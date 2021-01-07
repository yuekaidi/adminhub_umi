import React from 'react';
import { GitlabOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2021 Product of Pand.ai Pte. Ltd."
    links={[
      {
        key: 'Administrator Hub',
        title: 'Official Website',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GitlabOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Contact Us',
        title: 'Contact Us',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);
