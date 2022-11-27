import {
  memo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import classNames from 'classnames'
import { nextTick } from '@tarojs/taro'
import { BaseEventOrig, ITouchEvent, ScrollView, ScrollViewProps, View } from '@tarojs/components'
import Row from './Row'
import Title from './Title'
import Empty from './Empty'
import Loading from '../Loading'
import LoadMore from '../LoadMore'
import { useQuery, useUpdateState, useUniqueId, useRendered } from '../../hooks'
import { ScrollDetail, LoadStatus, DataSource, TableProps, Columns, TitleRectType } from './types'
import { TableContext } from '../../utils/context'
import { getSize, pickValid } from '../../utils'
import { ElementRectType } from '../../hooks/useQuery'
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
    fixedLoad = true, // 是否固定加载更多，不随横向滚动而滚动
    emptyText,
    cellEmptyText,
    renderEmpty,
    striped = false,
    size = 'middle',
    ...props
  },
  ref,
) => {
  const scrollRef = useRef<HTMLElement>(null)
  const loadWrapperRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const emptyWrapperRef = useRef<HTMLElement>(null)
  const scrollDetailRef = useRef<ScrollDetail>({
    scrollLeft: 0,
    scrollHeight: 0,
    scrollTop: 0,
  })
  const [titleWidthMap, setTitleWidthMap] = useState<TitleRectType>({})
  const [dataSource, setDataSource] = useUpdateState<unknown[]>(pDataSource)
  const [columns, setColumns] = useUpdateState<Columns[]>(pColumns)
  const [loadStatus] = useUpdateState<LoadStatus>(pLoadStatus)
  const [scrollDistance, setScrollDistance] = useState<number>(0)
  const [rowHeight, setRowHeight] = useState<ElementRectType>({})
  const [, { getRefSize, getDoms }] = useQuery()
  const genId = useUniqueId()

  // scroll load
  const onScrollToLower = async (e) => {
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
      const { height: tableHeight } = await getRefSize(scrollRef.current)
      const diff = scrollHeight - (Math.round(scrollTop) + tableHeight)
      setScrollDistance(diff)
      scrollDetailRef.current = { scrollTop, scrollHeight, scrollLeft }
      props?.onScroll?.(e)
    }
  }

  const onTouchStart = async (e: ITouchEvent) => {
    //  fix: 固定列滚动问题重叠
    const rowIds = Array.from(Array(dataSource.length), (v, k) => k).map(
      (index) => `taro-table-row-${index}`,
    )
    const rowHeightMap = await getDoms(rowIds)
    setRowHeight(rowHeightMap)
    props?.onTouchStart?.(e)
  }

  // set fixed width
  const setFixedWidth = ({ width, fixedDom }) => {
    fixedDom.style.width = getSize(width)
    fixedDom.style.maxWidth = getSize(width)
  }

  // scroll fixed
  const onScrollFixed = useCallback(async () => {
    if (headRef.current) {
      const { width: headWidth } = await getRefSize(headRef.current)
      if (headWidth) {
        if (loadWrapperRef.current && fixedLoad) {
          setFixedWidth({ width: headWidth, fixedDom: loadWrapperRef.current })
        }
        if (emptyWrapperRef.current && !dataSource.length) {
          setFixedWidth({ width: headWidth, fixedDom: emptyWrapperRef.current })
        }
      }
    }
  }, [dataSource.length, fixedLoad, getRefSize])

  const renderTableEmpty = useRendered(() => {
    return (
      <View ref={emptyWrapperRef} className='taro-table-empty-wrapper'>
        <Empty text={emptyText} renderEmpty={renderEmpty} />
      </View>
    )
  })

  const onTitleWidth = ({ index, width }: Record<'index' | 'width', number>) => {
    setTitleWidthMap((state) => ({ ...state, [index]: width }))
  }

  const genTitleMap = useMemo(() => {
    const getColumnsWidth = columns.reduce(
      (acc, cur, index) => ({ ...acc, [index]: cur.width }),
      {},
    )
    return { ...titleWidthMap, ...pickValid(getColumnsWidth) }
  }, [columns, titleWidthMap])

  const renderTableHead = useRendered(() => {
    return (
      showHeader &&
      columns.length > 0 && (
        <View
          ref={headRef}
          className={classNames(['taro-table-head'], {
            'taro-table-head-scroll': scrollY,
          })}
          id={genId('taro-table-head')}
        >
          {columns.length === 0
            ? renderTableEmpty
            : columns.map((item: Columns, index: number): JSX.Element => {
                return (
                  <Title
                    key={item.key || item.dataIndex}
                    columns={columns}
                    column={item}
                    setColumns={setColumns}
                    onSorter={onSorter}
                    unsort={unsort}
                    index={index}
                    setDataSource={setDataSource}
                    dataSource={dataSource}
                    titleClassName={titleClassName}
                    titleStyle={titleStyle}
                    onTitleWidth={onTitleWidth}
                    size={size}
                  />
                )
              })}
        </View>
      )
    )
  })

  const renderTableBody = useRendered(() => {
    return (
      <View className='taro-table-body'>
        {dataSource.length > 0 && columns.length > 0
          ? dataSource.map((item: DataSource, index: number): JSX.Element => {
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
                  widthMap={titleWidthMap}
                  onRow={onRow}
                  cellEmptyText={cellEmptyText}
                  striped={striped}
                  rowHeightMap={rowHeight}
                  size={size}
                />
              )
            })
          : loadStatus != 'loading' && renderTableEmpty}
      </View>
    )
  })

  const renderTableLoad = useRendered(() => {
    const isShowLoad = showLoad && (dataSource.length || loadStatus)
    return (
      isShowLoad && (
        <View
          ref={loadWrapperRef}
          className={classNames('taro-table-load-wrapper', {
            ['taro-table-load-wrapper-center']: !fixedLoad,
          })}
        >
          <LoadMore
            status={loadStatus}
            size={dataSource.length}
            noMoreText={noMoreText}
            loadingText={loadLoadingText}
          />
        </View>
      )
    )
  })

  useEffect(() => {
    if (columns.length || !dataSource.length) {
      nextTick(() => {
        onScrollFixed()
      })
    }
  }, [columns, dataSource, onScrollFixed])

  useImperativeHandle(ref, () => ({ scrollRef, scrollDistance }))

  return (
    <TableContext.Provider value={{ titleWidthMap: genTitleMap }}>
      <View className={classNames(['taro-table-wrapper', wrapperClass])} style={wrapperStyle}>
        {loading && (
          <View className='taro-table-loading'>
            <Loading text={loadingText} />
          </View>
        )}
        <ScrollView
          {...props}
          ref={scrollRef}
          className={classNames(['taro-table-scroll', className])}
          scrollX={scrollX}
          scrollY={scrollY}
          style={{ ...style, overflow: 'auto' }}
          onScrollToLower={onScrollToLower}
          onScroll={onScroll}
          id={genId('taro-table-scroll')}
          onTouchStart={onTouchStart}
        >
          <View className='taro-table-content-wrapper'>
            {renderTableHead}
            {renderTableBody}
            {renderTableLoad}
          </View>
        </ScrollView>
      </View>
    </TableContext.Provider>
  )
}

export default memo(forwardRef(Table))
