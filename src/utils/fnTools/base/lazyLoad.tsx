import React from 'react';
// import type { ReactElement } from 'react';
import { Spin } from 'antd';

type ComponentType = React.LazyExoticComponent<React.ComponentType<any>>;

const lazyLoad = (Comp: ComponentType) => {
  return (
    <React.Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      }
    >
      <Comp />
    </React.Suspense>
  );
};

export default lazyLoad;
