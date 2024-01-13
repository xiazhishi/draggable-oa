<template>
  <div class="cell" @click.stop="chooseElement"
       :style="{'margin-bottom': elementMargin + 'px',
       'border': !data.options.border ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'}"
        :class="{'more-left': data.options.hiddenTitle && data.type === 'richText'}">
    <div>
      <div v-if="!data.options.hiddenTitle" class="grey"
           :style="{backgroundColor: data.options.backgroundColor, color: data.options.color}" @mouseenter="canMove">
        <span>{{ data.options.title }}</span>
      </div>
      <div class="always-close" :class="{ 'back-trans': data.key === chooseElementKey}" :style="{color: data.options.color}">
        <i @click.stop="dialogVisible = true" class="el-icon-close"></i>
      </div>
      <div class="content"
           :style="{'height': data.options.isAutoHeight ? 'fit-content' : data.options.height + 'px',
            'overflow': data.options.overflowShow ? 'auto' : 'hidden'}" @mouseenter="canMove">
        <rich-text v-if="data.type === 'richText'" :options="data.options" @input="input"></rich-text>
        <echarts-vue v-if="data.type === 'echarts'" :options="data.options"></echarts-vue>
        <imageVue v-if="data.type === 'image'" :options="data.options"></imageVue>
        <card v-if="data.type === 'card'"></card>
      </div>
    </div>
    <el-dialog
        title="确认信息"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="30%">
      <span>确定要移除该元素吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="deleteItem">确 定</el-button>
        </span>
    </el-dialog>
    <div v-if="data.key === chooseElementKey" class="active"></div>
  </div>
</template>

<script>
import imageVue from './element/imageVue.vue'
import echartsVue from './element/echartsVue.vue'
import richText from './element/richText.vue'
import card from './element/card.vue'
export default {
  components: {
    card,
    richText,
    echartsVue,
    imageVue
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {
          type: '',
          name: '',
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
    propKey: {
      type: String,
      default: ''
    },
    propIndex: {
      type: Number
    }
  },
  computed: {
    chooseElementKey () {
      return this.$store.state.formDesign.chooseElementKey
    },
    elementMargin () {
      return this.$store.state.formDesign.elementMargin
    }
  },
  methods: {
    deleteItem () {
      this.$emit('delete-item')
      if (this.data.key === this.chooseElementKey) {
        this.$store.commit('formDesign/updateElementKey', '')
        this.$EventBus.$emit("chooseElement", null)
      }
      this.dialogVisible = false
    },
    chooseElement () {
      this.$store.commit('formDesign/updateElementKey', this.data.key);
      this.$EventBus.$emit("chooseElement", this.data);
    },
    canMove () {
      this.$emit('changeDisabled', false)
    },
    input (boo) {
      this.$emit('changeDisabled', boo)
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  background-color: #E9EDF6;
  position: relative;
  cursor: pointer;
  .always-close {
    position: absolute;
    right: 11px;
    top: 7px;
    font-size: 20px;
    width: 26px;
    height: 26px;
    display: flex;
    //background: #fff;
    z-index: 1;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  }
  .back-trans {
    background: rgba(255, 255, 255, 0.6);
  }
  .grey {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    height: 40px;
    border-bottom: 1px solid #ccc;
    i {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .content {
    overflow-x: auto;
    overflow-y: auto;
    background-color: #fff;
  }
  .active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid #409eff;
    box-sizing: border-box;
    pointer-events: none;
    background: rgba(0,0,0,.1);
  }
  /deep/ .toolbar-wrapper {
    .popover {
      background-color: transparent;
    }
  }
}
.more-left {
  /deep/ .toolbar-wrapper {
    padding-right: 35px;
  }
}
.el-form-item {
  margin-bottom: 0;
}
/deep/ .el-dialog {
  text-align: left;
  .el-dialog__body {
    font-size: 16px !important;
  }
}
</style>
