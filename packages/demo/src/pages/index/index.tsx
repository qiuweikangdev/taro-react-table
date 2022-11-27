import { useState } from 'react'
import Table, { Columns, LoadStatus, SorterEvent } from 'taro-react-table'
import './index.less'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([
    {
      name1: '无人之境1',
      name2: '打回原形1',
      name3: '防不胜防1',
      name4: '十面埋伏1',
      name5: 'k歌之王1',
      name6: '岁月如歌1',
    },
    {
      name1: '无人之境2',
      name2: '打回原形2',
      name3: '防不胜防2',
      name4: '十面埋伏2',
      name5: 'k歌之王2',
      name6: '岁月如歌2',
    },
    {
      name1: '无人之境3',
      name2: '打回原形3',
      name3: '防不胜防3',
      name4: '十面埋伏3',
      name5: 'k歌之王3',
      name6: '岁月如歌3',
    },
    {
      name1: '无人之境4',
      name2: '打回原形4',
      name3: '防不胜防4',
      name4: '十面埋伏4',
      name5: 'k歌之王4',
      name6: '岁月如歌4',
    },
    {
      name1: '无人之境5',
      name2: '打回原形5',
      name3: '防不胜防5',
      name4: '十面埋伏5',
      name5: 'k歌之王5',
      name6: '岁月如歌5',
    },
    {
      name1: '无人之境6',
      name2: '打回原形6',
      name3: '防不胜防6',
      name4: '十面埋伏6',
      name5: 'k歌之王6',
      name6: '岁月如歌6',
    },
  ])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(null)
  const [sortInfo, setSortInfo] = useState<Omit<SorterEvent, 'column'>>({
    field: 'name1',
    order: 'ascend',
  })

  const columns: Columns[] = [
    {
      title: 'Song1',
      dataIndex: 'name1',
      sorter: true,
      fixed: 'left',
      width: 100,
      sortOrder: sortInfo.field == 'name1' && sortInfo.order,
    },
    {
      title: 'Song2',
      width: 100,
      dataIndex: 'name2',
    },
    {
      title: 'Song3',
      dataIndex: 'name3',
    },
    {
      title: 'Song4',
      dataIndex: 'name4',
    },
    {
      title: 'Song5',
      dataIndex: 'name5',
    },
    {
      title: 'Song6',
      dataIndex: 'name6',
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
            name5: `k歌之王${size}`,
            name6: `岁月如歌${size}`,
          })
        }
        resolve(list)
      }, 1000)
    })
  }

  const onLoad = async (e) => {
    setLoadStatus('loading')
    const list = await getList()
    setDataSource(list)
    setLoadStatus(list.length > 20 ? 'noMore' : null)
  }

  // 排序回调
  const onSorter = ({ column, field, order }: SorterEvent) => {
    console.log(column, field, order)
    // 模拟排序加载效果
    setLoading((state) => !state)
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
    />
  )
}
