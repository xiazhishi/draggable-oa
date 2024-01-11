<template>
  <div class="cell" @click.stop="chooseElement"
       :style="{'margin-bottom': elementMargin + 'px'}">
    <div>
      <div v-if="data.options.showTitle" class="grey"
           :style="{backgroundColor: data.options.backgroundColor, color: data.options.color}">
        <span>{{ data.options.title }}</span>
        <i @click.stop="dialogVisible = true" class="el-icon-close"></i>
      </div>
      <div class="content"
           :style="{'height': data.options.isAutoHeight ? 'fit-content' : data.options.height + 'px',
            'overflow': data.options.overflowShow ? 'auto' : 'hidden'}">
        <rich-text v-if="data.type === 'richText'" :options="data.options"></rich-text>
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
