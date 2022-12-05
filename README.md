
# taro-react-table

基于Taro3、React的H5和微信小程序多端表格组件
- 兼容H5、微信小程序
- 自定义样式
- 自定义排序
- 固定表头
- 滚动上拉加载


![](https://raw.githubusercontent.com/qiuweikangdev/taro-react-table/master/images/demo.gif)


# 安装
```bash
npm install taro-react-table
````
# 配置

- config/index.js配置
- 让taro去通过postcss编译处理 `taro-react-table`模块, 需要对 `taro-react-table` 里的样式单位进行转换适配

```js
// config/index.js
const config = {
	h5:{
       esnextModules: ['taro-react-table']
    }
}
```

# 导入组件

```js
import Table from 'taro-react-table'
import 'taro-react-table/dist/index.css'
```

# 参数说明

## Table

| 参数              | 描述                                                         | 类型                                     | 必传 | 默认值     |
| ----------------- | ------------------------------------------------------------ | ---------------------------------------- | ---- | ---------- |
| 本身参数          | 参考[ScrollView](https://taro-docs.jd.com/taro/docs/components/viewContainer/scroll-view) |                                          |      |            |
| `dataSource`      | 数据源                                                       | object[]                                 | 是   | `[]`       |
| `columns`         | 表格列的配置描述，具体项见下表                               | Columns[]                                | 是   | `[]`       |
| `rowKey`          | 表格行 key 的取值，可以是字符串或一个函数                    | string \| function(record): string       | 是   | `key`      |
| `wrapperClass`    | 外层容器的类名                                               | string                                   | 否   |            |
| `wrapperStyle`    | 外层容器的样式                                               | object                                   | 否   |            |
| `className`       | ScrollView容器类名                                           | string                                   | 否   |            |
| `style`           | ScrollView容器样式                                           | object                                   | 否   |            |
| `rowClassName`    | 行类名                                                       | string                                   | 否   |            |
| `rowStyle`        | 行样式                                                       | object                                   | 否   |            |
| `colClassName`    | 单元格类名                                                   | string                                   | 否   |            |
| `colStyle`        | 单元格样式                                                   | object                                   | 否   |            |
| `titleStyle`      | 标题样式                                                     | object                                   | 否   |            |
| `titleClassName`  | 标题类名                                                     | string                                   | 否   |            |
| `titleClassName`  | 标题类名                                                     | string                                   | 否   |            |
| `loading`         | 是否显示加载                                                 | boolean                                  | 否   |            |
| `loadingText`     | 加载文本                                                     | string                                   | 否   | ''         |
| `loadStatus`      | 加载状态                                                     | loading \| noMore \| null                | 否   | null       |
| `unsort`          | 设置是否取消排序 (一般需求不需要取消排序，设置true可开启取消排序) | boolean                                  | 否   | false      |
| `showHeader`      | 是否显示表头                                                 | boolean                                  | 否   | true       |
| `noMoreText`      | loadStatus为noMore 状态显示文案                              | string                                   | 否   | 没有更多了 |
| `loadLoadingText` | loadStatus为loading 状态显示文案                             | string                                   | 否   | 加载中...  |
| `distance`        | 小于视窗距离多少开始触发onLoad                               | number                                   | 否   | 30         |
| `showLoad`        | 是否显示load加载状态，为false时不触发onLoad事件              | boolean                                  | 否   | true       |
| `fixedLoad`       | 是否固定加载更多，不随X轴滚动而滚动                          | boolean                                  | 否   | true       |
| `emptyText`       | 空数据显示文本                                               | string \| ReactNode                      | 否   | 暂无数据   |
| `cellEmptyText`   | 单元格空数据显示文本                                         | string                                   | 否   | -          |
| `renderEmpty`     | 自定义渲染空数据                                             | ReactNode                                | 否   |            |
| `size`            | 间距大小                                                     | 'small' \| 'middle' \| 'large' \| number | 否   | middle     |
| `colWidth`        | 默认列宽度                                                   | number                                   | 否   | 120        |



## Events

| 事件名     | 描述                       | 类型                                    | 必传 | 默认值 |
| ---------- | -------------------------- | --------------------------------------- | ---- | ------ |
| `onLoad`   | 滚动底部触发，用于上拉加载 | Function                                | 否   |        |
| `onSorter` | 点击表头按钮触发排序       | ({ column, field, order }: SorterEvent) | 否   |        |
| `onRow`    | 行点击事件                 | function(record, index)                 | 否   |        |



## Column

| 参数        | 描述                                                         | 类型                               | 必传        | 默认值 |
| ----------- | ------------------------------------------------------------ | ---------------------------------- | ----------- | ------ |
| `title`     | 标题                                                         | string                             | JSX.Element | 是     |
| `dataIndex` | 列数据在数据项中对应的路径                                   | string                             | 是          | `[]`   |
| `key`       | 表格行 key 的取值，可以是字符串或一个函数                    | string \| function(record): string | 否          | `key`  |
| `align`     | 设置该列文本对齐方式                                         | string                             | 否          | center |
| `style`     | 标题样式                                                     | object                             | 否          |        |
| `align`     | 外层容器的类名                                               | string                             | 否          |        |
| `className` | 标题类名                                                     | string                             | 否          |        |
| `render`    | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 | function(text, record, index) {}   | 否          |        |
| `width`     | ScrollView容器类名                                           | string                             | 否          |        |
| `fixed`     | 固定列                                                       | left \| right                      | 否          |        |
| `sorter`    | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)，需要服务端排序可设为 true | CompareFn                          | 否          |        |
| `sortOrder` | 排序的受控属性，外界可用此控制列的排序，可设置为 `ascend` `descend` false | boolean \| string                  |             |        |
| `onCell`    | 单元格点击事件                                               | function(record, index)            | 否          |        |



# 使用

```jsx
import { useState } from 'react'
import 'taro-react-table/dist/index.css'
import Table,{ Columns, LoadStatus, SorterEvent } from 'taro-react-table'

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

```

# 友情推荐

| 项目                                                         | 描述                                         |
| ------------------------------------------------------------ | -------------------------------------------- |
| [taro-react-echarts](https://github.com/qiuweikangdev/taro-react-echarts) | 基于Taro3、React的H5和微信小程序多端图表组件 |
