import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Header, Content } = Layout;
const headerStyle: React.CSSProperties = {
  height: 50,
  paddingInline: 0,
  lineHeight: 'normal',
  backgroundColor: 'transparent',
};

const LayoutComp = () => {
  return (
    <Layout className={styles.layoutWrapper}>
      <Header style={headerStyle}>Header</Header>
      <Content>Content</Content>
    </Layout>
  );
};

export default LayoutComp;
