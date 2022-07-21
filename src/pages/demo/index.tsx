import { useState } from 'react'
import { View } from '@tarojs/components'
import { Columns, LoadStatus, SorterEvent } from '../../components/Table/types'
import Table from '../../components/Table'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([
    {
      name1: '无人之境1',
      name2: '打回原形1',
      name3: '防不胜防1',
      name4: '十面埋伏1',
    },
    {
      name1: '无人之境2',
      name2: '打回原形2',
      name3: '防不胜防2',
      name4: '十面埋伏2',
    },
    {
      name1: '无人之境3',
      name2: '打回原形3',
      name3: '防不胜防3',
      name4: '十面埋伏3',
    },
    {
      name1: '无人之境4',
      name2: '打回原形4',
      name3: '防不胜防4',
      name4: '十面埋伏4',
    },
    {
      name1: '无人之境5',
      name2: '打回原形5',
      name3: '防不胜防5',
      name4: '十面埋伏5',
    },
    {
      name1: '无人之境6',
      name2: '打回原形6',
      name3: '防不胜防6',
      name4: '十面埋伏6',
    },
  ])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(null)
  const [sortInfo, setSortInfo] = useState<Omit<SorterEvent, 'column'>>({
    field: 'name1',
    order: 'ascend',
  })

  const columns: Columns[] = [
    {
      title: '陈奕迅1',
      dataIndex: 'name1',
      sorter: true,
      fixed: 'left',
      sortOrder: sortInfo.field == 'name1' && sortInfo.order,
    },
    {
      title: '陈奕迅2',
      dataIndex: 'name2',
    },
    {
      title: '陈奕迅3',
      dataIndex: 'name3',
    },
    {
      title: '陈奕迅4',
      dataIndex: 'name4',
    },
  ]

  const getList = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = [...dataSource]
        for (let i = 1; i < 10; i++) {
          const size = list.length + 1
          list.push({
            name1: `无人之境${size}`,
            name2: `打回原形${size}`,
            name3: `防不胜防${size}`,
            name4: `十面埋伏${size}`,
          })
        }
        resolve(list)
      }, 1000)
    })
  }

  const onLoad = async e => {
    setLoadStatus('loading')
    const list = await getList()
    setDataSource(list)
    setLoadStatus(list.length > 20 ? 'noMore' : null)
  }

  // 排序回调
  const onSorter = ({ column, field, order }: SorterEvent) => {
    console.log(column, field, order)
    // 模拟排序加载效果
    setLoading(state => !state)
    setSortInfo({ order, field })
    const tempList = [...dataSource]
    setTimeout(() => {
      setLoading(false)
      tempList.reverse()
      setDataSource(tempList)
    }, 1000)
  }

  return (
    <View>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        style={{ height: '250px' }}
        onLoad={onLoad}
        loadStatus={loadStatus}
        onSorter={onSorter}
      ></Table>
    </View>
  )
}
