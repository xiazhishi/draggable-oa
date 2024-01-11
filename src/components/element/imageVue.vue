<template>
  <div v-if="options.sourceList.length" class="container">
    <div class="image">
      <div v-for="(item, index) in options.sourceList" :key="index">
        <div v-for="(ele, key) in item" :key="key">
          <img :src="ele" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "imageVue",
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">
.image {
  width: 100%;
  &>img {
    width: 100%;
    object-fit: contain;
  }
}
</style>
