import {
  CSSProperties,
  memo,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction
} from 'react';
import classNames from 'classnames';

import { ScrollView, ScrollViewProps, View } from '@tarojs/components';
import Row from './Row';
import Title from './Title';
import Empty from './Empty';

import './index.less';

export type Fixed = 'left' | 'right';

export type DataSource<T = unknown> = {
  [prop: string]: T;
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
};

export type TableProps<T = unknown> = ScrollViewProps & {
  dataSource: T[];
  columns: Columns<T>[];
  rowKey?: string | ((item: T) => React.Key);
  className?: string;
  colStyle?: CSSProperties;
  colClassName?: string;
  rowStyle?: CSSProperties;
  rowClassName?: string;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  loading?: boolean;
};

const Table: ForwardRefRenderFunction<any, TableProps<unknown>> = (
  props,
  ref
) => {
  const {
    columns: pColumns = [],
    dataSource: pDataSource = [],
    rowKey = '',
    scrollY = true,
    scrollX = true,
    className = ''
  } = props;

  const [dataSource, setDataSource] = useState<unknown[]>(pDataSource);
  const [columns, setColumns] = useState<Columns[]>(pColumns);

  useEffect(() => {
    setDataSource(pDataSource);
  }, [pDataSource]);

  useEffect(() => {
    setColumns(pColumns);
  }, [pColumns]);

  const renderTableHead = () => {
    return (
      <View
        className={classNames(['taro-table-head'], {
          'taro-table-head-scroll': scrollY
        })}
      >
        {columns.length === 0 ? (
          <Empty />
        ) : (
          columns.map(
            (item: Columns, index: number): JSX.Element => {
              return (
                <Title
                  key={item.key || item.dataIndex}
                  column={item}
                  index={index}
                />
              );
            }
          )
        )}
      </View>
    );
  };

  const renderTableBody = () => {
    return (
      <View className='taro-table-body'>
        {dataSource.length > 0 ? (
          dataSource.map(
            (item: DataSource, index: number): JSX.Element => {
              let key;
              if (typeof rowKey === 'function') {
                key = rowKey(item);
              } else {
                key = item[rowKey];
              }
              if (!key) {
                key = `row-item-${index}`;
              }
              return (
                <Row
                  columns={columns}
                  key={key}
                  dataSourceItem={item}
                  index={index}
                />
              );
            }
          )
        ) : (
          <Empty />
        )}
      </View>
    );
  };

  useImperativeHandle(ref, () => ({}));

  return (
    <View className={classNames(['taro-table-wrapper', className])}>
      <ScrollView
        className='taro-table-scroll'
        scrollX={scrollX}
        scrollY={scrollY}
        style={{ height: '200px', overflow: 'auto' }}
      >
        <View>
          {renderTableHead()}
          {renderTableBody()}
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(forwardRef(Table));
