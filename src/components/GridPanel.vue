<template>
  <el-row :gutter="10">
    <el-col :span="col.span" v-for="(col, i) in data.cols" :key="i" class="col">
      <draggable class="dragArea" :disabled="disabled"
                 :class="{ 'empty-drag': !col.list.length }"
                 :list="col.list" :group="{ name: 'form-design-inner'}" animation="200"
                 @change="log">
        <GridCell
            :data="item"
            v-for="(item, j) in col.list"
            :key="j"
            :prop-key="propKey"
            :prop-index="i"
            @syncList="syncList"
            @changeDisabled="changeDisabled"
            @delete-item="deleteItem(col, j)"
        />
        <div v-if="!col.list.length" class="empty" @click.stop>
          <span>拖拽元素控件到虚线框内</span>
        </div>
      </draggable>
    </el-col>
  </el-row>
</template>

<script>
import draggable from 'vuedraggable'
import {cloneDeep} from 'lodash-es'
import GridCell from './GridCell.vue'
import { v4 } from 'uuid'

export default {
  components: {
    draggable,
    GridCell
  },
  props: {
    propKey: {
      type: String,
      default: ''
    },
    propData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      data: {},
      disabled: false
    }
  },
  methods: {
    log: function (evt) {
      console.log('FDGridPanel')
      window.console.log(evt)
      // 处理从外部拖进栅格的表单元素
      this.$emit('update', this.data)
      this.$EventBus.$emit('addCell')
    },
    syncList (value, index) {
      let formList = cloneDeep(this.data)
      // for (let i = 0; i < this.$store.state.formDesign.formList.length; i++) {
      //   const element = this.$store.state.formDesign.formList[i]
      //   if (element.key === this.FDkey) {
      //     formList[i] = this.data
      //   }
      // }
      console.log('formList', formList)
      this.$emit('syncList', formList)
    },
    deleteItem (item, j) {
      item.list.splice(j, 1)
      this.$emit('update', this.data)
    },
    update (val) {
      this.data = val
    },
    changeDisabled (boo) {
      this.disabled = boo
    }
  },
  watch: {
    propData: {
      handler: function (value) {
        this.data = value
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.data = this.propData
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
}
.el-row {
  padding: 8px;
}
.col {
  min-height: 60px;
  height: fit-content;
}
.empty-drag {
}
.bottom-area {
  width: 100%;
  height: 25px;
}
.dragArea {
  outline: 1px dashed;
  min-height: 200px;
  cursor: auto;
  position: relative;
  padding: 10px 10px 10px 10px;
  margin-bottom: 10px;
  .empty {
    text-align: center;
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    &>span {
      color: #ccc;
      font-size: 24px;
    }
  }
}
</style>
