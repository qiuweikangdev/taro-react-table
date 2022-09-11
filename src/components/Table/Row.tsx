import { memo } from 'react'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import { calculateFixedDistance, getSize, isNil } from '../../utils'
import { Columns, RowProps } from './types'
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
    colWidth = 0,
    cellEmptyText = '-',
    onRow,
  } = props
  return (
    <View className={classNames(['taro-table-row', rowClassName])} style={rowStyle}>
      {columns.map(
        (columnItem: Columns, colIndex: number): JSX.Element => {
          const text = dataSourceItem[columnItem.dataIndex]
          let result
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
                textAlign: columnItem.align || 'center',
                width: getSize(columnItem.width || colWidth),
                [columnItem.fixed as string]:
                  columnItem.fixed &&
                  calculateFixedDistance({
                    fixedType: columnItem.fixed,
                    index: colIndex,
                    columns,
                    colWidth,
                  }),
                ...colStyle,
              }}
              onClick={() => onRow?.(dataSourceItem, index)}
            >
              <Text
                className='taro-table-col-text'
                onClick={() => columnItem?.onCell?.(dataSourceItem, index)}
              >
                {result}
              </Text>
            </View>
          )
        },
      )}
    </View>
  )
}

export default memo(Row)
