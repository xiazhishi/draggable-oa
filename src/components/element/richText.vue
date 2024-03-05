<template>
  <div class="rich-text" ref="richText" :class="[options.isAutoHeight ? 'default' : 'set']"
       @mouseenter="input(true)" @mouseleave="input(false)">
    <div v-html="options.richTextValue" class="view" :style="{'overflow': options.overflowShow ? 'auto' : 'hidden'}"></div>
  </div>
</template>

<script>
export default {
  name: "richText",
  components: {
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
    return {
      editorHeight: 212,
      isChange: true
    }
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.default {
  overflow: visible;
  /deep/ .editor-content {
    overflow: visible !important;
    height: fit-content !important;
  }
}
.set {
  height: 100%;
  overflow: auto;
}
.rich-text {
  background-color: #fff;
  text-align: left;
  &>.view {
    height: 100%;
    padding: 15px;
  }
}
</style>
