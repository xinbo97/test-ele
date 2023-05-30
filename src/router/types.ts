import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface CusRouteObject {
  element: ReactNode;
  path?: string;
  name?: string;
  notShow?: boolean; // 当前路由是否要在Menu里展示出来，设为false、或不设置表示要展示
  needShowInner?: boolean; // 当一级路由不显示时，是否要去将内层的二级路由进行展示，此值只会在notShow为true且有children时才有用
  index?: true | false;
  children?: CusRouteObject[];
  meta?: {
    roles?: string[]; // 方便以后进行权限控制
    needLogin?: boolean; // 是否要登录权限
  };
}

export type RouteObjectCustom = CusRouteObject & RouteObject;
