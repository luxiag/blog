

<div class="list" ref="fixedListRef" @scroll="fixedScrollEvent">

  <div class="list-containter" :style="{transform: `translate3d(0,${fixedModel.startOffset}px,0)`}">
    <div class="fixed-list-item" v-for="ite in fixedModel.list" :key="ite.id">
     {{ite.name}}
    </div>
  </div>
  <div class="list-place"></div>
</div>

<script setup>
import { reactive,ref } from 'vue'

// 固定
const fixedListRef = ref(null)
const allList = new Array(10000).fill(0).map((item, index) => ({ id: index, name: `第${index}个元素` }))
const fixedModel = reactive({
  list:[],
  height: '20px',
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
