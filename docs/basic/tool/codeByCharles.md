--- 
title: Charles抓包(MAC系统)
date: 2019-10-20 16:27:20
sidebar: 'auto'
categories: 
 - 前端那些小事儿
tags: 
 - 工具
publish: true
---
## 抓电脑包

1、 安装好Charles后，在菜单栏勾选『Proxy -> macOS Proxy』，macOS系统HTTP/HTTPS代理将会被自动设置为本地代理，默认端口8888。

2、 打开网络设置，配置如下：
![网络设置](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u8yaasjwj30l00hqaei.jpg)

3、 访问HTTP数据链接，可以开始抓取HTTP包。

## 调试线上代码

1、 开发者工具Sources面板找到想要修改的js文件，保存到本地，在Network面板找到该文件对应的路径，复制  
![文件路径](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u93nwcn0j30hw04paai.jpg)

2、 打开charles，在菜单栏勾选『Tools -> Map Local -> add』,将线上js映射到本地,**http默认端口80**

![tools配置](https://tva1.sinaimg.cn/large/006y8mN6ly1g7u9caog3gj30qe0nsq5b.jpg)

3、 修改本地文件刷新浏览器即可看到修改效果  
注意：测试修改是否成功应该选择本地的文字测试!!

另外：如果需要抓取https包需要添加证书
添加步骤：

- 点击 Charles菜单下 Help -> SSL Proxying -> Install Charles Root Certifacate 选择添加
- 从应用钥匙串访问搜索Charles，找到添加的证书，双击证书，在信任下选择始终信任

## 抓手机包

1、设置透明代理：『Proxy -> Proxy Settings... -> 端口8888 -> 勾选Enable tansparent HTTP proxying』

![透明代理](https://tva1.sinaimg.cn/large/006tNbRwgy1gapfi6hu09j30wu0s4goi.jpg)

2、设置 ssl代理设置 『Proxy ->  SSL Proxying Settings... -> Add -> Host：*  Port：443』

![ssl代理](https://tva1.sinaimg.cn/large/006tNbRwgy1gavaqtfp9jj31ea0u07wh.jpg)

3、设置手机代理：系统偏好设置 -> 网络 -> 找到IP地址  或者直接在终端输入ifconfig就可查看IP地址。手机端进入设置，进入连接的WIFI，选择手动代理，将刚刚记录的IP地址填写到『代理服务端主机名』，端口号为刚刚填写的『8888』

4、设置电脑端SSL代理：『Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile device or remote browser』

5、在手机端安装证书：在浏览器中输入：chls.pro/ssl ,下载证书，进行安装

6、访问app即可进行抓包

另外也可以通过**HttpCanary**在手机端进行抓包，一键操作，非常方便~

祝大家抓包愉快~
