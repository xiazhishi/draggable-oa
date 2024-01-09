<template>
  <div class="box" ref="box"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "echartsVue",
  props: {
    data: {
      type: Object,
      default: function () {
        return {
          type: '',
          name: '',
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            dataType: 'string',
            placeholder: ''
          },
          key: '1556775967000_4898'
        }
      }
    }
  },
  mounted() {
    // 初始化实例对象  echarts.init(dom容器);
    let myChart = echarts.init(this.$refs.box);
    let option = {
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      legend: {
        data: ["销量"]
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    myChart.setOption(option);
  }
}
</script>


<style scoped lang="scss">
.box {
  width: calc(100% - 2px);
  height: 300px;
  background-color: #fff;
}
</style>
