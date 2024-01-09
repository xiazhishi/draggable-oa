<template>
  <el-form label-position="top" label-width="80px"  size="mini">
    <el-form-item label="列配置项（每行占比总和最多为24）">
      <div v-for="(item, i) in data.cols" :key="i">
        <el-input-number v-model="item.span" :min="1" :max="24" label="列占比" size="small"></el-input-number>
        <i class="el-icon-circle-close" style="color: red;" @click="subOption(i)"></i>
      </div>
      <div style="width: 100%;">
        <i class="el-icon-circle-plus" style="color: #17B3A3;" title="增加选项" @click="addOption"></i>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { v4 } from 'uuid'
import {cloneDeep} from "lodash-es";

export default {
  props: {
    propData: {
      type: Object,
      default: function () {
        return {
          title: '栅格布局',
          type: 'grid',
          icon: '/static/img/form-design/grid.png',
          cols: [{
            span: 12,
            list: [
            ]
          }, {
            span: 12,
            list: []
          }],
          key: v4()
        }
      }
    }
  },
  data () {
    return {
      data: {
        title: '栅格布局',
        type: 'grid',
        icon: '/static/img/form-design/grid.png',
        cols: [{
          span: 12,
          list: [
          ]
        }, {
          span: 12,
          list: []
        }],
        key: v4()
      }
    }
  },
  methods: {
    addOption () {
      this.data.cols.push({
        span: 12,
        list: [
        ]
      })
      this.$emit('change-cell', this.data)
    },
    subOption (index) {
      this.data.cols.splice(index, 1)
      this.$emit('change-cell', this.data)
    }
  },
  watch: {
    propData: {
      handler: function (value) {
        this.data = cloneDeep(value)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
</style>
