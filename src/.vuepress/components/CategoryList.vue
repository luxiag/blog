<template>
  <ul class="vp-category-list">
    <!--  -->
    <li :class="{'vp-category':true,active: path === page.path}" v-for="[category, { path, items }] in map">
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

const moveUpAnimation = () => {
  let items = document.getElementsByClassName("vp-category")
  const nums = [ 100, 200, 300, 400, 500, 600, 700, 800,900, '000'];
  const colorVars = ['teal', 'blue', 'gold', 'red', 'green', 'pink', 'purple']
  const colorClass = []
  nums.forEach(num => {
    colorVars.forEach(color => {
      colorClass.push(`${color}-${num}`)
    })
  })
 


  for (let i = 0; i < items.length; i++) {
    items[i].onmouseover = function () {
      const colorIndex = Math.floor(Math.random() * (colorClass.length - 1))
      items[i].classList.add(colorClass[colorIndex])

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

  let container = document.getElementById("vp-category-list")
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

  list-style: none;

  font-size: 14px;

  .vp-category {
    display: inline-block;
    vertical-align: middle;

    overflow: hidden;

    margin: 0.3rem 0.6rem 0.8rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.25rem;

    color: var(--grey-dark);
    box-shadow: 0 1px 4px 0 var(--card-shadow);

    word-break: break-word;

    cursor: pointer;
    --scale: 1;

    transform: scale(var(--scale));
    transform: all 0.35s;



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
