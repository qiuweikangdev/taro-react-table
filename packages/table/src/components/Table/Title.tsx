import { memo, useRef, useEffect, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import { calculateFixedDistance, getNumberSize, getSize } from '../../utils'
import { Columns, SortOrder, TitleProps } from './types'
import { useQuery, useUniqueId } from '../../hooks'
import { TaroElement } from '@tarojs/runtime'
import { TableContext } from '../../utils/context'
import './index.less'

function Title(props: TitleProps) {
  const {
    setColumns,
    columns,
    column,
    index,
    titleStyle = {},
    titleClassName = '',
    unsort,
    setDataSource,
    dataSource = [],
    onSorter,
    onTitleWidth,
    size,
  } = props

  const { titleWidthMap = {} } = useContext(TableContext)

  const [, { getRefSize }] = useQuery()
  const genId = useUniqueId()
  const titleRef = useRef<TaroElement | HTMLElement>(null)

  const handleClickTitle = (col: Columns, colIndex: number) => {
    const sorter = col.sorter
    if (sorter) {
      const tempColumns = [...columns]
      tempColumns.forEach((item: Columns, index: number): void => {
        if (index !== colIndex) {
          delete item.sortOrder
        }
      })
      /**
       * 排序有三种状态：点击升序、点击降序、取消排序。一般需求只需要升序和降序，不需要取消排序
       * 可通过unsort来设置 是否支持取消排序
       */
      let curCol: SortOrder[] = ['ascend', 'descend']
      if (unsort) {
        // undefined/false：取消排序，ascend：升序，descend：降序
        curCol = ['ascend', 'descend', undefined]
      }
      const curIndex: number = curCol.indexOf(tempColumns[colIndex].sortOrder)
      const next: SortOrder = (tempColumns[colIndex].sortOrder =
        curCol[(curIndex + 1) % curCol.length])

      if (typeof sorter === 'function') {
        const tempDataSource = [...dataSource]
        const sortDataSource = tempDataSource.sort((a, b) => sorter(a, b))
        setDataSource(sortDataSource)
      }
      setColumns(tempColumns)
      onSorter?.({ column, field: col.dataIndex, order: next })
    }
  }

  useEffect(() => {
    getTitleSize()
  }, [column])

  const getTitleSize = async () => {
    if (titleRef.current) {
      const { width } = await getRefSize(titleRef.current)
      onTitleWidth?.({ index, width: width })
    }
  }

  const titleWidth = useMemo(() => {
    const width = column.width || titleWidthMap[index]
    return getSize(width)
  }, [column.width, titleWidthMap, index])

  return (
    <View
      onClick={() => handleClickTitle(column, index)}
      className={classNames(['taro-table-title'], {
        ['taro-table-fixed']: column.fixed,
        [titleClassName]: true,
      })}
      style={{
        [column.fixed as string]:
          column.fixed &&
          calculateFixedDistance({
            fixedType: column.fixed,
            index,
            columns,
            titleWidthMap,
          }),
        ...column.titleStyle,
        ...titleStyle,
        width: titleWidth,
        padding: `${getSize(0)} ${getSize(getNumberSize(size))}`,
      }}
      key={column.key || column.dataIndex}
    >
      <View
        id={genId('taro-table-title-text-wrapper')}
        ref={titleRef}
        className='taro-table-title-text-wrapper'
      >
        <Text className='taro-table-title-text'>{column.title}</Text>
        {column.sorter && (
          <View className='taro-table-title-sort-wrwapper'>
            <View
              className={classNames({
                ['title-sort-btn']: true,
                ['title-ascend']: true,
                ['title-ascend-active']: column.sortOrder === 'ascend',
              })}
            />
            <View
              className={classNames({
                ['title-sort-btn']: true,
                ['title-descend']: true,
                ['title-descend-active']: column.sortOrder === 'descend',
              })}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(Title)
