<template>
  <div class="preview">
    <draggable
        :list="list"
        animation="200"
        :disabled="true"
    >
      <div v-for="(item, i) in list" :key="i">
        <el-row :gutter="10">
          <el-col :span="col.span" v-for="(col, i) in item.cols" :key="i" class="col">
            <draggable class="dragArea" :disabled="true" :class="{ 'empty-drag': !col.list.length }" :list="col.list" :group="{ name: 'form-design-inner'}" animation="200">
              <div class="cell" v-for="(ele, j) in col.list" :key="j" :style="{'margin-bottom': elementMargin + 'px',
              'border': !ele.options.border ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'}">
                <div>
                  <div v-if="!ele.options.hiddenTitle" class="grey"
                       :style="{backgroundColor: ele.options.backgroundColor, color: ele.options.color}">
                    <span>{{ ele.options.title }}</span>
                  </div>
                  <div class="content"
                       :style="{'height': ele.options.isAutoHeight ? 'fit-content' : ele.options.height + 'px',
                        'overflow': ele.options.overflowShow ? 'auto' : 'hidden'}">
                    <rich-text v-if="ele.type === 'richText'" :options="ele.options" :is-view="true"></rich-text>
                    <echarts-vue v-if="ele.type === 'echarts'" :options="ele.options"></echarts-vue>
                    <imageVue v-if="ele.type === 'image'" :options="ele.options"></imageVue>
                    <card v-if="ele.type === 'card'"></card>
                  </div>
                </div>
              </div>
              <div v-if="!col.list.length" class="empty" @click.stop>
                <span></span>
              </div>
            </draggable>
          </el-col>
        </el-row>
      </div>
      <el-empty v-if="!list.length" description="拖拽布局控件到这里"></el-empty>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import richText from "@/components/element/richText.vue";
import echartsVue from "@/components/element/echartsVue.vue";
import imageVue from "@/components/element/imageVue.vue";
import card from"@/components/element/card.vue";
import {cloneDeep} from "lodash-es";

export default {
  name: "previewVue",
  components: {richText, echartsVue, imageVue, card, draggable},
  data () {
    return {
      list: [],
      test: ''
    }
  },
  props: {
    propsList: {
      type: Array,
      default: () => {}
    }
  },
  computed: {
    elementMargin () {
      return this.$store.state.formDesign.elementMargin
    }
  },
  created () {
    if (localStorage.getItem('formList')) {
      this.list = JSON.parse(localStorage.getItem('formList'))
    } else {
      this.list = []
    }
    if (this.propsList && this.propsList.length) {
      this.list = cloneDeep(this.propsList)
    }
  }
}
</script>

<style scoped lang="scss">
.cell {
  background-color: #E9EDF6;
  position: relative;
  //border: 1px solid rgba(0, 0, 0, 0.1);
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
</style>
