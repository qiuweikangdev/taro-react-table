import { View, Text } from '@tarojs/components'
import './index.less'

export type LoadingProps = {
  text?: string | null | undefined
}

function Loading({ text = '加载中...' }: LoadingProps) {
  return (
    <View className='loading-wrapper'>
      <View className='loading' />
      <Text className='loading-text'>{text}</Text>
    </View>
  )
}

export default Loading
