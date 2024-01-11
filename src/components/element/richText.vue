<script>
import amEditor from './editor/AmEditor.vue'
export default {
  name: "richText",
  components: {
    amEditor
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  }
}
</script>

<template>
  <div class="rich-text">
    <am-editor v-model="options.richTextValue"></am-editor>
  </div>
</template>

<style scoped lang="scss">
.rich-text {
  background-color: #fff;
  padding: 5px;
}
</style>
