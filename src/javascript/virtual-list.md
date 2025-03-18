

<div class="list" ref="fixedListRef" @scroll="fixedScrollEvent">

  <div class="list-containter" :style="{transform: `translate3d(0,${fixedModel.startOffset}px,0)`}">
    <div class="fixed-list-item" v-for="ite in fixedModel.list" :key="ite.id">
     {{ite.name}}
    </div>
  </div>
  <div class="list-place"></div>
</div>


<div class="water-list" ref="waterListRef" @scroll="waterScrollEvent">
  <div class="phantomContainer" ref="phantomRef" :style="{position:'relative',height:waterModel.phantomHeight}"></div>
  <div ref="waterListContainerRef">
    <div v-for=(ite in waterModel.list) :key="ite.id" class="water-list-item">
      {{ite.name}}
    </div>
  </div>
</div>

<script setup>
import { reactive,ref } from 'vue'

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
const allList = new Array(10000).fill(0).map((item,index)=> {
  return {
    id:index,
    name: new Array(10*index).fill(0).map((ite,i)=> i).join(''),
    bottom: index * waterModel.height
  }
})

const initCachedPositions = () => {
  const cachedPositions = []
  for (let i = 0; i < allList.length; i++) {
    cachedPositions[i] = {
      index:i,
      height: waterModel.height,
      top: i * waterModel.height,
      bottom: (i + 1) * waterModel.height,
      dValue:0
    }
  }
  waterModel.list = cachedPositions.slice(0, 20)
  waterModel.cachedPositions =  cachedPositions
}

const updateCachedPositions = () => {
  const nodes = waterListContainerRef.value.childNodes
  const start = nodes[0]
  nodes.forEach(node => {
    if(!node) {
      return 
    }
    const rect = node.getBoundingClientRect()
    const {height} = rect 
    const index = node.dataset.index
    const oldHeight = waterModel.cachedPositions[index].height
    const dValue = oldHeight - height;

    if(dValue) {
      waterModel.cachedPositions[index].height = height
      waterModel.cachedPositions[index].bottom -= dValue
      waterModel.cachedPositions[index].dValue = dValue
    }
  })

  let startIndex = 0
  if(start) {
    startIndex = start.dataset.index
  }
 
  const cachedPositionsLen = waterModel.cachedPositions.length
  let cumulativeDiffHeight = waterModel.cachedPositions[startIndex].dValue
  waterModel.cachedPositions[startIndex].dValue = 0

  for(let i = startIndex + 1; i < cachedPositionsLen; i++) { 
    const item = waterModel.cachedPositions[i]
    waterModel.cachedPositions[i].top -= waterModel.cachedPositions[i - 1].bottom
    waterModel.cachedPositions[i].bottom = waterModel.cachedPositions[i].bottom - cumulativeDiffHeight

    if(item.dValue !== 0) {
      cumulativeDiffHeight += item.dValue
      item.dValue = 0
    }
  }

  const height = waterModel.cachedPositions[cachedPositionsLen - 1].bottom
  waterModel.phantomHeight = height
  phantomRef.value.style.height = `${height}px`

}

const waterListRef = ref(null)
const waterModel = reactive({
  list:[],
  cachedPositions:[]
  listHeight:0,
  height: 20,
  maxCount:0,
  startOffset:0,
  startIndex:0,
  endIndex:0,
  phantomHeight:0,

})

const waterScrollEvent = (e) => {
  const scrollTop = e.target.scrollTop || 0
  const startIndex = getStartIndex(scrollTop)
  const endIndex = Math.min(startIndex+20,waterModel.cachedPositions.length + 1)
  waterModel.list = waterModel.cachedPositions.slice(startIndex,endIndex)

}

const getStartIndex = (value) => {
  const list = waterModel.cachedPositions
  let left = 0,right = list.length -1,mid = -1
  while(left < right) { 
     mid = Math.floor((left + right) / 2)
    const midValue = list[mid].bottom
    if(midValue == value){
      return mid
    } else if (midValue < value) {
      left = mid + 1
    } else if (midValue > value) { 
      right = mid - 1
    }
  }
  const targetItem =list[mid]
  if(targetItem && targetItem.bottom < value) {
    mid += 1
  } 
  return mid
}

onMounted(()=>{
  waterModel.listHeight = waterListRef.value.offsetHeight
  waterModel.maxCount = Math.ceil(waterModel.listHeight / waterModel.height)
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
</style>


https://codesandbox.io/p/sandbox/a-v-list-has-dynamic-inner-height-yh0r7?file=%2Fsrc%2FVList.tsx%3A129%2C31
