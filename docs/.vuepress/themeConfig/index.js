const nav = require('./nav.js')
// const valineConfig = require('./valineConfig.local.js')

module.exports = {
  GAID: 'UA-151386963-1',
  sidebar: 'auto',
  sidebarDepth: 1,
  type: 'blog',
  noFoundPageByTencent: false,
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
