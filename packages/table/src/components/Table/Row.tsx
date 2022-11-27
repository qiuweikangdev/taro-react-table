import { memo, useContext } from 'react'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import { calculateFixedDistance, getSize, isNil } from '../../utils'
import { Columns, RowProps } from './types'
import { TableContext } from '../../utils/context'
import './index.less'

function Row(props: RowProps) {
  const {
    dataSourceItem,
    rowStyle = {},
    rowClassName = '',
    colClassName = '',
    colStyle = {},
    columns,
    index,
    cellEmptyText = '-',
    onRow,
    widthMap = {},
    striped = false,
    rowHeightMap = {},
  } = props

  const { titleWidthMap } = useContext(TableContext)

  return (
    <View
      id={`taro-table-row-${index}`}
      className={classNames([
        'taro-table-row',
        rowClassName,
        {
          ['taro-table-row-striped']: striped,
        },
      ])}
      style={rowStyle}
    >
      {columns.map((columnItem: Columns, colIndex: number): JSX.Element => {
        const text = dataSourceItem[columnItem.dataIndex]
        let width: string | number = widthMap[colIndex]
        let result
        if (columnItem.width) {
          width = columnItem.width
        }
        if (columnItem.render) {
          const render = columnItem.render(text, dataSourceItem, index)
          result = render
        } else {
          result = !isNil(text) ? String(text) : cellEmptyText
        }

        return (
          <View
            key={columnItem.key || columnItem.dataIndex}
            className={classNames(['taro-table-col'], {
              'taro-table-col-fixed': columnItem.fixed,
              [colClassName]: true,
            })}
            style={{
              width: getSize(width),
              textAlign: columnItem.align || 'center',
              height: rowHeightMap[`taro-table-row-${index}`]?.height,
              [columnItem.fixed as string]:
                columnItem.fixed &&
                calculateFixedDistance({
                  fixedType: columnItem.fixed,
                  index: colIndex,
                  columns,
                  titleWidthMap,
                }),
              ...colStyle,
            }}
            onClick={() => onRow?.(dataSourceItem, index)}
          >
            <Text
              className={classNames('taro-table-col-text', {
                'taro-table-col-text-ellipsis': columnItem.ellipsis,
              })}
              onClick={() => columnItem?.onCell?.(dataSourceItem, index)}
            >
              {result}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default memo(Row)
