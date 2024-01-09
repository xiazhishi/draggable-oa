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
            :data="item"
            :choose-grid-key="chooseGridKey"
            v-for="(item, i) in list"
            :key="i"
            :formAttr="formAttr"
            :index="i"
            @choose-grid="chooseGrid"
            @delete-panel="deletePanel(i)"
            @syncList="syncList"
            @update="update"
        />
        <el-empty v-if="!list.length" description="拖拽布局控件到这里"></el-empty>
      </draggable>
  </div>
</template>

<script>
import Cell from './Cell.vue'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'

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
    Cell
  },
  data () {
    return {
      list: [],
      originList: [],
      chooseGridKey: ''
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
      // let form
      // if (e.moved) {
      //   form = e.moved.element
      //   // eslint-disable-next-line no-unused-vars
      //   let newIndex = e.moved.newIndex
      //   // eslint-disable-next-line no-unused-vars
      //   let oldIndex = e.moved.oldIndex
      //   newFormList[newIndex] = form
      //   newFormList[oldIndex] = this.originList[newIndex]
      //   this.syncList(newFormList)
      // }
      this.originList = cloneDeep(this.list)
      this.syncList(newFormList)
      if (e.added) {
        this.$EventBus.$emit('addCell', e.added.element)
      }
      this.$forceUpdate()
    },
    deletePanel (i) {
      this.list.splice(i, 1)
      this.originList = cloneDeep(this.list)
    },
    update ({data, index}) {
      this.list[index] = data
      this.originList = cloneDeep(this.list)
    },
    updateGrid (val) {
      this.list[0] = val
      this.originList = cloneDeep(this.list)
      this.$forceUpdate()
    },
    clear () {
      this.list = []
      this.originList = []
    },
    chooseGrid (data) {
      this.list.forEach(item => {
        if (item.key === data.key) {
          this.chooseGridKey = item.key
        }
      })
      this.$EventBus.$emit('chooseGrid', data)
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
  }
}
</script>

<style lang="css" scoped>
.main {
  width: 100%;
  height: 100%;
  min-height: 500px;
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
  width: 100%;
  height: 100px;
  outline: 2px dashed #4E89F8;
  //margin: 20px auto;
  background-color: transparent;
}
</style>
