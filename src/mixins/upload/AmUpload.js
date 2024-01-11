import { Request, getExtensionName } from '@aomao/engine'
export default {
  props: {
    uploadConfigUrl: {
      type: String,
      default: '/support/editor/ae/upload/config'
    },
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
    handleBefore (uid, file) {
      const { type, name, size } = file
      // 获取文件后缀名
      const ext = getExtensionName(file)
      // 异步读取文件
      return new Promise(resolve => {
        const fileReader = new FileReader()
        fileReader.addEventListener(
          'load',
          () => {
            const values = {
              file,
              info: {
                // 唯一编号
                uid,
                // Blob格式
                src: fileReader.result,
                // 文件名称
                name,
                // 文件大小
                size,
                // 文件类型
                type,
                // 文件后缀名
                ext
              }
            }
            resolve(values)
          },
          false
        )
        fileReader.addEventListener('error', () => {
          resolve(false)
        })
        fileReader.readAsDataURL(file)
      })
    },
    setCustomUpload (engine) {
      // 重写编辑器中 upload 方法
      engine.request.upload = async (options, files, name = 'file') => {
        const { onBefore, onReady } = options
        // 如果没有任何文件就不处理
        if (files.length === 0) {
          return
        }
        const promiseList = []
        for (let f = 0; f < files.length; f++) {
          const file = files[f]
          // 当前上传文件唯一标识
          const uid = Date.now() + '-' + f
          file.uid = uid
          if (onBefore && (await onBefore(file)) === false) {
            return
          }
          promiseList.push(this.handleBefore(uid, file))
        }
        // 全部文件读取完成后再插入编辑器
        Promise.all(promiseList).then(async (values) => {
          if (values.some((value) => value === false)) {
            engine.messageError('read image failed')
            return
          }
          const files = values
          Promise.all([
            ...files.map(async (v) => {
              return new Promise(async (resolve) => {
                if (onReady) {
                  await onReady(v.info, v.file)
                }
                resolve(true)
              })
            })
          ]).then(() => {
            files.forEach(async (file) => {
              // 处理上传
              this.handleRequestUpload(file.file, options, name)
            })
          })
        })
      }
    },
    handleRequestUpload (file, options, name) {
      this.$store.dispatch('globalRequestHeaders', options.url).then(val => {
        if (val) {
          options.headers = this.$extend(options.headers, val)
        }
        options.onUploading && options.onUploading(file, {percent: 0})
        if (this.preventCustom) {
          this.handleOriginUpload(file, options, name)
        } else {
          this.checkUpload = true
          this.$ajax({
            url: this.uploadConfigUrl,
            method: 'post'
          }).then(response => {
            if (response.data) {
              let config = response.data['config']
              if (config) {
                this.handleCustomUpload(file, options, name, config)
              } else {
                this.handleOriginUpload(file, options, name)
              }
            }
          }, () => {
            this.triggerUploadErr(file, options, '获取上传配置失败')
          }).finally(() => {
            this.checkUpload = false
          })
        }
      }).catch(() => {
        this.triggerUploadErr(file, options, '全局参数获取失败')
      })
    },
    handleOriginUpload (file, options, name) {
      Request.prototype.upload(options, [file], name)
        .then(() => {})
        .catch(() => {})
    },
    handleCustomUpload (file, options, name, config) {
      if (this.customUpload) {
        this.customUpload(file, {
          onProgress: e => {
            options.onUploading && options.onUploading(file, e)
          },
          onSuccess: data => {
            options.onSuccess && options.onSuccess({
              result: true,
              data
            }, file)
          },
          onError: err => {
            options.onError && options.onError(err, file)
          }
        }, config)
      } else {
        this.triggerUploadErr(file, options, '未配置自定义上传')
      }
    },
    triggerUploadErr (file, options, errMsg) {
      options.onError && options.onError(new Error(errMsg), file)
      this.$nextTick(() => {
        this.$message.error(errMsg)
      })
    }
  }
}
