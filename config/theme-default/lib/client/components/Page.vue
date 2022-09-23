<script setup lang="ts">
import PageMeta from "@theme/PageMeta.vue";
import PageNav from "@theme/PageNav.vue";
</script>

<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <slot name="content-top" />

      <Content class="content" />

      <slot name="content-bottom" />
    </div>

    <PageMeta />

    <PageNav />

    <slot name="bottom" />
  </main>
</template>
<style>
.theme-default-content > div::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-repeat: no-repeat;
  background-image:
    /* 1. 这条渐变是比较明显的那道折痕 */ linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 0.3%,
      rgba(255, 255, 255, 0.09) 1.1%,
      transparent 1.3%
    ),
    /* 2. 这条一像素的渐变是封面最左侧的折痕（没有暗面） */
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.2) 0,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 0.5%
      );
  background-size: 50% 100%, 50% 100%;
  background-position: 0% top, 9% top;
}

.theme-default-content > div {
  position: relative;
  /* 由于阴影对视觉中心有影响，所以把书整体向右上方挪一些 */
  margin-top: -1vh;
  margin-right: -1vh;
  /* width: 32%; */
  /* max-width: 600px; */
  /* font-size: 0; */
  padding: 20px;
  padding-left: 50px;
  box-shadow: -55px 40px 30px 0 rgb(0 0 0 / 10%),
    -27px 25px 35px -5px rgb(0 0 0 / 20%), -10px 10px 15px 5px rgb(0 0 0 / 10%),
    -12px 12px 10px 0 rgb(0 0 0 / 20%), -7px 7px 8px 0 rgb(0 0 0 / 10%),
    -5px 5px 5px 0 rgb(0 0 0 / 20%), -2px 2px 3px 0 rgb(0 0 0 / 30%);
  filter: drop-shadow(-20px 20px 15px rgba(0, 0, 0, 0.65));
}
</style>
