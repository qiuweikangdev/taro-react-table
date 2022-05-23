import { CommonEventFunction, ScrollViewProps } from '@tarojs/components';
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

export type SorterEvent = {
  column: Columns;
  order: SortOrder;
  field: string;
};

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

export type TableProps<T = unknown> = Omit<ScrollViewProps, 'style'> & {
  dataSource: T[];
  columns: Columns<T>[];
  rowKey?: string | ((item: T) => React.Key);
  wrapperClass?: string;
  wrapperStyle?: CSSProperties;
  className?: string;
  colStyle?: CSSProperties;
  colClassName?: string;
  rowStyle?: CSSProperties;
  rowClassName?: string;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  style?: CSSProperties;
  loading?: boolean;
  loadStatus?: LoadStatus;
  onLoad?: CommonEventFunction;
  onSorter?: ({ column, field, order }: SorterEvent) => void;
  unsort?: boolean;
};

export type RowProps<T = unknown> = {
  index: number;
  dataSourceItem: DataSource<T>;
  columns: Columns<T>[];
  rowStyle?: CSSProperties;
  rowClassName?: string;
  colStyle?: CSSProperties;
  colClassName?: string;
};

export type TitleProps = {
  columns: Columns[];
  column: Columns;
  setColumns?: any;
  index: number;
  fixed?: boolean;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  onSorter?: ({ column, field, order }: SorterEvent) => void;
  unsort?: boolean;
};
