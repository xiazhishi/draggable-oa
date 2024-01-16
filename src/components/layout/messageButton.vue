<template>
  <div>
    <el-button @click="seasonVisible = true">添加消息说明</el-button>
    <el-dialog
        title="添加消息说明"
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
          title: '消息1',
          code: 'first',
          text: 'shape ：词云的形状，默认是 circle(圆形)，可选的参数有cardioid（心形） 、 diamond（菱形 正方形） 、 triangle-sizeRange ：词云的文字字号范围，默认是[12, 60] ，词云会根据提供原始数据的 value 对文字的字号进行渲染。以默认值为例，'
        },
        {
          title: '消息2',
          code: 'second',
          text: 'triangle-sizeRange ：词云的文字字号范围，默认是[12, 60] ，词云会根据提供原始数据的 value 对文字的字号进行渲染。以默认值为例，'
        }],
      chooseSeason: [],
      filterText: ''
    }
  },
  methods: {
    addSeason () {
      this.seasonList.forEach(item => {
        if (item.code === this.chooseSeason) {
          this.$emit('add-message', item)
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
