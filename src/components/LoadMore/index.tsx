import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react'
import { View, Text } from '@tarojs/components'
import { TaroElement } from '@tarojs/runtime'
import classNames from 'classnames'
import Loading from '../Loading'
import { genId } from '../../utils'
import './index.less'

export type LoadMoreProps = {
  status?: 'loading' | 'noMore' | null
  loadingText?: string
  noMoreText?: string
  size: Number
  fixedLoad?: boolean
  left?: number
}

export type LoadMoreHandle = {
  loadMoreRef: RefObject<TaroElement>
}

const LoadMore: ForwardRefRenderFunction<LoadMoreHandle, LoadMoreProps> = (
  { status, loadingText, noMoreText, size, fixedLoad = true, left },
  ref,
) => {
  const loadMoreRef = useRef<TaroElement>(null)

  useImperativeHandle(ref, () => ({ loadMoreRef }))

  return (
    <View
      className={classNames('load-more', { ['load-more-sticky']: fixedLoad })}
      style={{ left: `${left}px` }}
      id={genId('load-more')}
      ref={loadMoreRef}
    >
      {status === 'loading' && <Loading text={loadingText}></Loading>}
      {status == 'noMore' && size > 0 && (
        <Text className='no-more-text'>{noMoreText || '没有更多了'}</Text>
      )}
    </View>
  )
}

export default memo(forwardRef(LoadMore))
