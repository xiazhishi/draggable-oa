<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="portalControl">
      <div class="tabs-content">
        <el-collapse :value="['1','2', '3']" style="width: 100%;">
          <el-collapse-item title="布局控件" name="3">
            <draggable
                :list="layout.child"
                :group="{ name: 'form-design', put: false, pull: 'clone' }"
                @change="log"
                class="drag"
                ghostClass="ghost"
                :move="move"
                @add="add1"
            >
              <div class="left-cell" v-for="(item, i) in layout.child" :key="i" :title="item.title">
                <i :class="item.icon"></i>
                <span class="right">{{item.title}}</span>
              </div>
            </draggable>
          </el-collapse-item>
          <el-collapse-item title="元素控件" name="1">
            <draggable
                :list="base.child"
                :group="{ name: 'form-design-inner', pull: 'clone', put: false }"
                :move="elementMove"
                class="drag"
            >
              <div class="left-cell" v-for="(item, i) in base.child" :key="i" :title="item.title">
                <i :class="item.icon"></i>
                <div class="right">{{item.title}}</div>
              </div>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-tab-pane>
    <el-tab-pane label="布局属性" name="layout">
      <div v-if="element && element.code === 'grid'">
        <div class="setting-content">
          <div class="title">列配置项（每行占比总和最多为24）</div>
          <div v-for="(item, i) in element.cols" :key="i" class="setting-line">
            <span class="index">第{{ i + 1 }}列</span>
            <el-input-number v-model="item.span" :min="1" :max="24" label="列占比" size="small"></el-input-number>
            <i v-if="element.cols.length < 4" class="el-icon-circle-plus" style="color: #17B3A3;" title="插入一列" @click="addOption(i)"></i>
            <i class="el-icon-circle-close" style="color: red;" @click="subOption(i)" title="删除一列"></i>
          </div>
        </div>
        <div class="click-content">
          <div class="title sec-title">一键设置布局比例</div>
          <thumbnail :cols="element.cols" @rectangle-click="rectangleClick"></thumbnail>
        </div>
      </div>
      <div v-else class="please-choose" style="text-align: center">
        请选择一个门户布局设置
      </div>
    </el-tab-pane>
    <el-tab-pane label="元素属性" name="element">
      <div v-if="element && element.code === 'element'" class="element-content">
        <el-form ref="form" :model="element.options" label-width="100px" label-position="left">
           <el-form-item label="标题">
              <el-input v-model="element.options.title" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="元素头">
              <el-checkbox v-model="element.options.hiddenTitle">隐藏</el-checkbox>
            </el-form-item>
          <el-form-item label="边框">
            <el-checkbox v-model="element.options.border">隐藏</el-checkbox>
          </el-form-item>
            <el-form-item label="主题背景色">
              <el-color-picker v-model="element.options.backgroundColor" :predefine="predefineColors" size="mini"></el-color-picker>
            </el-form-item>
            <el-form-item label="主题文字颜色">
              <el-color-picker v-model="element.options.color" :predefine="predefineColors" size="mini"></el-color-picker>
            </el-form-item>
            <el-form-item label="统一主题颜色">
              <el-checkbox v-model="changeColor" @change="isNeedChange">统一</el-checkbox>
            </el-form-item>
            <el-form-item v-if="element.type === 'image'" label="所属目录">
              <el-button @click="sourceVisible = true" size="mini">选择来源</el-button>
<!--              <el-upload-->
<!--                  class="upload-demo"-->
<!--                  action="/api/workspace/manager/information/peRecordClass/uploadImage"-->
<!--                  :headers="{-->
<!--                  'Cookie': 'SESSION=NzVmODFiMTYtYmM4Yi00Yjg3LThjODUtODdlMzE2ZTVjMjJh; Hm_lvt_620840815a0ae4e017d5820cf0050076=1703055573,1705037728; Hm_lpvt_620840815a0ae4e017d5820cf0050076=1705037728; sso_credentials=b345fe71960c94aed5604a27ef6a6307cc49b7ff; sso_principal=sjy'-->
<!--                  }"-->
<!--                  :on-success="UploadSuccess"-->
<!--                  multiple-->
<!--                  :limit="3">-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--              </el-upload>-->
            </el-form-item>
            <el-form-item v-if="element.type === 'echarts'" label="所属目录">
              <el-button @click="echartsVisible = true" size="mini">选择来源</el-button>
            </el-form-item>
            <el-form-item label="元素高度">
              <el-radio-group v-model="element.options.isAutoHeight">
                <el-radio :label="true">自动高度</el-radio>
                <el-radio :label="false">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-input v-if="!element.options.isAutoHeight" v-model="element.options.height" size="mini">
                <template slot="append">px</template>
              </el-input>
            </el-form-item>
            <el-form-item label="纵向滚动">
              <el-checkbox v-model="element.options.overflowShow">允许</el-checkbox>
            </el-form-item>
        </el-form>
      </div>
      <div v-else class="please-choose" style="text-align: center">请选择一个元素</div>
      <imgSource v-if="sourceVisible" v-model="sourceVisible" :list="element.options.sourceList" @confirm="changeImg"></imgSource>
      <echartsSource v-if="echartsVisible" v-model="echartsVisible" :obj="element.options.source" @confirm="changeEcharts"></echartsSource>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import draggable from 'vuedraggable'
import thumbnail from './thumbnail/thumbnail.vue'
import imgSource from './common/imgSource.vue'
import echartsSource from './common//echartsSource.vue'
import { v4 } from 'uuid'
export default {
  components: {
    draggable,
    thumbnail,
    imgSource,
    echartsSource
  },
  data () {
    return {
      changeColor: false,
      sourceVisible: false,
      echartsVisible: false,
      activeName: 'portalControl',
      element: null,
      base: {
        title: '元素控件',
        child: [
          {
            title: '富文本',
            type: 'richText',
            icon: 'el-icon-edit-outline',
            value: '',
            code: 'element',
            options: {
              title: '富文本',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              richTextValue: '',
              border: true
            },
            isChoose: false,
            key: v4()
          },
          {
            title: '指标',
            type: 'echarts',
            icon: 'el-icon-s-data',
            value: '',
            code: 'element',
            options: {
              title: '指标',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              source: {},
              border: true
            },
            key: v4()
          },
          {
            title: '图片',
            type: 'image',
            icon: 'el-icon-picture',
            value: '',
            code: 'element',
            options: {
              title: '图片',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              sourceList: [],
              border: true
            },
            key: v4()
          },
        ]
      },
      layout: {
        title: '布局控件',
        child: [
          {
            title: '一列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            cols: [
              {
                span: 24,
                list: []
              }
            ],
            code: 'grid',
            key: v4()
          },
          {
            title: '两列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            cols: [
              {
                span: 12,
                list: []
              },
              {
                span: 12,
                list: []
              }
            ],
            code: 'grid',
            key: v4()
          },
          {
            title: '三列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 8,
                list: []
              },
              {
                span: 8,
                list: []
              },
              {
                span: 8,
                list: []
              }
            ],
            key: v4()
          },
          {
            title: '四列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              }
            ],
            key: v4()
          }
        ],
        key: v4()
      },
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#c7158577',
        '#000000',
      ]
    }
  },
  methods: {
    log (e) {
      console.log(e, 'log')
      this.init()
    },
    add1 (e) {
      console.log(e, 'add')
    },
    elementMove (e) {
      if (e.related.className === 'left-cell') {
        return false
      }
    },
    init () {
      this.layout =  {
        title: '布局控件',
        child: [
          {
            title: '一列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 24,
                list: []
              }
            ],
            key: v4()
          },
          {
            title: '两列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 12,
                list: []
              },
              {
                span: 12,
                list: []
              }
            ],
            key: v4()
          },
          {
            title: '三列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 8,
                list: []
              },
              {
                span: 8,
                list: []
              },
              {
                span: 8,
                list: []
              }
            ],
            key: v4()
          },
          {
            title: '四列',
            type: 'grid',
            icon: 'el-icon-s-grid',
            code: 'grid',
            cols: [
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              },
              {
                span: 6,
                list: []
              }
            ],
            key: v4()
          }
        ],
        key: v4()
      }
      this.base = {
        title: '元素控件',
            child: [
          {
            title: '富文本',
            type: 'richText',
            icon: 'el-icon-edit-outline',
            value: '',
            code: 'element',
            options: {
              title: '富文本',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              richTextValue: '',
              border: true
            },
            isChoose: false,
            key: v4()
          },
          {
            title: '指标',
            type: 'echarts',
            icon: 'el-icon-s-data',
            value: '',
            code: 'element',
            options: {
              title: '指标',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              source: {},
              border: true
            },
            key: v4()
          },
          {
            title: '图片',
            type: 'image',
            icon: 'el-icon-picture',
            value: '',
            code: 'element',
            options: {
              title: '图片',
              hiddenTitle: true,
              backgroundColor: '#fff',
              color: '#333',
              height: 260,
              isAutoHeight: false,
              overflowShow: true,
              sourceList: [],
              border: true
            },
            key: v4()
          }
        ]
      }
    },
    move (e) {
      if (e.related.className === 'cell') {
        return true
      }
      if(e.related.className === 'left-cell'){
        return false
      }
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    subOption (index) {
      this.element.cols.splice(index, 1)
      this.element.cols.forEach((item) => {
        item.span = 24 / this.element.cols.length
      })
    },
    addOption (i) {
      this.element.cols.splice(i + 1, 0, {
        span: 6,
        list: []
      })
      this.element.cols.forEach((item) => {
        item.span = 24 / this.element.cols.length
      })
    },
    rectangleClick (data) {
      const dataLength = data.reduce((total, item) => {
        return total + item
      }, 0)
      this.element.cols.forEach((item, index) => {
        item.span = (data[index] / dataLength) * 24
      })
    },
    setColorToAll () {
      if (!this.element) return
      this.$emit('set-color-to-all', {
        backgroundColor: this.element.options.backgroundColor,
        color: this.element.options.color
      })
    },
    changeImg (arr) {
      this.element.options.sourceList = arr
    },
    changeEcharts (obj) {
      this.element.options.source = obj
    },
    isNeedChange (e) {
      if (e) {
        this.setColorToAll()
      }
    }
  },
  mounted () {
    // 选择元素控件
    this.$EventBus.$on("chooseElement", (data) => {
      this.element = data
      if (data.code === 'element') {
        this.activeName = 'element'
        this.changeColor = false
      }
    })
    // 选择布局控件
    this.$EventBus.$on("chooseGrid", (data) => {
      this.element = data
      this.activeName = 'layout'
    })
    // 添加控件之后，初始化控件key值
    this.$EventBus.$on('addCell', () => {
      this.init()
    })
    // 选中栅格布局之后，当布局内容发生变化时，更新数据
    this.$EventBus.$on('updateGrid', (data) => {
      this.element = data
    })
  },
  beforeDestroy () {
    this.$EventBus.$off("chooseElement")
    this.$EventBus.$off("chooseGrid")
    this.$EventBus.$off('addCell')
  }
}
</script>

<style lang="scss" scoped>
.drag {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;
  justify-content: left;
}
.left-cell {
  cursor: pointer;
  height: 30px;
  width: 129px;
  background-color: #E9EDF6;
  margin: 0 24px 10px 0;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: left;
  &:nth-of-type(2n) {
    margin-right: 0;
  }
  &:hover {
    background-color: #DCE7FE;
    outline: 1px dashed #4E89F8;
  }
  i {
    margin-right: 8px;
  }
}
.iconfont  {
  margin-left: 5px;
}
.ghost {
  //width: 98%;
  //height: 100px;
  //line-height: 100px;
  text-align: center;
  outline: 1px dashed #4E89F8;
  background-color: #DCE7FE;
}
/deep/ .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
/deep/ .el-collapse {
  border: none;
  padding: 5px;
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item__header {
    height: 40px !important;
    line-height: 40px !important;
  }
}
.setting-content,
.click-content{
  &>.title {
    padding-left: 15px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #666;
    text-align: left;
  }
  &>.sec-title {
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .setting-line {
    height: 32px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: center;
    &>.index {
      width: 80px;
      text-align: left;
      margin-right: 10px;
    }
    &>i {
      font-size: 20px;
      cursor: pointer;
    }
    .el-input-number {
      margin-right: 10px;
    }
    .el-icon-circle-close {
      margin-left: 6px;
    }
  }
}
.el-collapse {
  padding: 0;
}
.tabs-content {
  padding: 0 15px;
}
.element-content {
  padding: 0 12px;
  .set-button {
    margin-bottom: 27px;
    margin-top: -13px;
  }
  /deep/ .el-form-item {
    margin-bottom: 2px;
    .el-form-item__content {
      text-align: left;
      line-height: 34px;
      //display: flex;
      //height: 40px;
      //align-items: center;
      //flex-wrap: wrap;
    }
    .el-checkbox {
      margin-top: 3px;
    }
    .el-radio-group {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 13px;
      .el-radio {
        margin-right: 0px;
      }
    }
  }
  /deep/ .el-color-picker {
    position: relative;
    top: 6px;
  }
}
/deep/ .el-tabs__nav-wrap {
  &::after {
    height: 1px;
  }
}
/deep/ .el-tabs__nav-scroll {
  height: 50px;
  line-height: 50px;
}
</style>
