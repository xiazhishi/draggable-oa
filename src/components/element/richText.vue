<script>
export default {
  name: "richText",
  data () {
    return {
      text: '<div><strong>小小竹排画中游，</strong><br><s>小竹排，顺水流，</s><br><span style="color:hsl(0,75%,60%);">鸟儿唱，鱼儿游，</span><br><span style="color:hsl(0,75%,60%);">两岸树木密，</span><br><span class="text-huge">禾苗绿油油，</span><br><span style="background-color:hsl(150,75%,60%);">江南鱼米乡，</span><br><u>小小竹排画中游。</u><img src="https://api.qrtool.cn/?text=https://txttool.cn/editor2img/" style="max-width:200px;" alt="工具二维码"></div>'
    }
  }
}
</script>

<template>
  <div class="rich-text" v-html="text"></div>
</template>

<style scoped lang="scss">
.rich-text {
  background-color: #fff;
  padding: 5px;
}
</style>
