<template>
  <div class="thumbnail">
    <div v-if="cols && cols.length">
      <div class="line" v-for="(listItem, index) in activeList" :key="index">
        <div class="title">{{ listItem.join(':') }}</div>
        <div class="rectangle" :class="{'active': calcRate(listItem) === activeRate() && isColsAll}" @click="rectangleClick(listItem)">
          <div v-for="(ele, key) in listItem" :key="key" class="cell"  :style="{'width': (ele / totalLength(listItem)) * 100 + '%'  }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "thumbnailVue",
  props: {
    cols: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      oneColumnsList: [[1]],
      twoColumnsList: [[1, 1], [1, 2], [2, 1], [7, 5], [5, 7], [1, 3], [3, 1]],
      threeColumnsList: [[1, 1, 1], [1, 1, 4], [4, 1, 1], [1, 4, 1], [5, 5, 2], [5, 2, 5], [2, 5, 5]],
      fourColumnsList: [[1, 1, 1, 1], [1, 1, 1, 3], [1, 1, 3, 1], [1, 3, 1, 1], [3, 1, 1, 1]]
    }
  },
  computed: {
    activeList () {
      if (this.cols.length === 2) {
        return this.twoColumnsList
      } else if (this.cols.length === 3) {
        return this.threeColumnsList
      } else if (this.cols.length === 4) {
        return this.fourColumnsList
      } else if (this.cols.length === 1) {
        return this.oneColumnsList
      } else {
        return []
      }
    },
    isColsAll () {
      let total = 0
      this.cols.forEach((item) => {
        total += item.span
      })
      return total === 24
    }
  },
  methods: {
    gcd(a, b) {
      if (!b) return a;
      return this.gcd(b, a % b);
    },
    gcdOfArray(arr) {
      return arr.reduce((acc, val) => this.gcd(acc, val));
    },
    simplifyArray(arr) {
      const gcdArr = this.gcdOfArray(arr);
      return arr.map(num => num / gcdArr);
    },
    activeRate () {
      if (!this.cols && !this.cols.length) return ''
      let rateList = []
      const spanList = this.cols.map((item) => item.span)
      this.cols.forEach((item) => {
        rateList.push((item.span / this.totalLength(spanList)) * 24)
      })
      const simplifiedArray = this.simplifyArray(rateList)
      return simplifiedArray.join(':')
    },
    totalLength (arr) {
      if (!arr) return 0
      return arr.reduce((total, num) => total + num)
    },
    rectangleClick (data) {
      this.$emit('rectangle-click', data)
    },
    calcRate (list) {
      if (!list && !list.length) return ''
      return list.join(':')
    }
  }
}
</script>

<style scoped lang="scss">
.thumbnail {
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-right: 15px;
    .title {
      width: 50px;
      flex-shrink: 0;
      font-size: 14px;
      color: #333;
      margin-right: 12px;
    }
    .rectangle {
      flex: 1;
      height: 28px;
      padding: 6px;
      background-color: #F1F1F1;
      border: 1px solid #999999;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      &>.cell {
        height: 100%;
        outline: 1px dotted #333333;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
      &:hover {
        border: 1px solid #4E89F8;
        background-color: #fff;
        &>.cell {
          outline: 1px dotted #4E89F8;
        }
      }
    }
    .active {
      border: 1px solid #4E89F8;
      background-color: #fff;
      &>.cell {
        outline: 1px dotted #4E89F8;
      }
    }
  }
}
</style>
