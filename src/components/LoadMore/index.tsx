import { forwardRef, ForwardRefRenderFunction, memo, useImperativeHandle } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import Loading from '../Loading'
import './index.less'

export type LoadMoreProps = {
  status?: 'loading' | 'noMore' | null
  loadingText?: string
  noMoreText?: string
  size: Number
  fixedLoad?: boolean
  left?: number
}

function LoadMore({
  status,
  loadingText,
  noMoreText,
  size,
  fixedLoad = true,
  left,
}: LoadMoreProps) {
  return (
    <View
      className={classNames('load-more', { ['load-more-sticky']: fixedLoad })}
      style={{ left: `${left}px` }}
    >
      {status === 'loading' && <Loading text={loadingText}></Loading>}
      {status == 'noMore' && size > 0 && (
        <Text className='no-more-text'>{noMoreText || '没有更多了'}</Text>
      )}
    </View>
  )
}

export default memo(LoadMore)
