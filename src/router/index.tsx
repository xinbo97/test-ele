import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@demo/pages/layout';
import lazyLoad from '@demo/utils/fnTools/base/lazyLoad';
import type { RouteObjectCustom } from './types';

// 首页
const HomePage = lazyLoad(
  lazy(() => import(/* webpackChunkName: "homePage" */ '@demo/pages/homePage'))
);

// 仪器模块
const InstrumentModules = lazyLoad(
  lazy(
    () =>
      import(
        /* webpackChunkName: "instrumentModules" */ '@demo/pages/instrumentModules'
      )
  )
);

// 监控总览
const Monitor = lazyLoad(
  lazy(() => import(/* webpackChunkName: "monitor" */ '@demo/pages/monitor'))
);

// 光谱标定
const Calibrating = lazyLoad(
  lazy(
    () =>
      import(/* webpackChunkName: "calibrating" */ '@demo/pages/calibrating')
  )
);

// 谱图分析
const Analysis = lazyLoad(
  lazy(() => import(/* webpackChunkName: "analysis" */ '@demo/pages/analysis'))
);

const routes: RouteObjectCustom[] = [
  {
    path: '/',
    name: '默认项',
    notShow: true,
    needShowInner: true,
    element: <Layout />,
    children: [
      {
        index: true,
        notShow: true,
        element: <Navigate replace to="/homePage" />,
      },
      {
        path: '/homePage',
        name: '首页',
        element: HomePage,
      },
      {
        path: '/instrumentModules',
        name: '仪器模块',
        element: InstrumentModules,
        // children: [
        //   {
        //     path: '/instrumentModules/fff',
        //     name: '默认11项',
        //     element: <Layout />,
        //   },
        // ],
      },
      {
        path: '/monitor',
        name: '监控总览',
        element: Monitor,
      },
      {
        path: '/calibrating',
        name: '光谱标定',
        element: Calibrating,
      },
      {
        path: '/analysis',
        name: '谱图分析',
        element: Analysis,
      },
    ],
  },
  {
    path: '/fff',
    name: 'fff',
    element: <Layout />,
  },
  {
    path: '/ff222f',
    name: 'f222ff',
    element: <Layout />,
  },
];

export default routes;
