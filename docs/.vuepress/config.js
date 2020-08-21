const themeConfig = require('./themeConfig/index.js')
const head = require('./themeConfig/htmlHeader.js')

module.exports = {
  title: '小木子的博客',
  description: 'jessie打怪升级之路',
  theme: 'reco',
  themeConfig,
  head,
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      platform: 'github-v4', //v3的platform是github，v4的是github-v4
      locale: 'zh', //语言
      // 其他的 Vssue 配置
      owner: 'jessie975', //github账户名
      repo: 'blog', //github一个项目的名称
      clientId: '26efc01bddb8550d493f',//注册的Client ID
      clientSecret: '6d405fe58dd2982e765883a326d66d37514c374c',//注册的Client Secret
      autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
    },
  }
}