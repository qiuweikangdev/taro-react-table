import {
  memo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useCallback,
} from 'react'
import classNames from 'classnames'

import { BaseEventOrig, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import Row from './Row'
import Title from './Title'
import Empty from './Empty'

import Loading from '../Loading'
import LoadMore from '../LoadMore'
import { useUpdateState } from '../../hooks'
import { ScrollDetail, LoadStatus, DataSource, TableProps, Columns, ScrollDirección } from './types'
import './index.less'

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
    colWidth = 120,
    onLoad,
    onSorter,
    unsort = false, // 设置取消排序 【一般需求不需要取消排序，设置true可开启取消排序】
    showHeader = true,
    loadingText = '',
    noMoreText,
    loadLoadingText,
    onRow,
    distance = 30,
    ...props
  },
  ref,
) => {
  const scrollRef = useRef<HTMLElement>(null)
  const scrollDetailRef = useRef<ScrollDetail>({
    scrollLeft: 0,
    scrollHeight: 0,
    scrollTop: 0,
  })
  const [dataSource, setDataSource] = useUpdateState<unknown[]>(pDataSource)
  const [columns, setColumns] = useUpdateState<Columns[]>(pColumns)
  const [loadStatus] = useUpdateState<LoadStatus>(pLoadStatus)
  const [scrollDistance, setScrollDistance] = useState<number>(0)
  const [scrollDirección, setScrollDirección] = useState<ScrollDirección>(null)

  const getHeight = useCallback((height) => {
    return Number(height.replace('calc', '').replace('(', '').replace(')', '').replace('px', ''))
  }, [])

  // 上拉加载
  const onScrollToLower = (e) => {
    const { height = '' } = scrollRef?.current?.style || {}
    const { scrollHeight = 0, scrollTop = 0 } = scrollDetailRef.current
    const tableHeight = getHeight(height)
    props?.onScrollToLower?.(e)
    // 无更多数据
    if (loadStatus === 'noMore') return
    if (Math.round(scrollHeight) === Math.round(tableHeight)) return // 无数据
    if (scrollTop === 0) return
    const diff = scrollHeight - (scrollTop + tableHeight)
    // 小于视窗距离多少开始触发onLoad, 默认30
    if (diff < distance && loadStatus != 'loading') {
      setTimeout(() => {
        onLoad?.(e)
      }, 300)
    }
  }

  const onScroll = (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    const { scrollTop, scrollHeight, scrollLeft } = e.detail
    const { height = '' } = scrollRef?.current?.style || {}
    const clientHeight = getHeight(height)
    const diff = scrollHeight - (Math.round(scrollTop) + clientHeight)
    const direction = scrollDetailRef.current.scrollLeft === scrollLeft ? 'x' : 'y'
    setScrollDirección(direction)
    setScrollDistance(diff)
    scrollDetailRef.current = { scrollTop, scrollHeight, scrollLeft }
    props?.onScroll?.(e)
  }

  const renderTableHead = () => {
    return (
      <View
        className={classNames(['taro-table-head'], {
          'taro-table-head-scroll': scrollY,
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
                  colWidth={colWidth}
                  setDataSource={setDataSource}
                  dataSource={dataSource}
                />
              )
            },
          )
        )}
      </View>
    )
  }

  const renderTableBody = () => {
    return (
      <View className='taro-table-body'>
        {dataSource.length > 0 && columns.length > 0
          ? dataSource.map(
              (item: DataSource, index: number): JSX.Element => {
                let key
                if (typeof rowKey === 'function') {
                  key = rowKey(item)
                } else {
                  key = item[rowKey]
                }
                if (!key) {
                  key = `row-item-${index}`
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
                    colWidth={colWidth}
                    onRow={onRow}
                  />
                )
              },
            )
          : loadStatus != 'loading' && <Empty />}
      </View>
    )
  }

  const renderTableLoad = () => {
    return (
      <View className='taro-table-load-wrapper'>
        <LoadMore
          status={loadStatus}
          size={dataSource.length}
          noMoreText={noMoreText}
          loadingText={loadLoadingText}
        ></LoadMore>
      </View>
    )
  }

  useImperativeHandle(ref, () => ({ scrollRef, scrollDistance, scrollDirección }))

  return (
    <View className={classNames(['taro-table-wrapper', wrapperClass])} style={wrapperStyle}>
      {loading && (
        <View className='taro-table-loading'>
          <Loading text={loadingText}></Loading>
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
        <View className='taro-table-content-wrapper'>
          {showHeader && columns.length > 0 && renderTableHead()}
          {renderTableBody()}
          {renderTableLoad()}
        </View>
      </ScrollView>
    </View>
  )
}

export default memo(forwardRef(Table))
