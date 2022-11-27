import { TitleRectType } from '../components/Table/types'
import { createContext } from 'react'

type TableContainerContext = {
  titleWidthMap?: TitleRectType
}

export const TableContext = createContext<TableContainerContext>({})
