const nav = require('./nav.js')
// const valineConfig = require('./valineConfig.local.js')

module.exports = {
  GAID: '',
  sidebar: 'auto',
  sidebarDepth: 1,
  type: 'blog',
  noFoundPageByTencent: false,
  sidebarDepth: 1,
  author: 'jessie',
  logo: '',
  nav,
  // valineConfig,
  blogConfig: {
    category: {
      location: 2,
      text: "分类"
    },
    tag: {
      location: 3,
      text: "标签"
    }
  }
};
