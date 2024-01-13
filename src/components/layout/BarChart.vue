<template>
  <div class="bar-chart">
    <div class="title">
      <div class="text">房地产竣工面积</div>
      <i class="el-icon-setting" @click="dialogVisible = true"></i>
      <i class="el-icon-delete" @click="deleteEcharts"></i>
    </div>
    <e-chart-container ref="chart"></e-chart-container>
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
  name: 'BarChart',
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
      dialogVisible: false,
      width: 0,
      height: 0,
      max: 6
    }
  },
  methods: {
    renderChart () {
      let chart = this.$refs.chart
      if (chart) {
        chart.setOption({
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
            }
          ]
        })
      }
    },
    changeType () {
      this.$emit('changeOrigin', {
        w: this.width,
        h: this.height
      }, this.item)
      this.dialogVisible = false
    },
    deleteEcharts () {
      this.$emit('delItem', this.item)
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
.bar-chart{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  &>.title{
    display: flex;
    justify-content: space-between;
    .el-icon-delete {
      cursor: pointer;
      &:hover{
        color: #409EFF;
      }
    }
    &>.text{
      font-size: 16px;
      font-weight: 700;
    }
    .el-icon-setting {
      cursor: pointer;
      font-size: 18px;
    }
    &>.el-dropdown{
      &>.el-icon-setting{
        font-size: 18px;
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
  .e-chart-container{
    flex: 1;
  }
}
</style>
