import { memo, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.less'

export type EmptyProps = {
  text?: string | ReactNode
  fixedEmpty?: boolean
  left?: number
}

function Empty({ text = '暂无数据', fixedEmpty = true, left }: EmptyProps) {
  return (
    <View
      className={classNames('taro-table-empty', { ['taro-table-empty-sticky']: fixedEmpty })}
      style={{ left: `${left}px` }}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default memo(Empty)
