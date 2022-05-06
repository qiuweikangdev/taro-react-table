import {
  CSSProperties,
  memo,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction
} from 'react';
import classNames from 'classnames';

import {
  BaseEventOrig,
  CommonEventFunction,
  ScrollView,
  ScrollViewProps,
  View
} from '@tarojs/components';
import Row from './Row';
import Title from './Title';
import Empty from './Empty';

import './index.less';
import Loading from '../Loading';
import LoadMore from '../LoadMore';

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
  loadStatus: LoadStatus;
  LoadMore?: React.ReactNode;
  onLoad?: CommonEventFunction;
};

const Table: ForwardRefRenderFunction<any, TableProps<unknown>> = (
  {
    columns: pColumns = [],
    dataSource: pDataSource = [],
    rowKey = '',
    style = {},
    scrollY = true,
    scrollX = true,
    rowStyle = {},
    rowClassName = '',
    colClassName = '',
    colStyle = {},
    titleStyle = {},
    titleClassName = '',
    className = '',
    wrapperClass = {},
    wrapperStyle = {},
    loadStatus: pLoadStatus = null,
    loading = false,
    onLoad,
    ...props
  },
  ref
) => {
  const scrollRef = useRef<HTMLElement>(null);
  const [dataSource, setDataSource] = useState<unknown[]>(pDataSource);
  const [columns, setColumns] = useState<Columns[]>(pColumns);
  const [scrollDetail, setScrollDetail] = useState<Partial<ScrollDetail>>({});
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(pLoadStatus);

  useEffect(() => {
    setLoadStatus(pLoadStatus);
  }, [pLoadStatus]);

  useEffect(() => {
    setDataSource(pDataSource);
  }, [pDataSource]);

  useEffect(() => {
    setColumns(pColumns);
  }, [pColumns]);

  // 上拉加载
  const onScrollToLower = e => {
    const { height = '' } = scrollRef?.current?.style || {};
    const { scrollHeight = 0, scrollTop = 0 } = scrollDetail;
    const tableHeight = Number(height.replace('px', ''));
    props?.onScrollToLower?.(e);
    if (loadStatus === 'noMore') return; // 无更多数据
    if (Math.round(scrollHeight) === Math.round(tableHeight)) return; // 无数据
    if (scrollTop === 0) return;
    const diff = scrollHeight - (scrollTop + tableHeight);
    if (diff < 30 && loadStatus != 'loading') {
      setTimeout(() => {
        onLoad?.(e);
      }, 400);
    }
  };

  const onScroll = (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    const { scrollTop, scrollHeight, scrollLeft } = e.detail;
    setScrollDetail({ scrollTop, scrollHeight, scrollLeft });
    props?.onScroll?.(e);
  };

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
                  rowClassName={rowClassName}
                  rowStyle={rowStyle}
                  colClassName={colClassName}
                  colStyle={colStyle}
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

  useImperativeHandle(ref, () => ({ scrollRef }));

  return (
    <View
      className={classNames(['taro-table-wrapper', wrapperClass])}
      style={wrapperStyle}
    >
      {loading && (
        <View className='taro-table-loading'>
          <Loading text={null}></Loading>
        </View>
      )}
      <ScrollView
        {...props}
        ref={scrollRef}
        className={classNames(['taro-table-scroll', classNames])}
        scrollX={scrollX}
        scrollY={scrollY}
        style={{ ...style, overflow: 'auto' }}
        onScrollToLower={onScrollToLower}
        onScroll={onScroll}
      >
        <View>
          {renderTableHead()}
          {renderTableBody()}
          <View className='taro-table-load-wrapper'>
            {props?.LoadMore ? (
              props.LoadMore
            ) : (
              <LoadMore status={loadStatus}></LoadMore>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(forwardRef(Table));
