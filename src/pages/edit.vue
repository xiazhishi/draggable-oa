<template>
  <div class="edit">
    <div class="group">
      <el-button type="primary" @click="submit" size="medium">提交周报</el-button>
    </div>
    <div class="form">
      <el-form :model="form" label-width="100px" label-position="left">
        <div class="drag-content">
          <el-form-item label="内容：">
            <drag-area ref="drag"></drag-area>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DragArea from '../components/DragArea.vue'

export default {
  components: {
    DragArea
  },
  data () {
    return {
      interview: '',
      interviewVisible: false,
      interviewList: [{
        time: '2020-11-24 10:00',
        headPath: 'https://img0.baidu.com/it/u=3121974779,1726178990&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        message: '<div>这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论</div>',
        flow: 'in'
      }, {
        headPath: 'https://img0.baidu.com/it/u=3121974779,1726178990&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        time: '2020-11-24 10:00',
        message: '<div>这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论</div>',
        flow: 'out'
      }, {
        headPath: 'https://img0.baidu.com/it/u=3121974779,1726178990&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        time: '2020-11-24 10:00',
        message: '<div>这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论</div>',
        flow: 'in'
      }],
      htmlTitle: '周报',
      nowDate: '',
      drawer: false,
      form: {
        title: '',
        fileList: []
      }
    }
  },
  methods: {
    submit () {
      if (!this.form.title) {
        this.$message.error('请填写周报标题')
        return
      }
      console.log(this.form)
      this.$refs.drag.save()
      this.nowDate = new Date().toLocaleDateString()
      this.drawer = true
    },
    exportDataToPDF () {
      // 获取要导出为PDF的元素（此处假设我们要导出整个页面）
      const element = document.getElementById('pdfDom')
      // 使用html2canvas将元素转换为canvas对象
      html2canvas(element).then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        // 创建PDF实例
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imageData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // 将canvas画布作为图像添加到PDF
        pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // 导出PDF文件
        const name = this.form.title + '.pdf'
        pdf.save(name);
      });
    },
    submitPreview () {
      this.interviewList.push({
        time: new Date().toLocaleDateString(),
        headPath: 'https://img0.baidu.com/it/u=3121974779,1726178990&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        message: this.interview,
        flow: 'out'
      })
      this.interview = ''
      this.interviewVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.edit {
  height: 100%;
  text-align: left;
  padding: 20px;
  position: relative;
  &>.group {
    position: absolute;
    z-index: 1;
    top: 54px;
    right: 20px;
  }
  &>.title {
    text-align: left;
    margin-bottom: 20px;
    &>.new-paper {
      font-size: 18px;
      color: #4E89F8;
      margin-bottom: 5px;
    }
    &>.description {
      font-size: 12px;
      color: #333;
    }
  }
  &>.form {
    height: 100%;
    &>.form-title {
      text-align: left;
      font-size: 14px;
      color: #333;
      font-weight: 550;
      margin-bottom: 10px;
    }
  }
  /deep/ .el-drawer {
    background-color: #F0F2F5;
    width: 60% !important;
    .el-drawer__header {
      color: #333;
      font-size: 16px;
      font-weight: 550;
      padding: 20px 15px;
      background-color: #fff;
      margin-bottom: 10px;
    }
    .drawer-content {
      &>.detail {
        padding: 0 15px;
        background-color: #F0F2F5;
        margin-bottom: 10px;
        &>.detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-top: 10px;
          &>.title {
            font-weight: 550;
            color: #4E89F8;
          }
        }
        &>.main {
          padding: 15px;
          &>.title {
            text-align: center;
            font-size: 18px;
            font-weight: 550;
            color: #333;
            margin-bottom: 10px;
          }
          &>.line {
            text-align: right;
            &>.right {
              font-size: 14px;
              color: #999;
            }
            margin-bottom: 15px;
          }
        }
      }
      &>.interview {
        background-color: #fff;
        &>.detail-header {
          padding: 0 15px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding-top: 10px;
          font-weight: 550;
          color: #4E89F8;
        }
        &>.main {
          padding: 0 15px 15px;
          &>.message-bubble {
            margin-top: 10px;
            &>.bubble {
              display: flex;
              .head {
                &>img {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                }
              }
              .message {
                flex: 1;
                display: flex;
                flex-direction: column;
                &>.time {
                  color: #ccc;
                  margin-bottom: 6px;
                }
              }
              .profile {
                width: 70%;
                background-color: #EBECEE;
                padding: 10px;
              }
            }
            &>.in {
              .head {
                margin-right: 10px;
              }
            }
            &>.out {
              .head {
                margin-left: 10px;
              }
              .message {
                align-items: end;
              }
            }
          }
        }
        &>.input {
          width: 100%;
          height: 50px;
          line-height: 50px;
          padding: 0 12px;
          color: #ccc;
          cursor: pointer;
          box-shadow: 0 0 5px #ccc;
        }
      }
    }
  }
}
/deep/ .interview-input {
  padding: 15px 30px;
  &>.btn {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    .el-button {
      margin-right: 5px;
    }
  }
}
/deep/ .el-form {
  height: calc(100% - 50px);
  .drag-content {
    height: calc(100% - 149px);
    margin-bottom: 22px;
    .el-form-item {
      height: 100%;
      .el-form-item__content {
        height: 100%;
      }
    }
  }
}
</style>
