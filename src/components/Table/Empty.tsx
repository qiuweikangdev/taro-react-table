import { memo, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export type EmptyProps = {
  text?: string | ReactNode
}

function Empty({ text = '暂无数据' }: EmptyProps) {
  return (
    <View className='taro-table-empty'>
      <Text>{text}</Text>
    </View>
  )
}

export default memo(Empty)
