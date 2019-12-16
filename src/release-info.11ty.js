class ReleaseInfo {
    data() {
      return { permalink: 'release-info.js' }
    }
  
    render() {
        let version = require('../package.json').version
        return `const releaseVersion = '${version}'`
    }
  }
  
  module.exports = ReleaseInfo
