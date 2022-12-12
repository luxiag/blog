<template>
  <div class="pdf-container">
    pdf
    <iframe style="width: 100%; height: 100%" :src="fileSrc"> </iframe>
  </div>
</template>

<script>
export default {
  props: {
    fileSrc: {
      type: "String",
    },
  },
  data() {},
  created() {},
};
</script>
<style lang="scss">
.pdf-container {
  width: 100%;
  height: 100%;
}
</style>
