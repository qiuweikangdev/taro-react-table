import {
  memo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
} from 'react'
import classNames from 'classnames'

import { BaseEventOrig, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Row from './Row'
import Title from './Title'
import Empty from './Empty'

import Loading from '../Loading'
import LoadMore, { LoadMoreHandle } from '../LoadMore'
import { useQuery, useUpdateState, useMount } from '../../hooks'
import { ScrollDetail, LoadStatus, DataSource, TableProps, Columns } from './types'
import { genId } from '../../utils'
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
    showLoad = true,
    fixedLoad = true, // 是否固定加载更多，不随X轴滚动而滚动
    emptyText,
    ...props
  },
  ref,
) => {
  const scrollRef = useRef<HTMLElement>(null)
  const loadWrapperRef = useRef<HTMLElement>(null)
  const loadMoreRef = useRef<LoadMoreHandle>(null)
  const headRef = useRef<HTMLElement>(null)
  const scrollDetailRef = useRef<ScrollDetail>({
    scrollLeft: 0,
    scrollHeight: 0,
    scrollTop: 0,
  })
  const [dataSource, setDataSource] = useUpdateState<unknown[]>(pDataSource)
  const [columns, setColumns] = useUpdateState<Columns[]>(pColumns)
  const [loadStatus] = useUpdateState<LoadStatus>(pLoadStatus)
  const [scrollDistance, setScrollDistance] = useState<number>(0)
  const [loadLeft, setLoadLeft] = useState<number>(0)
  const [firstLoadWidth, setFirstLoadWidth] = useState<number>(0)

  const [, { getRefSize }] = useQuery()

  // first render tableload
  const getFirstLoadWidth = useCallback(async () => {
    if (showLoad && loadWrapperRef.current) {
      const { width } = await getRefSize(loadWrapperRef.current)
      setFirstLoadWidth(width)
    }
  }, [getRefSize, showLoad])

  // scroll load
  const onScrollToLower = async e => {
    if (scrollRef?.current) {
      const { height: tableHeight } = await getRefSize(scrollRef?.current)
      const { scrollHeight = 0, scrollTop = 0 } = scrollDetailRef.current
      props?.onScrollToLower?.(e)
      if (!showLoad) return
      if (loadStatus === 'noMore') return // 无更多数据
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
  }

  const onScroll = async (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    if (scrollRef?.current) {
      const { scrollTop, scrollHeight, scrollLeft } = e.detail
      const { height: tableHeight } = await getRefSize(scrollRef?.current)
      if (showLoad && headRef?.current && loadWrapperRef.current) {
        const totalWidth = firstLoadWidth + scrollLeft
        const { width: headWidth } = await getRefSize(headRef.current)
        loadWrapperRef.current.style.width = `${totalWidth}px`
        loadWrapperRef.current.style.maxWidth = `${headWidth}px`
      }
      const diff = scrollHeight - (Math.round(scrollTop) + tableHeight)
      setScrollDistance(diff)
      scrollDetailRef.current = { scrollTop, scrollHeight, scrollLeft }
      props?.onScroll?.(e)
    }
  }

  const renderTableHead = () => {
    return (
      <View
        ref={headRef}
        className={classNames(['taro-table-head'], {
          'taro-table-head-scroll': scrollY,
        })}
        id={genId('taro-table-head')}
      >
        {columns.length === 0 ? (
          <Empty text={emptyText} />
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
          : loadStatus != 'loading' && <Empty text={emptyText} />}
      </View>
    )
  }

  const renderTableLoad = () => {
    return (
      <View
        ref={loadWrapperRef}
        className='taro-table-load-wrapper'
        id={genId('taro-table-load-wrapper')}
      >
        <LoadMore
          status={loadStatus}
          size={dataSource.length}
          noMoreText={noMoreText}
          loadingText={loadLoadingText}
          fixedLoad={fixedLoad}
          left={loadLeft}
          ref={loadMoreRef}
        ></LoadMore>
      </View>
    )
  }

  // fixed table load
  const stickyTableLoad = useCallback(async () => {
    if (fixedLoad && showLoad && loadStatus) {
      if (loadWrapperRef.current && loadMoreRef.current?.loadMoreRef.current) {
        const { width: loadWidth } = await getRefSize(loadMoreRef.current.loadMoreRef.current)
        if (firstLoadWidth && loadWidth) {
          const left = Math.round(firstLoadWidth / 2) - Math.round(loadWidth / 2)
          console.log('3')
          setLoadLeft(left)
        }
      }
    }
  }, [fixedLoad, showLoad, getRefSize, loadStatus, firstLoadWidth])

  useEffect(() => {
    Taro.nextTick(async () => {
      stickyTableLoad()
    })
  }, [stickyTableLoad])

  useMount(() => {
    getFirstLoadWidth()
  })

  //  initialize sticky load left
  useEffect(() => {
    const left = Math.round(firstLoadWidth / 2) - Math.round(100 / 2)
    setLoadLeft(left)
  }, [firstLoadWidth])

  useImperativeHandle(ref, () => ({ scrollRef, scrollDistance }))

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
        id={genId('taro-table-scroll')}
      >
        <View className='taro-table-content-wrapper'>
          {showHeader && columns.length > 0 && renderTableHead()}
          {renderTableBody()}
          {showLoad && renderTableLoad()}
        </View>
      </ScrollView>
    </View>
  )
}

export default memo(forwardRef(Table))
