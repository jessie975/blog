--- 
title: Charles
date: 2019-10-20 16:27:20
sidebar: 'auto'
categories: 
 - 工具
tags: 
 - 工具
publish: true
---
## 通过charles调试线上代码(客户端)

1、 安装好Charles后，在菜单栏勾选『Proxy -> macOS Proxy』，macOS系统HTTP/HTTPS代理将会被自动设置为本地代理，默认端口8888。

2、 打开网络设置，配置如下：
![网络设置](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u8yaasjwj30l00hqaei.jpg)

3、 访问HTTP数据链接，可以开始抓取HTTP包。

4、 开发者工具Sources面板找到想要修改的js文件，保存到本地，在Network面板找到该文件对应的路径，复制  
![文件路径](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u93nwcn0j30hw04paai.jpg)

5、 打开charles，在菜单栏勾选『Tools -> Map Local -> add』,将线上js映射到本地,**http默认端口80**

![tools配置](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u9caog3gj30qe0nsq5b.jpg)

6、 修改本地文件刷新浏览器即可看到修改效果  
注意：测试修改是否成功应该选择本地的文字测试(!!)

另外：如果需要抓取https包需要添加证书
添加步骤：

- 点击 Charles菜单下 Help -> SSL Proxying -> Install Charles Root Certifacate 选择添加
- 从应用钥匙串访问搜索Charles，找到添加的证书，双击证书，在信任下选择始终信任
