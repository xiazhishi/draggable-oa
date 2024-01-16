<template>
  <div>
    <el-button @click="seasonVisible = true">添加观点说明</el-button>
    <el-dialog
        title="添加观点说明"
        :visible.sync="seasonVisible"
        :append-to-body="true"
        width="30%">
      <div>
        <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="filterText">
        </el-input>
        <el-radio-group v-model="chooseSeason">
          <el-radio v-for="(item, index) in filterList" :key="index" :label="item.code">{{ item.title }}</el-radio>
        </el-radio-group>
        <div class="empty" v-if="!filterList.length"><el-empty description="暂无观点"></el-empty></div>
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
          title: '观点1',
          code: 'first',
          text: '<div data-element="root" class="am-engine" data-listener-added_923859c3="true"><p data-id="p1dr9j7ls-qz1ea9kqe6o0">官网的描述中，我们可以看出，该<a target="_blank" href="https://so.csdn.net/so/search?q=栅格布局&amp;spm=1001.2101.3001.7020" style="font-family: monospace; font-size: inherit; background-color: rgba(0, 0, 0, 0.06); padding: 0px 2px; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 2px; line-height: inherit; overflow-wrap: break-word; text-indent: 0px;">栅格布局</a>具有以下特性：</p><p data-id="p1dr9j7ls-zceulnillfk0"><img src="https://img-blog.csdnimg.cn/8b6f930cc08a4ed69aec33dc7554536a.png" style="width: 552px; visibility: visible; height: 385px;" data-type="inline"></p><h3 data-id="h4kgw8yp6-h79xsefpx7400" id="h4kgw8yp6-h79xsefpx7400">&nbsp;三、 属性</h3><p data-id="p1dr9j7ls-jqru35kx9fk00">简单说一下经常用到的属性，所有的属性可以前往官网查看描述,我们先来了解一下gridItem的必要属性吧，它对我们的讲解是非常重要的。</p></div>'
        },
        {
          title: '观点2',
          code: 'second',
          text: '<div data-element="root" class="am-engine" data-listener-added_5b0df283="true"><p data-id="p1dr9j7ls-1zbsz7apjtwg0">，其实还是考虑到性能问题，看看上面的代码写了多少个循环就知道，组件数量稍微多一点，操作肯定会卡，所以虽然实现了这个功能，但是用不用就要看实际情况了，或者大家看看有没有比这个更好的实现方法？进群告诉我一下？实践过程中解决这个问题可以通过Worker开启新线程进行“异步”计算，防止同步大计算量的等待时间过长或者页面卡顿，有关Worker的用法后续会写新的篇章。</p><p data-id="p1dr9j7ls-4t30klzednu0"><img src="http://www.seozhijia.net/uploads/allimg/2212/1-221202234912b7.jpg" style="width: 387px; visibility: visible; height: 350px;" data-type="inline"></p></div>'
        }],
      chooseSeason: [],
      filterText: ''
    }
  },
  methods: {
    addSeason () {
      this.seasonList.forEach(item => {
        if (item.code === this.chooseSeason) {
          this.$emit('add-point', item)
        }
      })
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
.el-radio-group {
  padding: 20px;
  display: flex;
  flex-direction: column;
  .el-radio {
    margin-bottom: 15px;
  }
}
</style>
