<template>
  <div class="edit">
    <div class="title">
      <div class="new-paper">新建周报</div>
      <div class="description">研究员进行周报的填写</div>
    </div>
    <div class="form">
      <div class="form-title">新建周报</div>
      <el-form :model="form" label-width="150px" label-position="left">
        <el-form-item label="周报标题：">
          <div style="width: 600px">
            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="周报内容：">
          <demoDrag ref="drag"></demoDrag>
        </el-form-item>
        <el-form-item label="其他附件：">
          <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
              :file-list="form.fileList">
            <el-button size="small" type="primary"><i class="el-icon-plus"></i>添加附件</el-button>
            <div slot="tip" class="el-upload__tip">支持上传.jpg、.png、.doc、.docx、.xls、.xlsx、.pptx、.pdf、.zip、.rar</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="group">
        <el-button type="primary" @click="submit">提交周报</el-button>
        <el-button>取消</el-button>
      </div>
      <el-drawer
          :title="form.title"
          :visible.sync="drawer"
          :show-close="true"
          direction="rtl">
        <div class="drawer-content">
          <div class="detail">
            <div class="detail-header">
              <div class="title">周报详情</div>
              <el-button type="danger" size="mini" @click="exportDataToPDF">导出PDF</el-button>
            </div>
            <div class="main" id="pdfDom" ref="orderForm">
              <div class="title">{{ form.title }}</div>
              <div class="line">
                <div class="right">提交时间：{{ nowDate }}</div>
              </div>
              <preview v-if="drawer"></preview>
            </div>
          </div>
<!--          <div class="interview">-->
<!--            <div class="detail-header">评论详情</div>-->
<!--            <div class="main">-->
<!--              <div v-for="(item, index) in interviewList" :key="index" class="message-bubble">-->
<!--                <div v-if="item.flow === 'in'" class="bubble in">-->
<!--                  <div class="head">-->
<!--                    <img :src="item.headPath" alt="">-->
<!--                  </div>-->
<!--                  <div class="message">-->
<!--                    <div class="time">{{ item.time }}</div>-->
<!--                    <div class="profile" v-html="item.message"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div v-else class="bubble out">-->
<!--                  <div class="message">-->
<!--                    <div class="time">{{ item.time }}</div>-->
<!--                    <div class="profile" v-html="item.message"></div>-->
<!--                  </div>-->
<!--                  <div class="head">-->
<!--                    <img :src="item.headPath" alt="">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="input" @click="interviewVisible = true">-->
<!--              <div v-if="interview" v-html="interview"></div>-->
<!--              <span v-else>点击输入评论...</span>-->
<!--            </div>-->
<!--          </div>-->
          <el-drawer
              :visible.sync="interviewVisible"
              direction="btt"
              title="评论"
              :append-to-body="true">
            <div class="interview-input">
              <amEditor v-model="interview" :editorHeight="180"></amEditor>
              <div class="btn">
                <el-button size="mini">取消评论</el-button>
                <el-button size="mini" type="primary" @click="submitPreview">提交评论</el-button>
              </div>
            </div>
          </el-drawer>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import amEditor from "@/components/element/editor/AmEditor.vue";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import demoDrag from '../components/demoDrag.vue'
import preview from '../pages/preview.vue'
export default {
  components: {
    demoDrag,
    preview,
    amEditor
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
      console.log(this.form.title)
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
  text-align: left;
  padding: 20px;
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
</style>
