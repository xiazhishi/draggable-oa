<template>
  <div class="main">
    <draggable
          class="dragArea dragArea-empty"
          :list="list"
          :group="{ name: 'form-design'}"
          @change="log"
          animation="200"
          handle=".mover"
          ghostClass="ghost"
      >
        <Cell
            v-for="(item, i) in list"
            :key="i"
            :data="item"
            :index="i"
            :list="list"
            @choose-grid="chooseGrid"
            @delete-panel="deletePanel(i)"
            @syncList="syncList"
            @update="update"
            @add-grid="addGrid"
        />
        <el-empty v-if="!list.length" description="拖拽布局控件到这里"></el-empty>
      </draggable>
    <el-dialog
        title="预览"
        :visible.sync="previewVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        custom-class="preview-dialog"
        width="70%">
      <div>
        <preview v-if="previewVisible" :propsList="list"></preview>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cell from './Cell.vue'
import preview from '../pages/preview.vue'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { v4 } from 'uuid'

export default {
  props: {
    formAttr: {
      type: Object,
      default: function () {
        return {
          align: 'top',
          size: 'medium',
          labelWidth: 80
        }
      }
    },
    localList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    draggable,
    Cell,
    preview
  },
  data () {
    return {
      previewVisible: false,
      list: [],
      originList: []
    }
  },
  methods: {
    syncList (value) {
      this.list = cloneDeep(value)
    },
    log (e) {
      console.log(e, 'e')
      console.log(this.list, 'this.list')
      let newFormList = cloneDeep(this.list)
      this.originList = cloneDeep(this.list)
      this.syncList(newFormList)
      if (e.added) {
        this.$EventBus.$emit('addCell', e.added.element)
      }
      this.$forceUpdate()
    },
    // 添加栅格
    addGrid ({index, length}) {
      let grid = {
        title: '一列',
        type: 'grid',
        icon: 'el-icon-s-grid',
        cols: [],
        code: 'grid',
        key: v4()
      }
      for (let i = 0; i < length; i++) {
        grid.cols.push({
          span: 24 / length,
          list: []
        })
      }
      this.list.splice(index + 1, 0, grid)
      this.originList = cloneDeep(this.list)
    },
    deletePanel (i) {
      this.list.splice(i, 1)
      this.originList = cloneDeep(this.list)
    },
    update ({data, index}) {
      this.$set(this.list, index, data)
      this.originList = cloneDeep(this.list)
    },
    clear () {
      this.list = []
      this.originList = []
    },
    chooseGrid (data) {
      this.list.forEach(item => {
        if (item.key === data.key) {
          this.$store.commit('formDesign/updateGridKey', item.key)
        }
      })
      this.$EventBus.$emit('chooseGrid', data)
    },
    setColorToAll ({backgroundColor, color}) {
      this.list.forEach(item => {
        item.cols.forEach(ele => {
          ele.list.forEach(el => {
            this.$set(el.options, 'backgroundColor', backgroundColor)
            this.$set(el.options, 'color', color)
            // el.options.backgroundColor = backgroundColor
            // el.options.color = color
          })
        })
      })
    },
    viewPreview () {
      this.previewVisible = true
    }
  },
  filters: {
    labelWidth (value) {
      return `${value}px`
    }
  },
  watch: {
    localList: {
      handler: function (value) {
        if (value.length) {
          this.list = cloneDeep(value)
          this.originList = cloneDeep(value)
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.$EventBus.$on('chooseElement', () => {
      this.chooseGridKey = ''
    })
  },
  beforeDestroy () {
    this.$EventBus.$off('chooseElement')
  }
}
</script>

<style lang="css" scoped>
.main {
  width: 100%;
  height: calc(100% - 68px);
  min-height: 500px;
  overflow-y: auto;
}
.dragArea-empty {
  min-height: 100px;
  padding: 10px 10px 100px;
}
.dragArea {
  overflow: hidden;
}
.test {
  width: 100%;
  background-color: #6cf;
  height: 200px;
}
/deep/ .left-cell {
  width: 98%;
  height: 100px;
  outline: 2px dashed #4E89F8;
  margin: 10px auto;
  background-color: transparent;
  display: flex;
  justify-content: center;
}
/deep/ .preview-dialog {
  max-height: 80%;
  margin-top: 10vh;
  overflow: auto;
}
</style>
