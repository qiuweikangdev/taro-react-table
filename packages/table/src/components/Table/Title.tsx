import { memo } from 'react'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import { calculateFixedDistance, getSize } from '../../utils'
import { Columns, SortOrder, TitleProps } from './types'
import './index.less'

function Title(props: TitleProps) {
  const {
    setColumns,
    columns,
    column,
    index,
    titleStyle = {},
    titleClassName = '',
    colWidth = 0,
    unsort,
    setDataSource,
    dataSource = [],
    onSorter,
  } = props

  const handleClickTitle = (col: Columns, colIndex: number) => {
    const sorter = col.sorter
    if (sorter) {
      const tempColumns = [...columns]
      tempColumns.forEach((j: Columns, i: number): void => {
        if (i !== colIndex) {
          delete j.sortOrder
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
            colWidth,
          }),
        width: getSize(column.width || colWidth),
        ...column.titleStyle,
        ...titleStyle,
      }}
      key={column.key || column.dataIndex}
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
  )
}

export default memo(Title)
