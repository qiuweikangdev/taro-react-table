import { CSSProperties } from 'react';

export enum DefaultData {
  ColWidth = 110
}
export type ScrollDetail = {
  scrollLeft: number;
  scrollTop: number;
  scrollHeight: number;
};

export type Fixed = 'left' | 'right';

export type LoadStatus = 'loading' | 'noMore' | null;

export type DataSource<T = unknown> = {
  [prop: string]: T;
};

export type SortOrder = 'descend' | 'ascend' | undefined | false;

export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

export type Columns<T = unknown> = {
  title: string | JSX.Element;
  dataIndex: string;
  key?: string;
  align?: 'left' | 'right' | 'center';
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  className?: string;
  titleClassName?: string;
  render?: (text?: any, record?: T, index?: number) => JSX.Element | string;
  width?: number;
  fixed?: Fixed;
  sorter?: boolean | CompareFn<T>;
  sortOrder?: SortOrder;
};

export type SorterEvent = {
  column: Columns;
  order: SortOrder;
  field: string;
};
