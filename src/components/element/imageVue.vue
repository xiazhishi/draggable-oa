<template>
  <div class="image">
    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F7ceceb56-7043-4e85-a7c2-ac39e3184f49%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1707293329&t=2cfc6278b65154b7f888f7e880e16bb6" alt="">
  </div>
</template>

<script>
export default {
  name: "imageVue"
}
</script>

<style scoped lang="scss">
.image {
  height: 300px;
  overflow: auto;
  width: 100%;
  &>img {
    width: 100%;
    object-fit: contain;
  }
}
</style>
