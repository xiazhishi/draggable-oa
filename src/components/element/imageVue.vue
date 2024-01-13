<template>
  <div v-if="options.sourceList.length" class="container">
    <div class="image">
      <div v-for="(item, index) in options.sourceList" :key="index">
        <div v-for="(ele, key) in item.url" :key="key">
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
  padding: 15px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-right: 10px;
  }
}
</style>
