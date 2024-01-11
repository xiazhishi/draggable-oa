export default {
  hasValue: function (val) {
    return val !== 'undefined' && val != null && val !== ''
  },
  toString: function (val) {
    if (this.hasValue(val)) {
      return `${val}`
    } else {
      return ''
    }
  }
}
