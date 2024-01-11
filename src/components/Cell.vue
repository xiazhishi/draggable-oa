<template>
    <div class="cell" :class="{'active': chooseGridKey === data.key}" @click="chooseGrid">
      <div class="mover">
        <el-popover
            v-model="popoverShow"
            placement="bottom"
            title="插入"
            width="150"
            popper-class="add-group-popover"
            trigger="click">
          <i slot="reference" @click.stop class="el-icon-circle-plus-outline"></i>
          <div class="add-group">
            <div @click="addGrid(index, 1)"><i class="el-icon-s-grid"></i>一列布局行</div>
            <div @click="addGrid(index, 2)"><i class="el-icon-s-grid"></i>二列布局行</div>
            <div @click="addGrid(index, 3)"><i class="el-icon-s-grid"></i>三列布局行</div>
            <div @click="addGrid(index, 4)"><i class="el-icon-s-grid"></i>四列布局行</div>
          </div>
        </el-popover>
        <i @click.stop="dialogVisible = true" class="el-icon-circle-close"></i>
      </div>
      <div>
        <grid-panel
            :prop-data="data"
            :form-attr="formAttr"
            :prop-key="data.key"
            @syncList="syncList"
            @update="update"
        />
      </div>
      <el-dialog
          title="确认信息"
          :visible.sync="dialogVisible"
          :append-to-body="true"
          width="30%">
        <span>确定要删除该布局吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="deletePanel">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import GridPanel from './GridPanel'
export default {
  components: {
    GridPanel
  },
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
    data: {
      type: Object,
      default: function () {
        return {
          type: '',
          name: '',
          code: '',
          options: {
            width: '100%',
            defaultValue: '',
            required: false,
            dataType: 'string',
            placeholder: ''
          },
          key: '1556775967000_4898'
        }
      }
    },
    index: {
      type: Number
    },
  },
  data () {
    return {
      popoverShow: false,
      dialogVisible: false
    }
  },
  computed: {
    chooseGridKey () {
      return this.$store.state.formDesign.chooseGridKey
    }
  },
  methods: {
    syncList (value) {
      this.$emit('syncList', value)
    },
    deletePanel () {
      this.$emit('delete-panel')
      this.dialogVisible = false
    },
    update (data) {
      this.$emit('update', {
        data: data,
        index: this.index
      })
      if (this.chooseGridKey === this.data.key) {
        this.$EventBus.$emit('updateGrid', data)
      }
    },
    chooseGrid () {
      console.log('点击了chooseGrid', this.data)
      this.$emit('choose-grid', this.data)
    },
    addGrid (index, length) {
      this.$emit('add-grid', {index, length})
      this.popoverShow = false
    }
  }
}
</script>

<style>
.add-group-popover {
  padding: 0 !important;
  .el-popover__title {
    padding: 0 10px;
    height: 32px;
    font-size: 14px;
    font-weight: 550;
    line-height: 32px;
    background-color: #f3f3f3;
    text-align: center;
    color: #333;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-dialog {
  text-align: left;
  .el-dialog__body {
    font-size: 16px !important;
  }
}
.cell {
  background-color: #E9EDF6;
  cursor: auto;
  margin-bottom: 10px;
  border: 1px solid #fff;
  &:hover {
    border: 1px solid #4E89F8;
  }
  .mover {
    text-align: right;
    cursor: pointer;
    font-size: 20px;
    padding: 6px 16px;
    border-bottom: 1px solid #ccc;
    i {
      cursor: pointer;
    }
    .el-icon-circle-plus-outline {
      margin-right: 10px;
    }
  }
}
.active {
  border: 1px solid #EB4969;
}
.el-form-item {
  margin-bottom: 0;
}
.add-group {
  &>div {
    padding: 6px 16px;
    cursor: pointer;
    &:hover {
      background-color: #F1F1F1;
    }
    &> i {
      margin-right: 6px;
    }
  }
}
</style>
