<template>
  <div class="demo-drag">
    <div class="header">
      <div class="name">
        <i class="el-icon-setting"></i>
        <span>测试门户</span>
      </div>
      <div class="groups">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="clear">清空布局</el-button>
      </div>
    </div>
    <el-row>
      <el-col style="width: 319px;border-right: 1px solid #ccc;">
        <main-sidebar @setSecondRatio="setSecondRatio" @clear="clear" />
      </el-col>
      <el-col
          style="height:calc(100vh - 66px); width: calc(100% - 232px);overflow-y: auto;"
          id="form-center"
      >
        <main-content ref="panel" :formAttr="formAttr" :local-list="localList"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mainSidebar from './main-sidebar.vue'
import mainContent from './main-content.vue'

export default {
  components: {
    mainSidebar,
    mainContent,
    // FDGrid
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
      dialogVisible_newVersion: false,
      tabIndex: '0',
      saveData: {
        code: '',
        content: '',
        name: '',
        remarks: ''
      },
      dataForm: {
        name: '',
        code: ''
      },
      defaultValueList: [],
      id: ''
    }
  },
  methods: {
    changeCell (value) {
      console.log(value)
      this.$refs.panel.updateGrid(value)
    },
    setSecondRatio (value) {
      console.log(value)
      // this.$refs.panel.setSecondRatio(value)
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
    }
  },
  mounted () {
    // this.reset()
    // this.init()
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
.form-design .el-tabs__nav {
  width: 100%;
}
.form-design .el-tabs__nav .el-tabs__active-bar {
  width: 50%;
  transform: translateX(0px);
}
.form-design .el-tabs__nav .el-tabs__item {
  width: 50%;
  text-align: center;
}
.form-design .el-tabs__header {
  width: 232px;
  height: 40px;
  z-index: 1;
  background-color: #fff;
}
.form-design .el-tabs__content {
  position: relative;
  top: 55px;
}
.form-design .el-form-item__label {
  line-height: 20px;
}
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
  display: flex;
  flex-direction: column;
  &>.el-row {
    flex: 1;
    display: flex;
  }
}
</style>
