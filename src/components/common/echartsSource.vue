<template>
  <el-dialog
      :visible.sync="value"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="30%">
    <div slot="title" class="self-title">
      <span>搜索图表</span>
      <i class="el-icon-close" @click="cancel"></i>
    </div>
    <div class="list">
      <div class="main">
        <el-select v-model="choose" placeholder="选择图表" filterable>
          <el-option
              v-for="item in echartsSrcList"
              :key="item.code"
              :label="item.option.title.text"
              :value="item.code">
          </el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button @click.stop="cancel">取 消</el-button>
          <el-button type="primary" @click.stop="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "imgSource",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      echartsSrcList: [{
        code:'test',
        option: {
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
        }
      }, {
        code: 'zhexian',
        option: {
          title: {
            text: "折线图"
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        }
      }],
      text: '',
      choose: ''
    }
  },
  methods: {
    cancel () {
      this.$emit('input', false)
    },
    confirm () {
      const obj = {}
      this.echartsSrcList.forEach(item => {
        if (item.code === this.choose) {
          obj.code = item.code
          obj.option = item.option
        }
      })
      this.$emit('confirm', obj)
      this.$emit('input', false)
    }
  },
  mounted () {
    this.choose = []
    if (this.obj.code) {
      this.choose = this.obj.code
    }
  }
}
</script>

<style scoped lang="scss">
.list {}
/deep/ .el-dialog__header {
  padding: 0;
  .self-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333;
    padding: 0 20px;
    height: 50px;
    border-bottom: 1px solid #ebeef5;
    .el-icon-close {
      font-size: 20px;
      color: #909399;
      cursor: pointer;
    }
  }
}
</style>
