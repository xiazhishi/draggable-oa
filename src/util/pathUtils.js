const pathUtils = {
  getContextPath: function (path) {
    path = path || ''
    if (!path || path.startsWith('/')) {
      let getContextPath = window['getContextPath']
      if (getContextPath) {
        return getContextPath() + path
      }
    }
    return path
  },
  getHomePath: function () {
    return this.getContextPath('/')
  },
  getRootUrl: function (prop) {
    let location = window.location
    let protocol = prop ? prop.protocol || location.protocol : location.protocol
    let hostname = prop ? prop.hostname || location.hostname : location.hostname
    let port = prop ? prop.port || location.port : location.port
    let url = [protocol, '//', hostname]
    if (port) {
      switch (protocol) {
        case 'http':
          if (port !== 80) {
            url.push(':', port)
          }
          break
        case 'https':
          if (port !== 443) {
            url.push(':', port)
          }
          break
        default:
          url.push(':', port)
          break
      }
    }
    return url.join('')
  },
  getHostUrl: function (prop) {
    return this.getRootUrl(prop) + this.getContextPath()
  }
}

export default pathUtils
