import {
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
  ScrollView,
  ScrollViewProps,
  View
} from '@tarojs/components';
import Row from './Row';
import Title from './Title';
import Empty from './Empty';

import Loading from '../Loading';
import LoadMore from '../LoadMore';
import {
  ScrollDetail,
  LoadStatus,
  DataSource,
  TableProps,
  Columns
} from './types';
import './index.less';

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
    onSorter,
    unsort = false, // 设置取消排序 【一般需求不需要取消排序，设置true可开启取消排序】
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
                  columns={columns}
                  column={item}
                  setColumns={setColumns}
                  onSorter={onSorter}
                  unsort={unsort}
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
        {dataSource.length > 0
          ? dataSource.map(
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
          : loadStatus != 'loading' && <Empty />}
      </View>
    );
  };

  const renderTableLoad = () => {
    return (
      <View className='taro-table-load-wrapper'>
        <LoadMore status={loadStatus} size={dataSource.length}></LoadMore>
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
        </View>
      </ScrollView>
          {renderTableLoad()}
    </View>
  );
};

export default memo(forwardRef(Table));
