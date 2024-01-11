<template>
  <div :class="['am-editor', {'am-editor-border': border}, 'am-editor-' + this.size, {'focused theme-border': focused && !disabled}, {'fullscreen': fullscreen}]"
       v-loading="loading"
       element-loading-spinner="el-icon-loading"
       element-loading-text="正在初始化">
    <template v-if="engine">
      <div class="toolbar-wrapper">
        <div :class="['toolbar', {'overflow': popoverItems.length}]">
          <am-toolbar ref="toolbar"
                      :engine="engine"
                      :items="toolbarItems"
                      @hook:mounted="toolbarMounted"/>
        </div>
        <div class="popover">
          <el-popover ref="popover"
                      v-model="popoverVisible"
                      placement="bottom-end"
                      trigger="click"
                      popper-class="am-editor-popover-toolbar"
                      :class="['popover-wrap', {'visible': popoverItems.length}]"
                      :visible-arrow="false"
                      @show="toolbarChanged">
            <am-toolbar ref="popoverToolbar"
                        :engine="engine"
                        :items="popoverItems"/>
            <el-button slot="reference"
                       size="mini"
                       type="text"
                       icon="el-icon-more"
                       :disabled="disabled"></el-button>
          </el-popover>
          <el-button v-if="maximizable"
                     size="mini"
                     type="primary"
                     icon="el-icon-full-screen"
                     @click="toggleFullscreen"></el-button>
        </div>
      </div>
    </template>
    <div class="editor-wrapper">
      <div class="editor-content" :style="editorStyle">
        <div ref="container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import { getStyle } from 'element-ui/lib/utils/dom'
import Emitter from 'element-ui/lib/mixins/emitter'
import Engine, { $ } from '@aomao/engine'
import Redo from '@aomao/plugin-redo'
import Undo from '@aomao/plugin-undo'
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
import Image, { ImageComponent, ImageUploader } from '@aomao/plugin-image'
import Table, { TableComponent } from '@aomao/plugin-table'
import File, { FileComponent, FileUploader } from '@aomao/plugin-file'
import Video, { VideoComponent, VideoUploader } from '@aomao/plugin-video'
import Math, { MathComponent } from '@aomao/plugin-math'
import FontFamily from '@aomao/plugin-fontfamily'
import Status, { StatusComponent } from '@aomao/plugin-status'
import LineHeight from '@aomao/plugin-line-height'
// import Mention, { MentionComponent } from '@aomao/plugin-mention'
import AmToolbar, { fontFamilyDefaultData, ToolbarComponent, ToolbarPlugin } from 'am-editor-toolbar-vue2'
import Link from 'am-editor-link-vue2'
import CodeBlock, { CodeBlockComponent } from 'am-editor-codeblock-vue2'
import AmUpload from '../../../mixins/upload/AmUpload'
import objectUtils from '../../../util/objectUtils.js'
export default {
  mixins: [Emitter, AmUpload],
  name: 'AmEditor',
  components: {
    AmToolbar
  },
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
    border: {
      type: Boolean,
      default: true
    },
    editorHeight: {
      type: [Number, String],
      default: 160
    },
    placeholder: String,
    autoHeight: Boolean,
    maximizable: {
      type: Boolean,
      default: true
    },
    scrollNode: HTMLElement,
    mode: {
      type: String,
      default: 'simple',
      validator: mode => {
        return ['simple', 'text', 'full', 'sketchy'].includes(mode)
      }
    },
    valueType: {
      type: String,
      default: 'html',
      validator: valueType => {
        return ['html', 'value', 'json'].includes(valueType)
      }
    },
    popupTool: {
      type: Boolean,
      default: true
    },
    useRemoteImage: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    // 相关上传URL
    requestBaseUrl: {
      type: String,
      default: '/support/editor/ae'
    },
    // 是否传递的完整路径
    fullUrl: {
      type: Boolean,
      default: false
    },
    // 支持返回Promise
    requestHeaders: [Function, Object],
    // 支持返回Promise
    requestData: [Function, Object],
    // 相关上传配置（参数为请求类型）
    requestOptions: Function,
    // 资源路径处理（参数为请求类型）
    urlRender: Function
  },
  data () {
    return {
      loading: true,
      engine: null,
      popoverItems: [],
      popoverVisible: false,
      focused: false,
      fullscreen: false,
      cardMaximize: false,
      editorContent: undefined
    }
  },
  computed: {
    collapseItems () {
      switch (this.mode) {
        case 'text': {
          return []
        }
        case 'full': {
          return [
            'image-uploader',
            'file-uploader',
            'video-uploader',
            'table',
            'codeblock',
            'math',
            'status'
          ]
        }
        case 'simple':
        default: {
          return [
            'image-uploader',
            'file-uploader',
            'video-uploader',
            'table',
            'status'
          ]
        }
      }
    },
    toolbarItems () {
      switch (this.mode) {
        case 'text': {
          return [
            [
              {name: 'undo', hotkey: 'ctrl+z'},
              {name: 'redo', hotkey: 'ctrl+y'}
            ],
            ['heading', 'fontfamily', 'fontsize'],
            [
              {name: 'bold', hotkey: 'ctrl+b'},
              {name: 'italic', hotkey: 'ctrl+i'},
              {name: 'strikethrough', hotkey: 'ctrl+shift+x'},
              {name: 'underline', hotkey: 'ctrl+u'}
            ],
            ['fontcolor', 'backcolor'],
            ['alignment'],
            [
              {name: 'orderedlist', hotkey: 'ctrl+shift+7'},
              {name: 'unorderedlist', hotkey: 'ctrl+shift+8'}
            ]
          ]
        }
        case 'sketchy': {
          return [
            [
              {
                type: 'collapse',
                icon: '<i class="el-icon-menu theme-text" style="font-size:16px"></i>',
                groups: [
                  {
                    items: [
                      'image-uploader',
                      'file-uploader',
                      'table',
                      'status'
                    ]
                  }
                ]
              }
            ],
            [
              {name: 'undo', hotkey: 'ctrl+z'},
              {name: 'redo', hotkey: 'ctrl+y'}
            ],
            ['heading', 'fontfamily', 'fontsize'],
            [
              {name: 'bold', hotkey: 'ctrl+b'},
              {name: 'italic', hotkey: 'ctrl+i'},
              {name: 'strikethrough', hotkey: 'ctrl+shift+x'},
              {name: 'underline', hotkey: 'ctrl+u'}
            ],
            ['fontcolor', 'backcolor'],
            ['alignment'],
            [
              {name: 'orderedlist', hotkey: 'ctrl+shift+7'},
              {name: 'unorderedlist', hotkey: 'ctrl+shift+8'},
              {name: 'tasklist', hotkey: 'ctrl+shift+9'}
            ],
            [
              {name: 'link', hotkey: 'ctrl+k'},
              {name: 'quote', hotkey: 'ctrl+shift+u'},
              {name: 'hr', hotkey: 'ctrl+shift+e'}
            ]
          ]
        }
        case 'full': {
          return [
            [
              {
                type: 'collapse',
                icon: '<i class="el-icon-menu theme-text" style="font-size:16px"></i>',
                groups: [
                  {
                    items: this.collapseItems
                  }
                ]
              }
            ],
            [
              {name: 'undo', hotkey: 'ctrl+z'},
              {name: 'redo', hotkey: 'ctrl+y'},
              {name: 'paintformat'},
              {name: 'removeformat', hotkey: 'ctrl+\\'}
            ],
            ['heading', 'fontfamily', 'fontsize'],
            [
              {name: 'bold', hotkey: 'ctrl+b'},
              {name: 'italic', hotkey: 'ctrl+i'},
              {name: 'strikethrough', hotkey: 'ctrl+shift+x'},
              {name: 'underline', hotkey: 'ctrl+u'},
              {name: 'moremark'}
            ],
            ['fontcolor', 'backcolor'],
            ['alignment'],
            [
              {name: 'orderedlist', hotkey: 'ctrl+shift+7'},
              {name: 'unorderedlist', hotkey: 'ctrl+shift+8'},
              {name: 'tasklist', hotkey: 'ctrl+shift+9'},
              {name: 'indent'},
              {name: 'line-height'}
            ],
            [
              {name: 'link', hotkey: 'ctrl+k'},
              {name: 'quote', hotkey: 'ctrl+shift+u'},
              {name: 'hr', hotkey: 'ctrl+shift+e'}
            ]
          ]
        }
        case 'simple':
        default: {
          return [
            [
              {
                type: 'collapse',
                icon: '<i class="el-icon-menu theme-text" style="font-size:16px"></i>',
                groups: [
                  {
                    items: this.collapseItems
                  }
                ]
              }
            ],
            [
              {name: 'undo', hotkey: 'ctrl+z'},
              {name: 'redo', hotkey: 'ctrl+y'}
            ],
            ['heading', 'fontfamily', 'fontsize'],
            [
              {name: 'bold', hotkey: 'ctrl+b'},
              {name: 'italic', hotkey: 'ctrl+i'},
              {name: 'strikethrough', hotkey: 'ctrl+shift+x'},
              {name: 'underline', hotkey: 'ctrl+u'}
            ],
            ['fontcolor', 'backcolor'],
            ['alignment'],
            [
              {name: 'orderedlist', hotkey: 'ctrl+shift+7'},
              {name: 'unorderedlist', hotkey: 'ctrl+shift+8'},
              {name: 'tasklist', hotkey: 'ctrl+shift+9'}
            ],
            [
              {name: 'link', hotkey: 'ctrl+k'},
              {name: 'quote', hotkey: 'ctrl+shift+u'},
              {name: 'hr', hotkey: 'ctrl+shift+e'}
            ]
          ]
        }
      }
    },
    popupItems () {
      if (this.popupTool && this.autoHeight) {
        return [
          ['heading'],
          [
            {name: 'bold', hotkey: 'ctrl+b'},
            {name: 'strikethrough', hotkey: 'ctrl+shift+x'},
            {name: 'underline', hotkey: 'ctrl+u'}
          ],
          ['fontcolor', 'backcolor']
        ]
      }
    },
    editorStyle () {
      let editorHeight
      switch (typeof this.editorHeight) {
        case 'number':
          editorHeight = `${this.editorHeight}px`
          break
        case 'string':
        default:
          editorHeight = this.editorHeight
          break
      }
      if (editorHeight) {
        if (this.autoHeight || this.fullscreen) {
          return {
            'min-height': editorHeight
          }
        } else {
          return {
            'height': editorHeight,
            'overflow': this.cardMaximize ? null : 'auto'
          }
        }
      }
    },
    isMaximize () {
      return this.fullscreen || this.cardMaximize
    }
  },
  methods: {
    initEditor () {
      const engine = new Engine(
        this.$refs.container,
        {
          placeholder: this.placeholder,
          readonly: this.disabled,
          autoPrepend: false,
          lazyRender: false,
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
            CodeBlockComponent,
            ToolbarComponent
          ],
          plugins: [
            Redo,
            Undo,
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
            ImageUploader,
            Table,
            File,
            FileUploader,
            Video,
            VideoUploader,
            Math,
            FontFamily,
            Status,
            LineHeight,
            // Mention,
            Link,
            CodeBlock,
            ToolbarPlugin
          ],
          config: {
            [Italic.pluginName]: {
              markdown: '*'
            },
            [ImageUploader.pluginName]: {
              file: {
                // 图片上传
                action: this.$contextPath(`${this.requestBaseUrl}/upload/image`),
                ...this.$extend({
                  headers: this.requestHeaders || {},
                  data: this.requestData || {},
                  accept: 'png,jpg,jpeg',
                  limitSize: 1024 * 1024 * 10
                }, this.requestOptions ? this.requestOptions('image', 'file') : {})
              },
              parse: (response) => {
                let url = ''
                if (response.data instanceof Array) {
                  url = response.data[0].url
                } else {
                  url = response.data.url
                }
                return {
                  result: true,
                  data: url
                }
              },
              remote: {
                // 添加外网图片连接上传,上后端下载图片，并返回一个本地连接,比如图片复制
                action: this.$contextPath(`${this.requestBaseUrl}/upload/image`),
                ...this.$extend({
                  headers: this.requestHeaders || {},
                  data: this.requestData || {},
                  contentType: 'application/x-www-form-urlencoded'
                }, this.requestOptions ? this.requestOptions('image', 'remote') : {})
              },
              isRemote: src => {
                console.log(src)
                if (!this.disabled && !this.useRemoteImage && !!src) {
                  return src.startsWith('http://') || src.startsWith('https://')
                }
              }
            },
            [Image.pluginName]: {
              onBeforeRender: (status, url) => {
                if (url.startsWith('data:image/')) {
                  return url
                }
                return this.urlRender ? this.urlRender(url, 'image') : url
              }
            },
            [FileUploader.pluginName]: {
              // 附件上传
              action: this.$contextPath(`${this.requestBaseUrl}/upload/file`),
              ...this.$extend({
                headers: this.requestHeaders || {},
                data: this.requestData || {},
                limitSize: 1024 * 1024 * 200
              }, this.requestOptions ? this.requestOptions('file') : {})
            },
            [File.pluginName]: {
              onBeforeRender: (action, url) => {
                return this.urlRender ? this.urlRender(url, 'file') : url
              }
            },
            [VideoUploader.pluginName]: {
              // 视频上传
              action: this.$contextPath(`${this.requestBaseUrl}/upload/video`),
              ...this.$extend({
                headers: this.requestHeaders || {},
                data: this.requestData || {},
                limitSize: 1024 * 1024 * 100
              }, this.requestOptions ? this.requestOptions('video') : {})
            },
            [Video.pluginName]: {
              onBeforeRender: (status, url) => {
                return this.urlRender ? this.urlRender(url, 'video') : url
              }
            },
            [Math.pluginName]: {
              action: this.$contextPath(`${this.requestBaseUrl}/formula/latex`),
              headers: this.requestHeaders || {},
              data: this.requestData || {},
              contentType: 'application/x-www-form-urlencoded',
              parse: (res) => {
                if (res.success) {
                  return {result: true, data: res.svg}
                }
                return {result: false}
              }
            },
            // [Mention.pluginName]: {
            //   action: this.$contextPath(`${this.requestBaseUrl}/user/mention`),
            // },
            [FontSize.pluginName]: {
              // 配置粘贴后需要过滤的字体大小
              filter: fontSize => {
                return [ '12px', '13px', '14px', '15px', '16px', '19px', '22px', '24px', '29px', '32px', '40px', '48px' ]
                  .indexOf(fontSize) > -1
              }
            },
            [FontFamily.pluginName]: {
              // 配置粘贴后需要过滤的字体
              filter: fontFamily => {
                const item = fontFamilyDefaultData.find(item => fontFamily.split(',')
                  .some(name => item.value.toLowerCase().indexOf(name.replace(/"/, '').toLowerCase()) > -1))
                return item ? item.value : false
              }
            },
            [LineHeight.pluginName]: {
              // 配置粘贴后需要过滤的行高
              filter: lineHeight => {
                if (lineHeight === '14px') { return '1' }
                if (lineHeight === '16px') { return '1.15' }
                if (lineHeight === '21px') { return '1.5' }
                if (lineHeight === '28px') { return '2' }
                if (lineHeight === '35px') { return '2.5' }
                if (lineHeight === '42px') { return '3' }
                return ['1', '1.15', '1.5', '2', '2.5', '3'].indexOf(lineHeight) > -1
              }
            },
            [ToolbarPlugin.pluginName]: {
              config: [{
                items: this.collapseItems
              }],
              popup: {
                items: this.popupItems
              }
            }
          }
        }
      )
      // 设置显示成功消息UI，默认使用 console.log
      engine.messageSuccess = (type, msg) => {
        this.$message.success(msg)
      }
      // 设置显示错误消息UI，默认使用 console.error
      engine.messageError = (type, error) => {
        this.$message.error(error)
      }
      // 设置显示确认消息UI，默认无
      engine.messageConfirm = (type, msg) => {
        return new Promise((resolve, reject) => {
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            resolve(true)
          }).catch(err => {
            reject(err)
          })
        })
      }
      // 获取焦点
      engine.on('focus', () => {
        this.focused = true
      })
      engine.on('blur', () => {
        this.focused = false
      })
      // 卡片最大化
      engine.on('card:maximize', () => {
        this.cardMaximize = true
        this.$nextTick(() => {
          $(this.$el).find('.card-maximize-header').attributes('contenteditable', 'false')
        })
      })
      engine.on('card:minimize', () => {
        this.cardMaximize = false
      })
      // 监听编辑器值改变事件
      engine.on('change', () => this.notifyChange())
      // 上传配置
      this.setCustomUpload(engine)
      this.engine = engine
      this.$nextTick(() => {
        if (this.scrollNode) {
          this.setScrollNode(this.scrollNode)
        }
        if (this.value) {
          this.setContent(this.value)
        }
      })
    },
    setContent (value) {
      if (this.engine) {
        if (!objectUtils.hasValue(value) && this.engine.isEmpty()) {
          // 无需触发
          return
        }
        switch (this.valueType) {
          case 'value': {
            this.engine.setValue(value)
            break
          }
          case 'json': {
            this.engine.setJsonValue(value)
            break
          }
          case 'html':
          default: {
            this.engine.setHtml(value)
            break
          }
        }
      }
    },
    getContent () {
      if (this.engine && !this.engine.isEmpty()) {
        switch (this.valueType) {
          case 'value': {
            return this.engine.getValue(true)
          }
          case 'json': {
            return this.engine.getJsonValue()
          }
          case 'html':
          default: {
            return this.engine.getHtml()
          }
        }
      }
    },
    notifyChange () {
      if (!this.disabled && this.engine) {
        if (!objectUtils.hasValue(this.value) && this.engine.isEmpty()) {
          // 无需触发
          return
        }
        let content = this.getContent()
        this.editorContent = content
        this.$emit('input', content)
        this.$emit('change', content)
        this.dispatch('ElFormItem', 'el.form.blur', content)
      }
    },
    setScrollNode (scrollNode) {
      if (this.engine) {
        this.engine.setScrollNode(scrollNode)
      }
    },
    toggleFullscreen () {
      this.fullscreen = !this.fullscreen
    },
    bindEvents () {
      addResizeListener(this.$el, this.handleResize)
      this.$nextTick(() => this.handleResize())
    },
    unbindEvent () {
      let toolbar = this.$refs.toolbar
      if (toolbar) {
        let toolbarContent = toolbar.$el.querySelector('.editor-toolbar-content')
        if (toolbarContent) {
          removeResizeListener(toolbarContent, this.handleResize)
        }
      }
      removeResizeListener(this.$el, this.handleResize)
    },
    handleResize () {
      let toolbar = this.$refs.toolbar
      if (toolbar) {
        let toolbarGroup = toolbar.$children
        if (toolbarGroup && toolbarGroup.length) {
          let toolbarWidth = toolbar.$el.clientWidth
          let calcWidth = 0
          let popoverItems = []
          let showItems = []
          let hideItems = []
          toolbarGroup.forEach((group, gIndex) => {
            let groupItems = group._props ? group._props.items : this.toolbarItems[gIndex]
            let items = group.$children || []
            let paddingSize
            if (group.$el.clientWidth) {
              if (items.length) {
                paddingSize = items[0].$el.offsetLeft - group.$el.offsetLeft
              } else {
                paddingSize = group.$el.clientWidth / 2
              }
              group._paddingSize = paddingSize
            } else {
              paddingSize = group._paddingSize || 0
            }
            let popoverGroup = []
            calcWidth += paddingSize
            items.forEach((item, index) => {
              let itemWidth = item.$el.clientWidth || item._clientWidth || 0
              if (itemWidth) {
                item._clientWidth = itemWidth
              }
              if (calcWidth + itemWidth + paddingSize + 5 > toolbarWidth) {
                if (Array.isArray(groupItems)) {
                  let groupItem = groupItems[index]
                  if (groupItem) {
                    popoverGroup.push(groupItem)
                  }
                }
                hideItems.push(item)
                if (index === 0) {
                  hideItems.push(group)
                }
              } else {
                showItems.push(item)
                showItems.push(group)
              }
              calcWidth += itemWidth
            })
            calcWidth += paddingSize + 1
            if (popoverGroup.length) {
              popoverItems.push(popoverGroup)
            }
          })
          showItems.forEach(item => {
            item.$el.style.display = ''
          })
          hideItems.forEach(item => {
            item.$el.style.display = 'none'
          })
          this.popoverItems = popoverItems
          return true
        }
      }
    },
    toolbarMounted (times = 0) {
      if (this.handleResize()) {
        let toolbar = this.$refs.toolbar
        if (toolbar) {
          let toolbarContent = toolbar.$el.querySelector('.editor-toolbar-content')
          if (toolbarContent) {
            addResizeListener(toolbarContent, this.handleResize)
          }
        }
        this.loading = false
      } else {
        if (times < 10) {
          setTimeout(() => this.toolbarMounted(++times), 300)
        } else {
          this.loading = false
        }
      }
    },
    toolbarChanged () {
      if (this.popoverVisible) {
        let popoverToolbar = this.$refs.popoverToolbar
        if (popoverToolbar) {
          popoverToolbar.update()
          setTimeout(() => {
            let popover = this.$refs.popover
            if (popover) {
              popover.updatePopper()
            }
          }, 300)
        }
      }
    },
    setContainerStyle () {
      let parent = this.$el.parentNode
      while (parent && parent.nodeName !== 'HTML') {
        if (parent.nodeType === 1) {
          let zIndex = getStyle(parent, 'zIndex')
          if (zIndex && zIndex !== 'auto') {
            let position = getStyle(parent, 'position')
            if (position === 'absolute' || position === 'relative') {
              $(parent).addClass('am-editor-parent--maximize')
            }
          }
        }
        parent = parent.parentNode
      }
    },
    delContainerStyle () {
      let parent = this.$el.parentNode
      while (parent && parent.nodeName !== 'HTML') {
        if (parent.nodeType === 1) {
          $(parent).removeClass('am-editor-parent--maximize')
        }
        parent = parent.parentNode
      }
    }
  },
  mounted () {
    this.initEditor()
    this.bindEvents()
  },
  beforeDestroy () {
    this.unbindEvent()
    if (this.editor) {
      setTimeout(() => {
        this.editor.destroy()
      }, 1000)
    }
  },
  watch: {
    popoverItems (val) {
      if (val.length) {
        this.toolbarChanged()
      } else {
        this.popoverVisible = false
      }
    },
    disabled: function (newValue) {
      if (this.engine) {
        this.engine.readonly = newValue
      }
    },
    scrollNode: function (val) {
      this.setScrollNode(val)
    },
    isMaximize: function (val) {
      val ? this.setContainerStyle() : this.delContainerStyle()
    },
    value (val) {
      if (val !== this.editorContent) {
        this.setContent(val)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../../../styles/color";
  .am-editor {
    background: #ffffff;
    border-radius: 4px;
    &.el-loading-parent--relative {
      overflow: hidden;
      &>.toolbar-wrapper,
      &>.editor-wrapper {
        visibility: hidden;
        opacity: 0;
      }
      .el-loading-mask {
        opacity: .6;
      }
    }
    &.am-editor-border {
      border: 1px solid #dcdfe6;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    &.am-editor-small {
      &>.toolbar-wrapper {
        padding: 10px 8px;
      }
      &>.editor-wrapper {
        &>.editor-content {
          .am-engine {
            font-size: 13px;
          }
        }
      }
    }
    &.am-editor-medium {
      &>.toolbar-wrapper {
        padding: 12px 10px;
      }
      &>.editor-wrapper {
        &>.editor-content {
          .am-engine {
            font-size: 14px;
            padding: 16px 18px;
          }
        }
      }
    }
    &.am-editor-large {
      &>.toolbar-wrapper {
        padding: 15px;
      }
      &>.editor-wrapper {
        &>.editor-content {
          .am-engine {
            font-size: 14px;
            padding: 30px;
          }
        }
      }
    }
    &.focused {
      &>.toolbar-wrapper {
        &>.toolbar {
          z-index: 203;
        }
      }
    }
    &.fullscreen {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 3199;
      border: none;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      &>.toolbar-wrapper {
        flex: none;
      }
      &>.editor-wrapper {
        flex: auto;
        overflow: auto;
      }
    }
    &>.toolbar-wrapper {
      padding: 6px 4px;
      border-bottom: 1px solid rgba(0,0,0,.05);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      line-height: 24px;
      &>.toolbar {
        flex: auto;
        position: relative;
        height: 26px;
        z-index: 201;
        &.overflow {
          .editor-toolbar {
            text-align: left;
          }
        }
        .editor-toolbar {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          text-align: center;
          border-color: transparent;
          .editor-toolbar-content {
            width: auto;
            display: inline-flex;
            flex-wrap: nowrap;
            .editor-toolbar-group {
              padding: 0 4px;
              border-left-color: #f4f4f5;
              .toolbar-button {
                white-space: nowrap;
              }
            }
          }
        }
      }
      &>.popover {
        background-color: #fff;
        padding-left: 6px;
        padding-right: 8px;
        flex: none;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 202;
        .popover-wrap {
          visibility: hidden;
          opacity: 0;
          transition: all .2s;
          &.visible {
            visibility: visible;
            opacity: 1;
          }
        }
        .el-button {
          &.el-button--text {
            color: #606266;
            &.is-disabled {
              color: #c0c4cc;
            }
            i {
              font-size: 16px;
              vertical-align: -1px;
            }
          }
          margin-left: 10px;
          width: 21px;
          height: 21px;
          padding: 0;
          text-align: center;
          line-height: 20px;
        }
      }
    }
    &>.editor-wrapper {
      &>.editor-content {
        display: flex;
        flex-direction: column;
        .am-engine {
          flex: auto;
          margin: auto;
          width: 100%;
          font-size: 12px;
          padding: 12px 15px;
          .data-card-block-max {
            &>[data-card-element="body"] {
              &>.card-maximize-header {
                height: 56px;
                z-index: 3999;
              }
              &>[data-card-element="center"] {
                top: 56px;
                margin: 0!important;
                z-index: 3999;
              }
            }
          }
        }
      }
      .data-toolbar,
      .data-table-color-tool {
        z-index: 4001;
      }
    }
  }
  .data-toolbar-popup-wrapper {
    left: 0;
    top: -9999px;
    &:empty {
      display: none;
    }
    .editor-toolbar {
      border-color: transparent;
      .editor-toolbar-content {
        flex-wrap: nowrap;
        .editor-toolbar-group {
          padding: 0 4px;
          border-left: 1px solid #f4f4f5;
          &:first-child {
            border-left: none;
          }
          .toolbar-button {
            white-space: nowrap;
          }
        }
      }
    }
  }
  .data-tooltip {
    z-index: 20000;
  }
  .am-editor-popover-toolbar {
    min-width: auto!important;
    max-width: 100%!important;
    width: auto!important;
    padding: 8px!important;
    z-index: 10000!important;
    .editor-toolbar {
      border-color: transparent;
      .editor-toolbar-content {
        flex-wrap: nowrap;
        .editor-toolbar-group {
          padding: 0 4px;
          border-left-color: #f4f4f5;
          .toolbar-button {
            white-space: nowrap;
          }
        }
      }
    }
  }
  .am-editor-parent--maximize {
    position: static!important;
  }
  .el-form-item {
    &.is-success {
      .el-form-item__content {
        .am-editor {
          border-color: $set-success-color!important;
        }
      }
    }
    &.is-error {
      .el-form-item__content {
        .am-editor {
          border-color: $set-danger-color!important;
        }
      }
    }
  }
</style>
