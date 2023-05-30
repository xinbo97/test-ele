import { cloneDeep } from 'lodash-es';
import type { RouteObjectCustom } from '@demo/router/types';

interface MenuItemType {
  key: string;
  label: string;
  [val: string]: any;
  children?: any[] | undefined;
  path?: string;
}

// eslint-disable-next-line
type GetFnType = typeof filterRoutes;
export type IParamsType = ReturnType<GetFnType>;

export function filterRoutes(
  allRoutes: RouteObjectCustom[],
  curRole = 'guest'
) {
  const handedRouted = cloneDeep(allRoutes);
  if (!handedRouted) return;
  return handedRouted.filter((item) => {
    if (item.children) {
      item.children = filterRoutes(
        item?.children as RouteObjectCustom[],
        curRole
      );
    }
    return (
      // 如果没有meta属性、meta属性里没有roles属性、或roles里包括当前用户角色则将此路由返回
      !item?.meta || !item?.meta?.roles || item?.meta?.roles?.includes(curRole)
    );
  });
}

export const formatItem = (arr: IParamsType, outerData?: any) => {
  const bArr: MenuItemType[] = [];

  if (!arr) return;

  for (let index = 0; index < arr.length; index += 1) {
    const item = arr[index];
    // 如果自身不展示需进一步判断是否有children
    if (item?.notShow && item?.children && item?.needShowInner) {
      formatItem(item?.children as IParamsType, bArr);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!item?.notShow) {
      // 如果外层传进来了outerData说明是想把内层提到外层
      (outerData || bArr).push({
        key: item.path!,
        label: item.name!,
        children: formatItem(item?.children as IParamsType),
      });
    }
  }
  return bArr;
};
