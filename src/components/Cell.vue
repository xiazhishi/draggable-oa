<template>
    <div class="cell" :class="{'active': chooseGridKey === data.key}" @click="chooseGrid">
      <div class="mover" @click="chooseGrid">
        <i @click.stop="deletePanel" class="el-icon-circle-close"></i>
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
    chooseGridKey: {
      type: String,
      default: ''
    }
  },
  methods: {
    syncList (value) {
      this.$emit('syncList', value)
    },
    deletePanel () {
      console.log(this.data)
      this.$emit('delete-panel')
    },
    update (data) {
      this.$emit('update', {
        data: data,
        index: this.index
      })
      if (this.chooseGridKey === this.data.key) {
        this.$EventBus.$emit('update-grid', data)
      }
    },
    chooseGrid () {
      this.$emit('choose-grid', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }
}
.active {
  border: 1px solid #EB4969;
}
.el-form-item {
  margin-bottom: 0;
}
.action-copy {
  position: absolute;
  bottom: -15px;
  right: 60px;
  height: 30px;
  width: 30px;
  background-size: 18px 18px;
  background-color: #ecf5ff;
  border-color: #409eff;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #409eff;
  z-index: 1;
}
.action-copy:hover {
  background-color: #409eff;
}
.action-delete {
  position: absolute;
  bottom: -15px;
  right: 15px;
  height: 30px;
  width: 30px;
  background-size: 15px 15px;
  background-color: #fef0f0;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #f56c6c;
  z-index: 1;
}
.action-delete:hover {
  background-color: #f56c6c;
}
</style>
