<template>
  <div class="cell" @click.stop="chooseElement">
    <div>
      <div class="grey">
        <span>{{ data.title }}</span>
        <i @click.stop="deleteItem" class="el-icon-close"></i>
      </div>
      <div class="content">
        <rich-text v-if="data.type === 'richText'"></rich-text>
        <echarts-vue v-if="data.type === 'echarts'" :data="data"></echarts-vue>
        <imageVue v-if="data.type === 'image'"></imageVue>
        <card v-if="data.type === 'card'"></card>
      </div>
    </div>
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
  methods: {
    deleteItem () {
      this.$emit('delete-item')
    },
    chooseElement () {
      this.$EventBus.$emit("chooseElement", this.data);
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  background-color: #E9EDF6;
  padding-bottom: 10px;
  position: relative;
  cursor: pointer;
  .grey {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    padding: 6px 16px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    i {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .content {
    overflow-x: auto;
    height: 300px;
    overflow-y: auto;
  }
}
.cell-active {
  background-color: #b3d8ff;
  border-left: 5px solid #409eff;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
