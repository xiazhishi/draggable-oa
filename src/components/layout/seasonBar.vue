<template>
  <div class="season-container">
    <div class="info">
      <div class="info-item" v-for="(item, index) in list" :key="index" :style="handleInfo(item)" v-html="item.text"></div>
    </div>
    <div class="months">
      <div class="month" v-for="(item, index) in months" :key="index">
        <div class="line"></div>
        <div class="text" v-if="item.month !== nowMonth">{{ item.month }}月</div>
        <div class="text" v-else>本月</div>
        <div v-if="item.month === nowMonth" class="now"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "seasonBar",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      months: [],
      nowMonth: ''
    }
  },
  methods: {
    getMonth () {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      this.nowMonth = currentMonth + 1
      console.log(currentMonth, 'currentMonth')
      let months = [];
      for (let i = -5; i <= 5; i++) {
        const date = new Date(currentDate.getFullYear(), currentMonth + i, 1)
        months.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
      }
      this.months = months
    },
    handleInfo (item) {
      const startMonth = item.startTime.slice(5, 7)
      const endMonth = item.endTime.slice(5, 7)
      let startIndex = 0
      let endIndex = 0
      this.months.forEach((item, index) => {
        if (+item.month === +startMonth) {
          startIndex = index
        }
        if (+item.month === +endMonth) {
          endIndex = index
        }
      })
      return {
        'width': (8 * (endIndex - startIndex)) + '%',
        'left': (8 * startIndex + 4) + '%'
      }
    }
  },
  created () {
    this.getMonth()
  }
}
</script>

<style scoped lang="scss">
.season-container {
  border-radius: 10px;
  padding-top: 30px;
  padding-left: 10%;
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #F0F2F5;
  &>.months {
    width: 100%;
    display: flex;
    .month {
      flex-shrink: 0;
      width: 8%;
      position: relative;
      &>.line {
        width: 100%;
        height: 1px;
        background-color: #000;
      }
      &>.text {
        width: 100%;
        text-align: center;
      }
      &>.now {
        height: 280px;
        width: 1px;
        position: absolute;
        bottom: 21px;
        left: 50%;
        border: 1px dashed #ccc;
      }
    }
  }
  &>.info {
    height: 100%;
    width: 100%;
    position: relative;
    &>.info-item {
      background-color: #fff;
      padding: 15px;
      overflow: auto;
      height: 100%;
      position: absolute;
    }
  }
}
</style>
