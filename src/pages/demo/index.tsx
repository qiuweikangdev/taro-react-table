import { useState } from 'react'
import { Columns, LoadStatus, SorterEvent } from '../../components/Table/types'
import Table from '../../components/Table'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([
    {
      song1: '无人之境1',
      song2: '打回原形1',
      song3: '防不胜防1',
      song4: '十面埋伏1',
    },
    {
      song1: '无人之境2',
      song2: '打回原形2',
      song3: '防不胜防2',
      song4: '十面埋伏2',
    },
    {
      song1: '无人之境3',
      song2: '打回原形3',
      song3: '防不胜防3',
      song4: '十面埋伏3',
    },
    {
      song1: '无人之境4',
      song2: '打回原形4',
      song3: '防不胜防4',
      song4: '十面埋伏4',
    },
    {
      song1: '无人之境5',
      song2: '打回原形5',
      song3: '防不胜防5',
      song4: '十面埋伏5',
    },
    {
      song1: '无人之境6',
      song2: '打回原形6',
      song3: '防不胜防6',
      song4: '十面埋伏6',
    },
  ])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(null)
  const [sortInfo, setSortInfo] = useState<Omit<SorterEvent, 'column'>>({
    field: 'song1',
    order: 'ascend',
  })

  const columns: Columns[] = [
    {
      title: 'Song1',
      dataIndex: 'song1',
      sorter: true,
      fixed: 'left',
      sortOrder: sortInfo.field == 'song1' && sortInfo.order,
    },
    {
      title: 'Song2',
      dataIndex: 'song2',
    },
    {
      title: 'Song3',
      dataIndex: 'song3',
    },
    {
      title: 'Song4',
      dataIndex: 'song4',
    },
  ]

  const getList = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = [...dataSource]
        for (let i = 1; i < 10; i++) {
          const size = list.length + 1
          list.push({
            song1: `无人之境${size}`,
            song2: `打回原形${size}`,
            song3: `防不胜防${size}`,
            song4: `十面埋伏${size}`,
          })
        }
        resolve(list)
      }, 1000)
    })
  }

  const onLoad = async e => {
    console.log('load')

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
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      style={{ height: '250px' }}
      onLoad={onLoad}
      loadStatus={loadStatus}
      onSorter={onSorter}
    ></Table>
  )
}
