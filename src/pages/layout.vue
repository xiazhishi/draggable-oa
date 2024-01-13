<template>
  <div class="page-home-dashboard">
    <el-button >添加消息说明</el-button>
    <el-button >添加观点说明</el-button>
    <seasonButton @add-season="addSeason"></seasonButton>
    <el-button >添加仪表板</el-button>
    <el-button @click="dialogVisible = true">添加图表</el-button>
    <season-bar v-if="seasonList.length" :list="seasonList"></season-bar>
    <grid-layout :layout="layout"
                 ref="gridlayout"
                 :auto-position="true"
                 :isResizable="false"
                 :colNum="colNum">
      <grid-item v-for="item in layout"
                 drag-ignore-from=".no-drag"
                 :key="item.i"
                 :isDraggable="item.disabled ? false : true"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :x="item.x">
        <component :is="currentComponent(item.type)"
                   :item="item"
                   :layout="layout"
                   @add="dialogVisible = true"
                   @delItem="delItem"
                   @changeOrigin="changeOrigin"></component>
      </grid-item>
    </grid-layout>
    <el-dialog
        title="添加图表"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="30%">
      <div>
        <el-input
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
            v-model="filterText">
        </el-input>
        <el-table
            v-if="dialogVisible"
            ref="multipleTable"
            :data="filterList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55"></el-table-column>
          <el-table-column label="类型"
                           prop="name"
                           width="120"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="handleAddItem">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {GridLayout, GridItem} from 'vue-grid-layout'
// import ContextMenuBox from '@/components/layout/ContextMenuBox'
import BarChart from '../components/layout/BarChart'
import LineChart from '../components/layout/LineChart'
import seasonBar from "../components/layout/seasonBar.vue";
import seasonButton from "../components/layout/seasonButton.vue";
import {cloneDeep} from "lodash-es";

export default {
  name: 'PageHomeDashboard',
  components: {GridLayout, GridItem, seasonBar, seasonButton},
  data () {
    return {
      colNum: 6,
      layout: [
        {x: 0, y: 0, w: 2, h: 2, i: 1, type: 'bar'},
        {x: 2, y: 0, w: 2, h: 2, i: 2, type: 'line'}
      ],
      dialogVisible: false,
      addList: [{
        name: '折线图',
        type: 'line',
        i: 1,
        options: {
          legend: {
            data: ['Line 1'],
            left: 'center',
            top: 'top'
          },
          toolbox: {
            show: true,
            feature: {
              myTool1: {
                show: true,
                title: '折线图',
                icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
                onclick: () => this.changeChartType('line')
              },
              myTool2: {
                show: true,
                title: '柱状图',
                icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
                onclick: () => this.changeChartType('bar')
              },
              myTool3: {
                show: true,
                title: '散点图',
                icon: 'path://M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z',
                onclick: () => this.changeChartType('scatter')
              },
              dataView: {
                show: true
              },
              restore: {
                title: '还原'
              },
              saveAsImage: {
                title: '保存图片'
              }
            }
          },
          dataZoom: [
            {
              show: true,
              type: 'slider',
              startValue: 'Mon',
              height: 15,
              bottom: '2%'
            }
          ],
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Line 1',
              data: [-100, 186, 200, -260, 146, 125, 213],
              type: 'line',
              smooth: true,
              markLine: {
                // 基线公共样式
                lineStyle: {
                  type: 'dashed',
                },
                label: {
                  show: true,
                  position: 'middle',
                  formatter: '{b}{c}',
                },
                data: [
                  {
                    // type: 'average',
                    yAxis: 100,
                    lineStyle: {
                      color: '#ff0000'
                    }
                  },
                  {
                    // type: 'average',
                    yAxis: 280,
                    lineStyle: {
                      color: 'orange'
                    }
                  }
                ]
              }
            }
          ]
        },
      }, {
        name: '柱状图',
        type: 'bar',
        i: 0,
        options: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
            }
          ]
        }
      }],
      filterText: '',
      select: [],
      addI: 4,
      messageObj: {
        title: '添加消息说明',
        list: []
      },
      seasonList: []
    }
  },
  computed: {
    currentComponent () {
      return type => {
        if (type === 'bar') {
          return BarChart
        } else if (type === 'line') {
          return LineChart
        }
      }
    },
    filterList () {
      return this.addList.filter(item => item.name.includes(this.filterText))
    }
  },
  methods: {
    handleAddItem () {
      this.select.forEach(item => {
        const {x, y} = this.getPositionForNewItem(this.layout, 6, 2, 2)
        console.log(x, y, '找到的')
        const obj = {
          x,
          y, // puts it at the bottom
          w: 2,
          h: 2,
          i: this.addI,
          type: item.type
        }
        this.layout.push(obj)
        this.addI++
      })
      // this.getPositionForNewItem()
      this.select = []
      this.layout = cloneDeep(this.layout)
      this.dialogVisible = false
    },
    changeOrigin ({w, h}, obj) {
      const index = this.layout.findIndex(item => item.i === obj.i)
      if (index !== -1) {
        let newObj = this.layout[index]
        newObj.h = h
        newObj.w = w
        this.layout = cloneDeep(this.layout)
      }
    },
    delItem (obj) {
      const index = this.layout.findIndex(item => item.i === obj.i)
      if (index !== -1) {
        this.layout.splice(index, 1)
      }
    },
    handleSelectionChange (val) {
      console.log(val)
      this.select = val
    },
    getPositionForNewItem( layout, colNum, newItemWidth, newItemHeight ){
      let found = false;
      let position = { x: 0, y: 0 };
      let maxY = 0
      console.log(layout)
      layout.forEach(item => {
        if (item.y + item.h > maxY) {
          maxY = item.y + item.h - 1
        }
      })
      // 遍历列
      for (let x = 0; x <= colNum - newItemWidth; x++) {
        // 遍历行
        for (let y = 0; y <= maxY; y++) {
          let spaceClear = true;
          // 检查新元素放置在 x, y 位置是否会与现有元素冲突
          for (let i = 0; i < layout.length; i++) {
            const item = layout[i];
            const occupiesX = (x < item.x + item.w) && (x + newItemWidth > item.x);
            const occupiesY = (y < item.y + item.h) && (y + newItemHeight > item.y);
            // 如果空间已被占用，跳出当前循环
            if (occupiesX && occupiesY) {
              spaceClear = false;
              break;
            }
          }
          // 找到空闲空间，设置位置并跳出循环
          if (spaceClear) {
            found = true;
            position = { x, y };
            break;
          }
        }
        // 如果已找到位置，不需要进一步检查
        if (found) break;
      }
      // 如果没有找到位置，你可能需要处理这种情况（比如通过滚动来增加行数）
      if (!found) {
        console.log("没有找到合适的空位");
        return {
          x: 0,
          y:maxY + 1
        };
      }
      // 返回新元素的位置
      return position;
    },
    addSeason (e) {
      this.seasonList = e
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.page-home-dashboard {
  & > .vue-grid-layout {
    flex: 1;

    .vue-grid-item {
      touch-action: none;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(71, 93, 48, .1);
    }
  }
}
</style>
