<template>
  <ul class="vp-category-list">
    <!--  -->
    <li v-for="[category, { path, items }] in map" :class="['vp-category', getArrayClassForType(category), {
      active: page.path === path
    },]">
      <RouteLink :to="path" class="vp-category-link">
        <span class="name">
          {{ category }}
        </span>
        <span class="count">{{ items.length }}</span>
      </RouteLink>
    </li>
  </ul>
</template>

<script setup>
import { usePageData } from "vuepress/client";
import { useCategoryMap } from "@theme-hope/modules/blog/composables/index";
import { onMounted } from "vue";


const page = usePageData()
const categoryMap = useCategoryMap()

const map = Object.entries(categoryMap.value.map).sort(([, a], [, b]) => b.items.length - a.items.length)


const nums = [100, 200, 300, 400, 500, 600];
const colorVars = ['teal', 'blue', 'gold', 'red', 'green', 'pink', 'purple']
let colorClass = []
nums.forEach(num => {
  colorVars.forEach(color => {
    colorClass.push(`${color}-${num}`)
  })
})




const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

colorClass = shuffleArray(colorClass)
const getArrayClassForType = (category) => {

  const index = generateIndexFromHash(category, colorClass.length)
  console.log(index, 'index')
  const colorIndex = Math.floor(Math.random() * (colorClass.length - 1))
  const currentClass = colorClass[index]
  return currentClass
}


const cyrb53 = (content, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < content.length; i++) {
    ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const generateIndexFromHash = (content, total) =>
  cyrb53(content) % total;

const moveUpAnimation = () => {
  let items = document.getElementsByClassName("vp-category")




  for (let i = 0; i < items.length; i++) {


    items[i].onmouseover = function () {


      if (i == 0) {
        items[i].style = "--scale:1.9"
        items[i + 1].style = "--scale:1.6"
        items[i + 2].style = "--scale:1.3"
        for (let j = 0; j < items.length; j++) {
          if (j != i && j != i + 1 && j != i + 2) {
            items[j].style = "--scale:1"
          }
        }
      } else if (i == 1) {
        items[i - 1].style = "--scale:1.6"
        items[i].style = "--scale:1.9"
        items[i + 1].style = "--scale:1.6"
        items[i + 2].style = "--scale:1.3"
        for (let j = 0; j < items.length; j++) {
          if (j != i - 1 && j != i && j != i + 1 && j != i + 2) {
            items[j].style = "--scale:1"
          }
        }
      } else if (i == items.length - 1) {
        items[i - 2].style = "--scale:1.3"
        items[i - 1].style = "--scale:1.6"
        items[i].style = "--scale:1.9"
        for (let j = 0; j < items.length; j++) {
          if (j != i && j != i - 1 && j != i - 2) {
            items[j].style = "--scale:1"
          }
        }
      } else if (i == items.length - 2) {
        items[i - 2].style = "--scale:1.3"
        items[i - 1].style = "--scale:1.6"
        items[i].style = "--scale:1.9"
        items[i + 1].style = "--scale:1.6"
        for (let j = 0; j < items.length; j++) {
          if (j != i - 2 && j != i - 1 && j != i && j != i + 1) {
            items[j].style = "--scale:1"
          }
        }
      } else {
        items[i - 2].style = "--scale:1.3"
        items[i - 1].style = "--scale:1.6"
        items[i].style = "--scale:1.9"
        items[i + 1].style = "--scale:1.6"
        items[i + 2].style = "--scale:1.3"
        for (let j = 0; j < items.length; j++) {
          if (j != i - 2 && j != i - 1 && j != i && j != i + 1 && j != i + 2) {
            items[j].style = "--scale:1"
          }
        }
      }
    }
  }

  let container = document.querySelector(".vp-category-list")
  console.log(container, 'container')


  // let container = document.getE
  container.onmouseleave = function () {
    for (let h = 0; h < items.length; h++) {
      items[h].style = "--scale:1"
    }
  }
}

onMounted(() => {
  moveUpAnimation()
})

</script>
<style lang="scss" scoped>
@use "sass:color";
@use "sass:list";


.vp-category-list {
  position: relative;
  z-index: 2;

  padding-inline-start: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  list-style: none;
  padding-top: 20px;
  font-size: 14px;

  .vp-category {
    display: inline-block;
    vertical-align: middle;

    overflow: hidden;

    // margin: 0.3rem 0.6rem 0.8rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.25rem;
    // color: var(--grey-dark);
    box-shadow: 0 1px 4px 0 var(--card-shadow);

    word-break: break-word;

    cursor: pointer;
    --scale: 1;
    // margin-left: calc(0.6rem * var(--scale));
    // margin-right: calc(0.6rem * var(--scale));


    // calc((var(--scale) * 50px) - (50px / var(--scale)));
    // translateY(calc((10px / var(--scale)) - (var(--scale) * 10px)))
    // transform: scale(var(--scale));
    // transition: all 0.35s;
    // z-index: calc(var(--scale)*10);
    position: relative;




    &:hover {
      transform: translateY(-10px);
      transition: transform 0.35s;
    }

    @media (max-width: hope-config.$mobile) {
      font-size: 0.9rem;
    }

    a {
      color: inherit;
    }

    .count {
      display: inline-block;
      min-width: 1rem;
      height: 1.2rem;
      margin-inline-start: 0.2em;
      padding: 0 0.1rem;
      border-radius: 0.6rem;

      color: var(--white);
      font-size: 0.7rem;
      line-height: 1.2rem;
      text-align: center;
    }
  }
}
</style>
