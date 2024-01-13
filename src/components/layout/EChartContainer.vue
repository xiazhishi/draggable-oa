<template>
  <div class="e-chart-container" ref="chart"></div>
</template>

<script>
import {debounce} from 'throttle-debounce'
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat'
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'

export default {
  name: 'EChartContainer',
  data () {
    return {
      chartEl: null,
      chart: null
    }
  },
  methods: {
    initEChart () {
      this.chartEl = this.$refs['chart']
      if (this.chartEl) {
        addResizeListener(this.chartEl, this.resizeHolder)
        this.chart = echarts.init(this.chartEl)
      }
    },
    destroyEChart () {
      if (this.chartEl) {
        removeResizeListener(this.chartEl, this.resizeHolder)
        this.chart && this.chart.dispose()
      }
    },
    setOption (option) {
      this.chart && this.chart.setOption(option)
    },
    /** 清除图表 */
    clear () {
      this.chart && this.chart.clear()
    },
    /** 下载图表 */
    getConnectedDataURL () {
      if (this.chart) {
        const downloadURL = this.chart.getConnectedDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        })
        return downloadURL
      }
    },
    /** 注册回归分析 */
    registerTransform () {
      echarts.registerTransform(ecStat.transform.regression)
    }
  },
  mounted () {
    this.resizeHolder = debounce(200, () => {
      this.chart && this.chart.resize()
    })
    this.initEChart()
  },
  destroyed () {
    this.destroyEChart()
  }
}
</script>

<style lang="scss">
.e-chart-container{
  height: 100%;
  width: 100%;
}
</style>
