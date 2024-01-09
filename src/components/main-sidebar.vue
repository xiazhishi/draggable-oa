<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="portalControl">
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
            <div class="left-cell" v-for="(item, i) in layout.child" :key="i">
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
            <div class="left-cell" v-for="(item, i) in base.child" :key="i">
              <p class="left">
                <i :class="item.icon"></i>
              </p>
              <p class="right">{{item.title}}</p>
            </div>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="布局属性" name="layout">
      <span v-if="element && element.code === 'grid'">
        <div class="setting-content">
          <div class="title">列配置项（每行占比总和最多为24）</div>
          <div v-for="(item, i) in element.cols" :key="i" class="setting-line">
            <span class="index">第{{ i + 1 }}列</span>
            <el-input-number v-model="item.span" :min="1" :max="24" label="列占比" size="small"></el-input-number>
            <i class="el-icon-circle-close" style="color: red;" @click="subOption(i)"></i>
            <i v-if="element.cols.length < 4" class="el-icon-circle-plus" style="color: #17B3A3;" title="增加选项" @click="addOption"></i>
          </div>
        </div>
      </span>
      <span v-else>
        请选择一个门户布局设置
      </span>
    </el-tab-pane>
    <el-tab-pane label="元素属性" name="element">
      <span v-if="element && element.code === 'element'">选中的元素：{{element.title}}</span>
      <span v-else>请选择元素</span>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import draggable from 'vuedraggable'
import { v4 } from 'uuid'
export default {
  components: {
    draggable
  },
  data () {
    return {
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
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              dataType: 'string',
              placeholder: '',
              regEx: '',
              maxlength: 30
            },
            key: v4()
          },
          {
            title: '图表',
            type: 'echarts',
            icon: 'el-icon-s-data',
            value: '',
            code: 'element',
            options: {
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              placeholder: '',
              regEx: '',
              maxlength: 100
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
              width: '120px',
              min: 0,
              max: 100,
              required: false,
              disabled: false
            },
            key: v4()
          },
          {
            title: '卡片',
            type: 'card',
            icon: 'el-icon-bank-card',
            value: '',
            code: 'element',
            options: {
              width: '120px',
              min: 0,
              max: 100,
              required: false,
              disabled: false
            },
            key: v4()
          }
        ]
      },
      senior: {
        title: '高级字段',
        child: [
          {
            title: '意见框',
            type: 'idea',
            code: '',
            icon: 'duohangwenben',
            options: {
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              placeholder: '',
              regEx: '',
              maxlength: 300
            }
          }
        ],
        key: v4()
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
      elseItem: {
        title: '其它字段',
        child: [{
          title: '表单标题',
          type: 'title',
          icon: 'biaoti',
          value: '标题',
          options: {
            align: 'center',
            fontSize: '18px'
          },
          key: ''
        }],
        key: ''
      }
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
            code: '',
            options: {
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              dataType: 'string',
              placeholder: '',
              regEx: '',
              maxlength: 30
            },
            key: v4()
          },
          {
            title: '图表',
            type: 'echarts',
            icon: 'el-icon-s-data',
            value: '',
            code: '',
            options: {
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              placeholder: '',
              regEx: '',
              maxlength: 100
            },
            key: v4()
          },
          {
            title: '图片',
            type: 'image',
            icon: 'el-icon-picture',
            value: '',
            code: '',
            options: {
              width: '120px',
              min: 0,
              max: 100,
              required: false,
              disabled: false
            },
            key: v4()
          },
          {
            title: '卡片',
            type: 'card',
            icon: 'el-icon-bank-card',
            value: '',
            code: '',
            options: {
              width: '120px',
              min: 0,
              max: 100,
              required: false,
              disabled: false
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
    setSecondRatio (first, second) {
      const firstRate = first / (first + second)
      const secondRate = second / (first + second)
      this.element.cols[0].span = 24 * firstRate
      this.element.cols[1].span = 24 * secondRate
      console.log(this.element, '修改后的element')
      this.$emit('setSecondRatio', this.element)
    },
    subOption (index) {
      this.element.cols.splice(index, 1)
    },
    addOption () {
      this.element.cols.push({
        span: 6,
        list: [
        ]
      })
    },
  },
  mounted () {
    // 选择元素控件
    this.$EventBus.$on("chooseElement", (data) => {
      this.element = data
      if (data.code === 'element') {
        this.activeName = 'element'
      }
    })
    // 选择布局控件
    this.$EventBus.$on("chooseGrid", (data) => {
      this.element = data
      this.activeName = 'layout'
      console.log(data)
    })
    // 添加控件之后，初始化控件key值
    this.$EventBus.$on('addCell', () => {
      this.init()
    })
    // 选中栅格布局之后，当布局内容发生变化时，更新数据
    this.$EventBus.$on('update-grid', (data) => {
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

<style scoped>
.drag {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;
  justify-content: space-around;
}
.left-cell {
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  width: 100px;
  background-color: #ecf5ff;
  margin: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #DCE7FE;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 1px dashed #4E89F8;
  }
  i {
    margin-right: 5px;
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
  display: flex;
  justify-content: center;
  align-items: center;
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
}
.setting-content {
  padding: 0 15px;
  &>.title {
    margin-bottom: 10px;
  }
  .setting-line {
    height: 32px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-size: 14px;
    &>.index {
      width: 80px;
      text-align: left;
      margin-right: 10px;
    }
    &>i {
      font-size: 20px;
    }
    .el-input-number {
      margin-right: 10px;
    }
    .el-icon-circle-close {
      margin-right: 6px;
    }
  }
}
</style>
