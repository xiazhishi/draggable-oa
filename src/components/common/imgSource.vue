<template>
  <el-dialog
      :visible.sync="value"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="30%">
    <div slot="title" class="self-title">
      <span>搜索相册</span>
      <i class="el-icon-close" @click="cancel"></i>
    </div>
    <div class="list">
      <div class="main">
        <el-select v-model="choose" placeholder="选择相册" multiple filterable>
          <el-option
              v-for="item in imgSrcList"
              :key="item.code"
              :label="item.title"
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
import table from '../../assets/table.png'
import logo from '../../assets/logo.png'
export default {
  name: "imgSource",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      table,
      logo,
      imgSrcList: [{
        code: 'banner',
        title: '首页banner相册',
        url: [table]
      }, {
        code: 'logo',
        title: '首页logo相册',
        url: [logo]
      }],
      text: '',
      choose: []
    }
  },
  methods: {
    cancel () {
      this.$emit('input', false)
    },
    confirm () {
      const arr = []
      this.choose.forEach(item => {
        this.imgSrcList.forEach(img => {
          if (item === img.code) {
            arr.push(img)
          }
        })
      })
      this.$emit('confirm', arr)
      this.$emit('input', false)
    }
  },
  mounted () {
    if (this.list.length) {
      this.choose = this.list.map(item => item.code)
    }
  }
}
</script>

<style scoped lang="scss">
.list {
}
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
