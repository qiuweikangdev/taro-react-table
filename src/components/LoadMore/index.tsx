import { memo } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import Loading from '../Loading'
import './index.less'

export type LoadMoreProps = {
  status?: 'loading' | 'noMore' | null
  loadingText?: string
  noMoreText?: string
  size: Number
}

function LoadMore({ status, loadingText, noMoreText, size }) {
  return (
    <View className={classNames('load-more', 'load-more-sticky')}>
      {status === 'loading' && <Loading text={loadingText}></Loading>}
      {status == 'noMore' && size > 0 && (
        <Text className='no-more-text'>{noMoreText || '没有更多了'}</Text>
      )}
    </View>
  )
}

export default memo(LoadMore)
