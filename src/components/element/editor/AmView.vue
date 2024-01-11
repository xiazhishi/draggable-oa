<template>
  <div :class="['am-view', 'am-view-' + this.size]"
       v-loading="!view"
       element-loading-spinner="el-icon-loading">
    <div ref="container"></div>
  </div>
</template>

<script>
import { View } from '@aomao/engine'
import Bold from '@aomao/plugin-bold'
import Code from '@aomao/plugin-code'
import BackColor from '@aomao/plugin-backcolor'
import FontColor from '@aomao/plugin-fontcolor'
import FontSize from '@aomao/plugin-fontsize'
import Italic from '@aomao/plugin-italic'
import Underline from '@aomao/plugin-underline'
import Hr, { HrComponent } from '@aomao/plugin-hr'
import TaskList, { CheckboxComponent } from '@aomao/plugin-tasklist'
import OrderedList from '@aomao/plugin-orderedlist'
import UnorderedList from '@aomao/plugin-unorderedlist'
import Indent from '@aomao/plugin-indent'
import Heading from '@aomao/plugin-heading'
import Strikethrough from '@aomao/plugin-strikethrough'
import Sub from '@aomao/plugin-sub'
import Sup from '@aomao/plugin-sup'
import Alignment from '@aomao/plugin-alignment'
import Quote from '@aomao/plugin-quote'
import PaintFormat from '@aomao/plugin-paintformat'
import RemoveFormat from '@aomao/plugin-removeformat'
import SelectAll from '@aomao/plugin-selectall'
import Image, { ImageComponent } from '@aomao/plugin-image'
import Table, { TableComponent } from '@aomao/plugin-table'
import File, { FileComponent } from '@aomao/plugin-file'
import Video, { VideoComponent } from '@aomao/plugin-video'
import Math, { MathComponent } from '@aomao/plugin-math'
import FontFamily from '@aomao/plugin-fontfamily'
import Status, { StatusComponent } from '@aomao/plugin-status'
import LineHeight from '@aomao/plugin-line-height'
// import Mention, { MentionComponent } from '@aomao/plugin-mention'
import Link from 'am-editor-link-vue2'
import CodeBlock, { CodeBlockComponent } from 'am-editor-codeblock-vue2'
export default {
  name: 'AmView',
  props: {
    value: {
      required: true
    },
    size: {
      type: String,
      default: 'mini',
      validator: val => {
        return ['mini', 'small', 'medium', 'large'].includes(val)
      }
    },
    scrollNode: HTMLElement,
    // 资源路径处理（参数为请求类型）
    urlRender: Function
  },
  data () {
    return {
      view: null
    }
  },
  methods: {
    initView () {
      this.view = new View(
        this.$refs.container,
        {
          cards: [
            HrComponent,
            CheckboxComponent,
            ImageComponent,
            TableComponent,
            FileComponent,
            VideoComponent,
            MathComponent,
            StatusComponent,
            // MentionComponent,
            CodeBlockComponent
          ],
          plugins: [
            Bold,
            Code,
            BackColor,
            FontColor,
            FontSize,
            Italic,
            Underline,
            Hr,
            TaskList,
            OrderedList,
            UnorderedList,
            Indent,
            Heading,
            Strikethrough,
            Sub,
            Sup,
            Alignment,
            Quote,
            PaintFormat,
            RemoveFormat,
            SelectAll,
            Image,
            Table,
            File,
            Video,
            Math,
            FontFamily,
            Status,
            LineHeight,
            // Mention,
            Link,
            CodeBlock
          ],
          config: {
            [Image.pluginName]: {
              onBeforeRender: (status, url) => {
                if (url.startsWith('data:image/')) {
                  return url
                }
                return this.urlRender ? this.urlRender(url, 'image') : url
              }
            },
            [File.pluginName]: {
              onBeforeRender: (action, url) => {
                return this.urlRender ? this.urlRender(url, 'file') : url
              }
            },
            [Video.pluginName]: {
              onBeforeRender: (status, url) => {
                return this.urlRender ? this.urlRender(url, 'video') : url
              }
            }
          }
        }
      )
      this.$nextTick(() => {
        if (this.scrollNode) {
          this.setScrollNode(this.scrollNode)
        }
        if (this.value) {
          this.renderContent(this.value)
        }
      })
    },
    renderContent (content) {
      if (this.view) {
        this.view.render(content, true)
      }
    },
    setScrollNode (scrollNode) {
      if (this.view) {
        this.view.setScrollNode(scrollNode)
      }
    }
  },
  mounted () {
    this.initView()
  },
  watch: {
    value: function (val) {
      this.renderContent(val)
    }
  }
}
</script>

<style lang="scss">
  .am-view {
    &.am-view-small {
      .am-engine-view {
        font-size: 13px;
      }
    }
    &.am-view-medium {
      .am-engine-view {
        font-size: 14px;
        padding: 16px 18px;
      }
    }
    &.am-view-large {
      .am-engine-view {
        font-size: 14px;
        padding: 30px;
      }
    }
    .am-engine-view {
      font-size: 12px;
      padding: 12px 15px;
      .data-card-block-max {
        &>[data-card-element="body"] {
          &>.card-maximize-header {
            height: 56px;
            z-index: 4000;
          }
          &>[data-card-element="center"] {
            top: 56px;
            margin: 0!important;
            z-index: 4000;
          }
        }
      }
    }
  }
</style>
