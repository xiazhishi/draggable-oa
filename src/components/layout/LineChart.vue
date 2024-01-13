<template>
  <div class="line-chart">
    <div class="title">
      <div class="text">黑龙江:七台河市:GDP</div>
      <div class="setting no-drag">
        <el-dropdown @command="changeData">
          <span>修改数据</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>第二项</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="changeLegend">
          <span>修改图例位置</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="top">垂直上</el-dropdown-item>
            <el-dropdown-item command="bottom">垂直下</el-dropdown-item>
            <el-dropdown-item command="left">水平居左</el-dropdown-item>
            <el-dropdown-item command="center">水平居中</el-dropdown-item>
            <el-dropdown-item command="right">水平居右</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="el-icon-setting" @click="dialogVisible = true"></i>
        <i class="el-icon-delete" @click="handleDelete"></i>
      </div>
    </div>
    <e-chart-container class="no-drag" ref="chart" :options="options"></e-chart-container>
    <el-dialog
        title="修改大小"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="30%">
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="宽度">
            <el-input-number v-model="width" :min="1" :max="max"></el-input-number>
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number v-model="height" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="changeType">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import EChartContainer from './EChartContainer'
export default {
  name: 'lineChart',
  components: {EChartContainer},
  props: {
    item: {
      type: Object,
      required: true
    },
    layout: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      options: {
        legend: {
          data: ['Line 1'],
          left: 'center',
          top: 'top'
        },
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: '折线图',
              icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
              onclick: () => this.changeChartType('line')
            },
            myTool2: {
              show: true,
              title: '柱状图',
              icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
              onclick: () => this.changeChartType('bar')
            },
            myTool3: {
              show: true,
              title: '散点图',
              icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
              onclick: () => this.changeChartType('scatter')
            },
            dataView: {
              show: true
            },
            restore: {
              title: '还原'
            },
            saveAsImage: {
              title: '保存图片'
            }
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            startValue: 'Mon',
            height: 15,
            bottom: '2%'
          }
        ],
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Line 1',
            data: [-100, 186, 200, -260, 146, 125, 213],
            type: 'line',
            smooth: true,
            markLine: {
              // 基线公共样式
              lineStyle: {
                type: 'dashed',
              },
              label: {
                show: true,
                position: 'middle',
                formatter: '{b}{c}',
              },
              data: [
                {
                  // type: 'average',
                  yAxis: 100,
                  lineStyle: {
                    color: '#ff0000'
                  }
                },
                {
                  // type: 'average',
                  yAxis: 280,
                  lineStyle: {
                    color: 'orange'
                  }
                }
              ]
            }
          }
        ]
      },
      dialogVisible: false,
      width: 0,
      height: 0,
      beforeList: [],
      max: 6
    }
  },
  methods: {
    renderChart () {
      let chart = this.$refs.chart
      if (chart) {
        chart.setOption(this.options)
      }
    },
    handleDelete () {
      this.$emit('delItem', this.item)
    },
    changeData () {},
    changeLegend () {},
    changeType () {
      this.$emit('changeOrigin', {
        w: this.width,
        h: this.height
      }, this.item)
      this.dialogVisible = false
    },
    changeChartType (e) {
      this.options.series[0].type = e
    }
  },
  mounted () {
    this.width = this.item.w
    this.height = this.item.h
    let beforeList = []
    this.layout.forEach(item => {
      if (item.y === this.item.y && item.x < this.item.x) {
        beforeList.push(item)
      }
    })
    beforeList.forEach(item => {
      this.max = this.max - item.w
    })
    this.renderChart()
  },
  watch: {
    item: {
      handler: function () {
        let beforeList = []
        this.layout.forEach(item => {
          if (item.y === this.item.y && item.x < this.item.x) {
            beforeList.push(item)
          }
        })
        beforeList.forEach(item => {
          this.max = this.max - item.w
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.line-chart{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  &>.title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-delete {
      cursor: pointer;
      &:hover{
        color: #409EFF;
      }
    }
    &>.text{
      font-size: 16px;
      font-weight: 700;
      &>span {
        cursor: pointer;
      }
    }
    &>.setting{
      display: flex;
      align-items: center;
      &>.el-dropdown{
        margin-left: 10px;
        &>.el-icon-setting{
          font-size: 18px;
        }
        &:hover{
          cursor: pointer;
        }
      }
      &>i{
        margin-left: 10px;
        cursor: pointer;
        font-size: 17px;
      }
    }
  }
  .e-chart-container{
    flex: 1;
  }
}
</style>
