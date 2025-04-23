---
title: 虚拟列表
date: 2025-02-20
category:
  - JavaScript
---

# 固定列表

<div class="list" ref="fixedListRef" @scroll="fixedScrollEvent">

  <div class="list-containter" :style="{transform: `translate3d(0,${fixedModel.startOffset}px,0)`}">
    <div class="fixed-list-item" v-for="ite in fixedModel.list" :key="ite.id">
     {{ite.name}}
    </div>
  </div>
  <div class="list-place"></div>
</div>

- 设置2个子元素，一个子元素是列表，一个子元素是占位元素
- 占位元素的高度是所有列表元素的总高度
- 列表元素的高度是固定的，所以列表元素的总高度也是固定的
- 当滚动时，根据滚动条的位置，计算出当前应该显示的列表元素的起始索引和结束索引

```html
<div class="list" ref="fixedListRef" @scroll="fixedScrollEvent">
  <!-- 列表 -->
  <div class="list-containter" :style="{transform: `translate3d(0,${startOffset}px,0)`}">
    <div class="fixed-list-item" v-for="ite in list" :key="ite.id">
     {{ite.name}}
    </div>
  </div>
  <!-- 占位元素 计算整体高度 赋值 -->
  <div class="list-place" :height="allHeight"></div>
</div>
```

监听滚动事件，获取滚动高度和列表元素

```js
const scroll = (e) => {
  const scrollTop = e.target.scrollTop || 0
  // 滚动高度 / 列表元素高度 = 起始索引
  const startIndex = Math.floor(scrollTop / height)
  const endIndex = startIndex + 20
  const list = allList.slice(startIndex, endIndex)
  // 计算起始偏移量 = 滚动高度 - 滚动位置相对于当前列表项高度的偏移量
  const startOffset = scrollTop - (scrollTop % height)
}
```

# 不固定列表

<div class="water-list" ref="waterListRef" @scroll="waterScrollEvent">
  <div class="phantomContainer" ref="phantomRef"
    :style="{ position: 'relative', height: waterModel.phantomHeight + 'px' }"></div>
  <div ref="waterListContainerRef" :style="{transform: `translate3d(0,${waterModel.startOffset}px,0)`}" class="water-list-items">
    <div v-for="(ite, i) in waterModel.list" :key="ite.id" :data-index="i"
     class="water-list-item">
     <p>
      No. {{ ite.index }}
     </p>
     <p>
      {{ ite.name }}
     </p>
    </div>
  </div>
</div>

- 先假设每个元素的高度都是固定的，然后计算出所有元素的总高度
- 当元素渲染到dom时，获取到每个元素的真实高度，记录并重新计算元素的总高度
- 滚动时获取滚动高度，从记录的元素高度中找到当前应该显示的元素，计算出起始索引和结束索引

```js
const initCachedPositions = () => {
  const cachedPositions = []
  // 假设每个元素的高度都是固定的
  const height = 20
  for (let i = 0; i < allPhantomList.length; i++) {
    cachedPositions[i] = {
      index: i,
      height: height,
      top: i * height,
      bottom: (i + 1) * height,
      // 偏移量
      dValue: 0
    }
  }
  list = cachedPositions.slice(0, 20)
}

const updateCachedPositions = () => {
  // 元素列表中的循环元素
  // 获取真实高度
  const nodes = waterListContainerRef.value.childNodes
  let start = null
  nodes.forEach(node => {
    // nodeType = 1  为元素，反正获取空白等文本类型
    if (!node || node.nodeType !== 1) {
      return
    }
    if (!start) {
      start = node
    }
    const rect = node.getBoundingClientRect()
    const { height } = rect
    const index = node.dataset.index
    // 原来旧的固定高度
    const oldHeight = cachedPositions[index].height
    // 和正式高度的偏移量
    const dValue = oldHeight - height;

    // 存在偏移量 更新数据
    if (dValue) {
      cachedPositions[index].height = height
      cachedPositions[index].bottom -= dValue
      cachedPositions[index].dValue = dValue
    }
  })

  // 重新计算总高度
  let startIndex = 0
  if (start) {
    // 当前列表的渲染元素的起始索引
    startIndex = Number(start.dataset.index)
  }

  const cachedPositionsLen = cachedPositions.length
  // 获取偏移量
  let cumulativeDiffHeight = cachedPositions[startIndex].dValue
  cachedPositions[startIndex].dValue = 0

  for (let i = startIndex + 1; i < cachedPositionsLen; i++) {
    const item = cachedPositions[i]
    cachedPositions[i].top -= cachedPositions[i - 1].bottom
    cachedPositions[i].bottom = cachedPositions[i].bottom - cumulativeDiffHeight
    if (item.dValue !== 0) {
      // 偏移量下面的元素计算要累计上面的偏移量 才是正确的偏移量
      cumulativeDiffHeight += item.dValue
      item.dValue = 0
    }
  }

  const height = cachedPositions[cachedPositionsLen - 1].bottom
  // 更新占位高度
  phantomHeight = height

}

const scroll = (e) => {
  const scrollTop = e.target.scrollTop || 0
  // 根据滚动高度获取对应的起始索引
  const startIndex = getStartIndex(scrollTop)

  if(startIndex === originStartIndex) return
  originStartIndex = startIndex
  startIndex = startIndex
  const endIndex = Math.min(startIndex + 20, cachedPositions.length + 1)
  // startIndex -5 必须 不如滚动到最下面的时候，会造成滚动抖动
  const index = Math.max(startIndex - 5,0)
  list = cachedPositions.slice(index, endIndex)
  startOffset = index > 1 ? cachedPositions[index -1].bottom : 0

}

const getStartIndex = (value) => {
  const list = cachedPositions
  let left = 0, right = list.length - 1, mid = -1
  while (left < right) {
    mid = Math.floor((left + right) / 2)
    const midValue = list[mid].bottom
    if (midValue == value) {
      return mid
    } else if (midValue < value) {
      left = mid + 1
    } else if (midValue > value) {
      right = mid - 1
    }
  }
  const targetItem = list[mid]
  if (targetItem && targetItem.bottom < value) {
    mid += 1
  }
  return mid
}
```

# 参考

- <https://codesandbox.io/p/sandbox/a-v-list-has-dynamic-inner-height-yh0r7?file=%2Fsrc%2FVList.tsx%3A129%2C31>

<script setup>
import { reactive,ref,onMounted, onUpdated} from 'vue'

// 固定
const fixedListRef = ref(null)
const allList = new Array(10000).fill(0).map((item, index) => ({ id: index, name: `第${index}个元素` }))
const fixedModel = reactive({
  list:[],
  height: 20,
  startOffset:0,
})

const fixedScrollEvent = (e) => {
  const scrollTop = e.target.scrollTop || 0
  const startIndex = Math.floor(scrollTop / fixedModel.height)
  const endIndex = startIndex + 20
  fixedModel.list = allList.slice(startIndex, endIndex)
  fixedModel.startOffset = scrollTop - (scrollTop % fixedModel.height)
}
onMounted(()=>{
  fixedScrollEvent({target:{scrollTop:0}})
})
// 不固定
const phantomRef = ref()
const waterListContainerRef = ref()
const waterListRef = ref(null)
const waterModel = reactive({
  list: [],
  cachedPositions: [],
  height: 20,
  startOffset: 0,
  startIndex: 0,
  originStartIndex:0,
  phantomHeight: 0,

})

const allPhantomList = new Array(10000).fill(0).map((item, index) => {
  return {
    id: index,
    name:  "123".repeat(Math.random() * 100),
    bottom: index * waterModel.height
  }
})

const initCachedPositions = () => {
  const cachedPositions = []
  for (let i = 0; i < allPhantomList.length; i++) {
    cachedPositions[i] = {
      index: i,
      name: allPhantomList[i].name,
      height: waterModel.height,
      top: i * waterModel.height,
      bottom: (i + 1) * waterModel.height,
      dValue: 0
    }
  }
  waterModel.list = cachedPositions.slice(0, 20)
  waterModel.cachedPositions = cachedPositions
}

const updateCachedPositions = () => {
  const nodes = waterListContainerRef.value.childNodes
  let start = null
  nodes.forEach(node => {
    if (!node || node.nodeType !== 1) {
      return
    }
    if (!start) {
      start = node
    }
    const rect = node.getBoundingClientRect()
    const { height } = rect
    const index = node.dataset.index
    const oldHeight = waterModel.cachedPositions[index].height
    const dValue = oldHeight - height;

    if (dValue) {
      waterModel.cachedPositions[index].height = height
      waterModel.cachedPositions[index].bottom -= dValue
      waterModel.cachedPositions[index].dValue = dValue
    }
  })

  let startIndex = 0
  if (start) {
    startIndex = Number(start.dataset.index)
  }

  const cachedPositionsLen = waterModel.cachedPositions.length
  let cumulativeDiffHeight = waterModel.cachedPositions[startIndex].dValue
  waterModel.cachedPositions[startIndex].dValue = 0

  for (let i = startIndex + 1; i < cachedPositionsLen; i++) {
    const item = waterModel.cachedPositions[i]
    waterModel.cachedPositions[i].top -= waterModel.cachedPositions[i - 1].bottom
    waterModel.cachedPositions[i].bottom = waterModel.cachedPositions[i].bottom - cumulativeDiffHeight

    if (item.dValue !== 0) {
      cumulativeDiffHeight += item.dValue
      item.dValue = 0
    }
  }

  const height = waterModel.cachedPositions[cachedPositionsLen - 1].bottom
  console.log(height, 'height')
  waterModel.phantomHeight = height
  // phantomRef.value.style.height = `${height}px`

}

const waterScrollEvent = (e) => {
  const scrollTop = e.target.scrollTop || 0
  const startIndex = getStartIndex(scrollTop)

  if(startIndex === waterModel.originStartIndex) return
  waterModel.originStartIndex = startIndex
  waterModel.startIndex = startIndex
  const endIndex = Math.min(startIndex + 20, waterModel.cachedPositions.length + 1)
  // startIndex -5 必须 不如滚动到最下面的时候，会造成滚动抖动
  const index = Math.max(startIndex - 5,0)
  waterModel.list = waterModel.cachedPositions.slice(index, endIndex)
  waterModel.startOffset = index > 1 ? waterModel.cachedPositions[index -1].bottom : 0

}

const getStartIndex = (value) => {
  const list = waterModel.cachedPositions
  let left = 0, right = list.length - 1, mid = -1
  while (left < right) {
    mid = Math.floor((left + right) / 2)
    const midValue = list[mid].bottom
    if (midValue == value) {
      return mid
    } else if (midValue < value) {
      left = mid + 1
    } else if (midValue > value) {
      right = mid - 1
    }
  }
  const targetItem = list[mid]
  if (targetItem && targetItem.bottom < value) {
    mid += 1
  }
  return mid
}

onUpdated(() => {
  updateCachedPositions()
})

const initSetup = () => {
  initCachedPositions()
}
initSetup()

onMounted(() => {
  updateCachedPositions()
})
</script>
<style lang="scss" scoped>

.list {
  position: relative;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  height: 400px;
  overflow-y: auto;
  .list-place {
    height: 200000px;
  }
  .list-containter {
    position: absolute;
  }
  .fixed-list-item {
    height: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
  }
}
.water-list {
  height: 800px;
  overflow: auto;
  width: 400px;
  position: relative;
}

.water-list-items {
  position: absolute;
  top: 0;
}

.water-list-item {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  word-break: break-all;
}
</style>
