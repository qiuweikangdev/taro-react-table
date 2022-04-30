import { CSSProperties } from 'react';

export enum DEFAULTDATA {
  ColWidth = 100
}

export interface AnyOpt {
  [prop: string]: any;
}

export type Fixed = 'left' | 'right';
export type SortOrder = 'ascend' | 'descend' | undefined;
export type CompareFn<T = AnyOpt> = (
  a: T,
  b: T,
  sortOrder: SortOrder
) => number;

export type DataSource = {
  [prop: string]: any;
};

export type Columns = {
  title: string | JSX.Element;
  dataIndex: string;
  key?: string;
  align?: 'left' | 'right' | 'center';
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  className?: string;
  titleClassName?: string;
  render?: (
    text?: any,
    record?: AnyOpt,
    index?: number
  ) => JSX.Element | string;
  width?: number;
  fixed?: Fixed;
};

export type TableProps = {
  columns: Columns[];
  dataSource: DataSource[];
  rowKey: string;
  className?: string;
  loading?: boolean;
  scroll?: {
    x?: number | string | boolean;
    y?: number | string | boolean;
  };
};

export type TitleProps = {
  column: Columns;
  index: number;
  fixed?: boolean;
};

export type RowProps = {
  index: number;
  dataSourceItem: DataSource;
  columns: Columns[];
  rowKey: string;
};
