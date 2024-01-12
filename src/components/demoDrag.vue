<template>
  <div class="demo-drag">
    <el-row>
      <el-col style="width: 319px;border-right: 1px solid #ccc;">
        <main-sidebar @set-color-to-all="setColorToAll" @clear="clear" />
      </el-col>
      <el-col
          style="height:100vh; width: calc(100% - 232px);"
          id="form-center"
      >
        <div class="header">
          <div class="name"></div>
          <div class="groups">
            <el-button size="mini" @click="toPreview">预览</el-button>
            <el-button size="mini" @click="showDialog">元素边距</el-button>
            <el-button size="mini" @click="clear">清空布局</el-button>
            <el-button size="mini" type="primary" @click="save">保存</el-button>
          </div>
        </div>
        <main-content ref="panel" :formAttr="formAttr" :local-list="localList"/>
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
  </div>
</template>

<script>
import mainSidebar from './main-sidebar.vue'
import mainContent from './main-content.vue'

export default {
  components: {
    mainSidebar,
    mainContent
  },
  data () {
    return {
      localList: [],
      visible: true,
      activeName: '2',
      formAttr: {
        align: 'left',
        size: 'medium',
        labelWidth: '80px',
        isTabs: false,
        tabType: 'card',
        tabs: [
          {
            name: 'tab1',
            formList: []
          }
        ]
      },
      dialogFormVisible: false,
      dialogVisible: false,
      tabIndex: '0',
      saveData: {
        code: '',
        content: '',
        name: '',
        remarks: ''
      },
      defaultValueList: [],
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
  border-bottom: 1px solid #efefef;
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
.demo-drag {
  height: 100%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  &>.el-row {
    flex: 1;
    display: flex;
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
