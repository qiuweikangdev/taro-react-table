import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  ReactNode,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react'
import { View, Text } from '@tarojs/components'
import { TaroElement } from '@tarojs/runtime'
import classNames from 'classnames'
import { useUniqueId } from '../../hooks'
import './index.less'

export type EmptyProps = {
  text?: string | ReactNode
  fixedEmpty?: boolean
  left?: number
}

export type EmptyHandle = {
  emptyRef: RefObject<TaroElement>
}

const Empty: ForwardRefRenderFunction<EmptyHandle, EmptyProps> = (
  { text = '暂无数据', fixedEmpty = true, left },
  ref,
) => {
  const genId = useUniqueId()
  const emptyRef = useRef<TaroElement>(null)
  useImperativeHandle(ref, () => ({ emptyRef }))
  return (
    <View
      className={classNames('taro-table-empty', { ['taro-table-empty-sticky']: fixedEmpty })}
      style={{ left: `${left}px` }}
      id={genId('taro-table-empty')}
      ref={emptyRef}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default memo(forwardRef(Empty))
