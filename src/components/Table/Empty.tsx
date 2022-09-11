import { memo } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.less'

export type EmptyProps = {
  text?: string
  fixedEmpty?: boolean
}

function Empty({ text = '暂无数据', fixedEmpty = true }) {
  return (
    <View className={classNames('taro-table-empty', { ['taro-table-empty-sticky']: fixedEmpty })}>
      <Text>{text}</Text>
    </View>
  )
}

export default memo(Empty)
