--- 
title: item2 + oh-my-zsh 打造个性化终端
date: 2020-04-21 10:54:11
sidebar: 'auto'
categories: 
 - 前端那些事儿
tags: 
 - 工具
publish: true
---

作为一名爱折腾的前端攻城狮，终端是我们经常会用到的工具，Mac自带的终端不怎么好看，所以我们可以用item2 + oh-my-zsh来打造一个自己喜欢的终端，这是我最终实现的效果：

![pic1](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge1cwfek96j312a0u0k08.jpg)

## 下载item2

官网下载：[https://www.iterm2.com/](https://www.iterm2.com/)  

安装完成后，在/bin目录下会多出一个zsh的文件，Mac系统默认使用dash作为终端，可以使用`chsh -s /bin/zsh`命令修改默认使用zsh。  

item2最初的样子并不怎么好看，接下来我们就用oh-my-zsh来美化一下它吧~关于他们两者的关系我是这样理解的，item2是一个终端的应用程序，oh-my-zsh是一个终端的主题库，里面有很多主题任我们挑选  

## 安装oh-my-zsh

首先你可以先试一下这个命令:  

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

但是百分之80会报这个错：  

```
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

那如何解决这个问题呢，我试了两种方法：  

### 报错解决方案一：需要fq

- 第一步：在浏览器输入这个地址：[https://raw.githubusercontent.com/Homebrew/install/master/install](https://raw.githubusercontent.com/Homebrew/install/master/install)  
- 第二步：把这个网页保存名为brew_install.rb的文件，保存的位置你随便，只要自己能找到
- 第三步：终端输入curl，如果提示`curl: try 'curl --help' or 'curl --manual' for more information`便是正常的
- 第四步：进入存放brew_install.rb的目录，执行命令`ruby brew_install.rb`
- 最后再执行最开始的命令安装homebrew即可

### 报错解决方案二：比较麻烦但不用fq

- 首先打开[这个网址](https://www.ipaddress.com/)，输入`raw.githubusercontent.com`查询一下对应的IP地址

![pic2](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge187zx011j30qc074jt8.jpg)   

- 然后右击访达，找到**前往文件夹**，然后输入`/etc`，点击前往找到host目录，拷贝一份到桌面，命名为hosts，然后双击进行编辑，在底部添加一行：`199.232.28.133    raw.githubusercontent.com`  

![pic3](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge18cfcizpj30xe0badj1.jpg)  

- 然后放回原来的/etc文件夹中替换原来的hosts文件  

- 最后再执行: `sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`安装homebrew，出现这样的界面就说明安装成功了  

![pic4](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge18f7me1qj311o0n2tro.jpg)  

> 如果这两种办法试了都没成功，推荐阅读[这篇文章](https://www.jianshu.com/p/c2e829027b0a)

## 个性化配置

前面两步都准备好之后，大家就可以通过自己调整一些参数来配置自己的终端了

### 主题

oh-my-zsh提供了很多主题，可以进入.oh-my-zsh -> themes查看  

![pic5](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge18ns7ypvj316c0u01ky.jpg)

各个主题的效果看这里：[https://github.com/ohmyzsh/ohmyzsh/wiki/Themes](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)  

我选用的是**agnoster**这个主题，想要哪个主题就将`.zshrc`文件中的**ZSH_THEME**字段替换成相应的主题名即可，
然后再进入item2的Preferences -> Profiles修改相应的参数达到自己想要的效果，另外如果选用了agnoster这个主题你可能会遇到这样的情况：  
![pic6](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge1d804bw6j30bo01474k.jpg)  

那么只需要将profiles的text字段的use built-in Powerline glyphs勾选上即可，如下图：  

![pic7](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge1d9gpoaij31cx0u0tnc.jpg)  

### 名称

终端默认的配置名字是**电脑名@主机名**，如果不想要这样的命名可以按照如下方式进行修改：  

在`.zshrc`文件最后新增如下内容：  

```
prompt_context() {
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
  fi
}
```

这样显示的就可以自定义名字了，如果你想像我一样在名字前面随机添加一些emoji表情的话可以这样写：  

```
prompt_context() {
  emojis=("⚡️" "🔥" "💀" "👑" "😎" "🐸" "🐵" "🦄" "🌈" "🍻" "🚀" "💡" "🎉" "🔑" "🚦" "🌙")
  RAND_EMOJI_N=$(( $RANDOM % ${#emojis[@]} + 1))
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)${emojis[$RAND_EMOJI_N]} $USER"
  fi
}
```  

### 背景

可以在[创客贴](https://www.chuangkit.com/designtools/designindex)上制作自己喜欢的背景图，然后iTerm2 -> Preferences -> Profiles -> Window -> BackGround Image勾选图片即可  

## 最后

至此我们的个性化终端就差不多做好啦，可以自己多尝试下Preferences -> Profiles里面的参数，希望各位也能做出自己喜欢的终端哦~