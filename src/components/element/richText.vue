<script>
import amEditor from './editor/AmEditor.vue'
import AmView from "./editor/AmView.vue";
export default {
  name: "richText",
  components: {
    amEditor,
    AmView
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    input (boo) {
      this.$emit('input', boo)
    }
  },
  data () {
    return {}
  }
}
</script>

<template>
  <div class="rich-text" :class="[options.isAutoHeight ? 'default' : 'set']" @mouseenter.stop="input(true)" @mouseleave.stop="input(false)">
    <am-editor v-if="!isView" v-model="options.richTextValue" :editorHeight="219" :border="false"></am-editor>
    <div v-else v-html="options.richTextValue" class="view"></div>
  </div>
</template>

<style scoped lang="scss">
.default {
  height: 260px;
}
.set {
  height: 100%;
}
.rich-text {
  background-color: #fff;
  text-align: left;
  overflow: auto;
  &>.view {
    padding: 15px;
  }
}
</style>
