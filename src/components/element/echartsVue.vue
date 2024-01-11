<template>
  <div class="box" ref="box" :class="{'default': options.isAutoHeight}"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "echartsVue",
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    initChart () {
      let myChart = echarts.getInstanceByDom(this.$refs.box)
      if (myChart !== null && myChart !== undefined) {
        myChart.dispose()
      }
      let newMyChart = echarts.init(this.$refs.box);
      let option = this.options.source.option
      newMyChart.setOption(option)
    }
  },
  data () {
    return {
      oldCode: ''
    }
  },
  watch: {
    options: {
      handler (val) {
        if (val.source.code && val.source.code !== this.oldCode) {
          this.oldCode = val.source.code
          this.initChart()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  }
}
</script>


<style scoped lang="scss">
.box {
  width: calc(100% - 2px);
  background-color: #fff;
  height: 100%;
}
.default {
  height: 300px !important;
}
</style>
