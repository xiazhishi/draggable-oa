<template>
  <div class="drag-area">
    <el-row>
      <el-col style="width: 319px;flex-shrink: 0;">
        <main-sidebar @set-color-to-all="setColorToAll" @clear="clear" />
      </el-col>
      <el-col
          style="flex: 1;border-left: 1px solid #ccc"
          id="form-center"
      >
        <div class="header">
          <div class="name"></div>
          <div class="groups">
            <el-button size="mini" @click="toPreview">预览</el-button>
            <el-button size="mini" @click="showDialog">元素边距</el-button>
            <el-button size="mini" @click="clearShow = true">清空布局</el-button>
          </div>
        </div>
        <main-content ref="panel" :local-list="localList"/>
      </el-col>
    </el-row>
    <el-dialog
        title="元素边距设置"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%">
      <span>
        <el-form label-width="100px">
          <el-form-item label="元素边距">
            <el-input v-model="elementMargin">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="changeMargin">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="确认信息"
        :visible.sync="clearShow"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%">
      <span>确认清空布局吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="clearShow = false">取 消</el-button>
          <el-button type="primary" @click.stop="clear">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import mainSidebar from './mainSidebar.vue'
import mainContent from './mainContent.vue'

export default {
  components: {
    mainSidebar,
    mainContent
  },
  data () {
    return {
      clearShow: false,
      localList: [],
      dialogVisible: false,
      tabIndex: '0',
      saveData: {
        code: '',
        content: '',
        name: '',
        remarks: ''
      },
      id: '',
      elementMargin: 0,
    }
  },
  methods: {
    setColorToAll ({backgroundColor, color}) {
      this.$refs.panel.setColorToAll({backgroundColor, color})
    },
    save () {
      localStorage.setItem('formList', JSON.stringify(this.$refs.panel.list))
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    },
    clear () {
      if (localStorage.getItem('formList')) {
        localStorage.removeItem('formList')
      }
      this.$refs.panel.clear()
      this.$message({
        message: '清除成功',
        type: 'success'
      });
      this.clearShow = false
    },
    showDialog () {
      this.elementMargin = this.$store.state.formDesign.elementMargin
      this.dialogVisible = true
    },
    changeMargin () {
      this.$store.commit('formDesign/updateElementMargin', this.elementMargin)
      this.dialogVisible = false
    },
    toPreview () {
      this.$refs.panel.viewPreview()
    }
  },
  mounted () {
    if (localStorage.getItem('formList')) {
      this.localList = JSON.parse(localStorage.getItem('formList'))
      console.log(this.localList)
    }
  },
  filters: {
    labelWidth (value) {
      return `${value}px`
    }
  }
}
</script>

<style lang="css" scoped>
.header {
  background-color: #FAFBFC;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  border-bottom: 1px solid #E4E7ED;
  border-right: 1px solid #efefef;
  height: 50px;
  &>.name {
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      margin-right: 3px;
    }
  }
}
.drag-area {
  height: 100%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  &>.el-row {
    flex: 1;
    display: flex;
    height: 100%;
  }
}
/deep/ .el-dialog {
  text-align: left;
  .el-dialog__header {
    font-size: 22px;
  }
  .el-dialog__body {
    font-size: 16px !important;
  }
}
</style>
