import Ajax from 'element-ui/packages/upload/src/ajax'
export default {
  props: {
    // 自定义上传
    customUpload: Function,
    // 强制使用本地上传
    preventCustom: Boolean
  },
  data () {
    return {
      checkUpload: false
    }
  },
  methods: {
    handleOriginUpload (options) {
      Ajax(options)
    },
    handleCustomUpload (options, config) {
      if (this.customUpload) {
        this.customUpload(options.file, {
          onProgress: e => {
            options.onProgress && options.onProgress(e)
          },
          onSuccess: data => {
            options.onSuccess && options.onSuccess({
              responseCode: 'SUCCESS',
              ...data,
              imageName: data.name,
              imageUrl: data.url,
              fileName: data.name,
              fileUrl: data.url
            })
          },
          onError: err => {
            options.onError && options.onError(err)
          }
        }, config)
      } else {
        this.triggerUploadErr(options, '未配置自定义上传')
      }
    },
    httpRequest (options, prevent) {
      this.$store.dispatch('globalRequestHeaders', options.action).then(val => {
        if (val) {
          options.headers = this.$extend(options.headers, val)
        }
        if (this.preventCustom || prevent) {
          this.handleOriginUpload(options)
        } else {
          this.checkUpload = true
          this.$ajax({
            url: '/support/baseUpload/config',
            method: 'post',
            data: this.$qs.stringify({
              url: options.action
            })
          }).then(response => {
            if (response.data) {
              let config = response.data['config']
              if (config) {
                this.handleCustomUpload(options, config)
              } else {
                this.handleOriginUpload(options)
              }
            }
          }, () => {
            this.triggerUploadErr(options, '获取上传配置失败')
          }).finally(() => {
            this.checkUpload = false
          })
        }
      }).catch(() => {
        this.triggerUploadErr(options, '全局参数获取失败')
      })
    },
    triggerUploadErr (options, errMsg) {
      options.onError && options.onError(new Error(errMsg))
      this.$nextTick(() => {
        this.$message.error(errMsg)
      })
    }
  }
}
