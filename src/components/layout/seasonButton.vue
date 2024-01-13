<template>
  <div>
    <el-button @click="seasonVisible = true">添加季节性规律说明</el-button>
    <el-dialog
        title="添加季节性规律说明"
        :visible.sync="seasonVisible"
        :append-to-body="true"
        width="30%">
      <div>
        <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="filterText">
        </el-input>
        <el-table
            v-if="seasonVisible"
            ref="multipleTable"
            :data="filterList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSeasonChoose">
          <el-table-column
              type="selection"
              width="55"></el-table-column>
          <el-table-column label="开始时间"
                           prop="startTime"
                           width="120"></el-table-column>
          <el-table-column label="结束时间"
                           prop="endTime"
                           width="120"></el-table-column>
          <el-table-column label="题目"
                           prop="title"
                           width="120"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.stop="seasonVisible = false">取 消</el-button>
          <el-button type="primary" @click.stop="addSeason">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "seasonButton",
  data () {
    return {
      seasonVisible: false,
      seasonList: [
        {
          title: '评论1',
          startTime: '2023-10',
          endTime: '2024-01',
          text: '<div data-element="root" class="am-engine" data-listener-added_5b0df283="true"><p data-id="p1dr9j7ls-1zbsz7apjtwg0">，其实还是考虑到性能问题，看看上面的代码写了多少个循环就知道，组件数量稍微多一点，操作肯定会卡，所以虽然实现了这个功能，但是用不用就要看实际情况了，或者大家看看有没有比这个更好的实现方法？进群告诉我一下？实践过程中解决这个问题可以通过Worker开启新线程进行“异步”计算，防止同步大计算量的等待时间过长或者页面卡顿，有关Worker的用法后续会写新的篇章。</p><p data-id="p1dr9j7ls-4t30klzednu0"><img src="http://www.seozhijia.net/uploads/allimg/2212/1-221202234912b7.jpg" style="width: 387px; visibility: visible; height: 350px;" data-type="inline"></p></div>'
        },
        {
          title: '评论2',
          startTime: '2023-2',
          endTime: '2024-5',
          text: '<div data-element="root" class="am-engine" data-listener-added_5b0df283="true"><p data-id="p1dr9j7ls-1zbsz7apjtwg0">，其实还是考虑到性能问题，看看上面的代码写了多少个循环就知道，组件数量稍微多一点，操作肯定会卡，所以虽然实现了这个功能，但是用不用就要看实际情况了，或者大家看看有没有比这个更好的实现方法？进群告诉我一下？实践过程中解决这个问题可以通过Worker开启新线程进行“异步”计算，防止同步大计算量的等待时间过长或者页面卡顿，有关Worker的用法后续会写新的篇章。</p><p data-id="p1dr9j7ls-4t30klzednu0"><img src="http://www.seozhijia.net/uploads/allimg/2212/1-221202234912b7.jpg" style="width: 387px; visibility: visible; height: 350px;" data-type="inline"></p></div>'
        }],
      chooseSeason: [],
      filterText: ''
    }
  },
  methods: {
    handleSeasonChoose (e) {
      this.chooseSeason = e
    },
    addSeason () {
      this.$emit('add-season', this.chooseSeason)
      this.seasonVisible = false
    }
  },
  computed: {
    filterList () {
      return this.seasonList.filter(item => item.title.includes(this.filterText))
    }
  }
}
</script>


<style scoped lang="scss">

</style>
