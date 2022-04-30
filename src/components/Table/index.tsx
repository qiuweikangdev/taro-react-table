import { CSSProperties, memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import { ScrollView, ScrollViewProps, View } from '@tarojs/components';
import Row from './Row';
import Title from './Title';
import Empty from './Empty';

import './index.less';

export type Fixed = 'left' | 'right';

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
    record?: DataSource,
    index?: number
  ) => JSX.Element | string;
  width?: number;
  fixed?: Fixed;
};

export type TableProps = ScrollViewProps & {
  dataSource: DataSource[];
  columns: Columns[];
  rowKey: string;
  className?: string;
  colStyle?: CSSProperties;
  colClassName?: string;
  rowStyle?: CSSProperties;
  rowClassName?: string;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  loading?: boolean;
};

const Table = (props: TableProps): JSX.Element | null => {
  const {
    columns: pColumns = [],
    dataSource: pDataSource = [],
    rowKey = '',
    scrollY = true,
    scrollX = true,
    className = ''
  } = props;

  const [dataSource, setDataSource] = useState<DataSource[]>(pDataSource);
  const [columns, setColumns] = useState<Columns[]>(pColumns);

  useEffect(() => {
    setDataSource(pDataSource);
  }, [pDataSource]);

  useEffect(() => {
    setColumns(pColumns);
  }, [pColumns]);

  return (
    <View className={classNames(['taro-table-wrapper', className])}>
      <ScrollView
        className='taro-table-scroll'
        scrollX={scrollX}
        scrollY={scrollY}
        style={{ height: '200px', overflow: 'auto' }}
      >
        <View>
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
          <View className='taro-table-body'>
            {dataSource.length > 0 ? (
              dataSource.map(
                (dataSourceItem: DataSource, index: number): JSX.Element => {
                  return (
                    <Row
                      rowKey={rowKey}
                      columns={columns}
                      key={dataSourceItem[rowKey]}
                      dataSourceItem={dataSourceItem}
                      index={index}
                    />
                  );
                }
              )
            ) : (
              <Empty />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(Table);
