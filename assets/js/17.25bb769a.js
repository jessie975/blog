(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{348:function(t,e,r){"use strict";r.r(e);var s=r(0),a=Object(s.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("p",[t._v("一直以来都只是知道https比http安全，但对它为什么比http安全却不得而知，这次就来彻底学习一下吧~")]),t._v(" "),r("h2",{attrs:{id:"http"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#http"}},[t._v("#")]),t._v(" HTTP")]),t._v(" "),r("p",[t._v("http（超文本传输协议）位于TCP/IP四层模型中的应用层，四层模型分别为（应用层：HTTP/FTP、传输层：TCP/UDP、网络层：IP/ARP、数据链路层）")]),t._v(" "),r("p",[t._v("使用http协议进行的通信是明文传输，因此如果信息被中间人劫持了后果就不堪设想了，这就是"),r("strong",[t._v("中间人攻击")]),t._v("，例如：")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8etlyyol3j30wk0dugmp.jpg",alt:"中间人攻击"}})]),t._v(" "),r("p",[t._v("为了解决这一问题，我们可以用"),r("strong",[t._v("对称加密")]),t._v("和"),r("strong",[t._v("非对称加密")]),t._v("两种加密方式对明文进行加密")]),t._v(" "),r("p",[r("strong",[t._v("对称加密")]),r("br"),t._v("\n对称加密算法的特点: 算法公开、计算量小、加密速度快、加密效率高，但由于通信双方使用的是"),r("strong",[t._v("同一密钥")]),t._v("，所以安全性得不到保证。常见的算法有DES、AES等。\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8ev6h6mxuj30lk0d2jt6.jpg",alt:"对称加密"}}),t._v("\n如图所示，如果双方的通信一开始就被劫持了，那中间人就可以用劫持到的密钥随意的解开双方间的通信，所以我们可以用非对称加密将这个密钥加密一下。")]),t._v(" "),r("p",[r("strong",[t._v("非对称加密")]),r("br"),t._v("\n非对称加密使用一对"),r("strong",[t._v("私钥 - 公钥")]),t._v("，因为两者是成对出现的，即一个公钥有且只有一个对应的密钥，所以用公钥加密的信息只有对应的私钥才能解开，反之亦然。非对称加密不需要共享同一份秘钥，安全性要比对称加密高，但由于算法强度比对称加密复杂，加解密的速度比对称加解密的速度要慢。常见的非对称加密有 RSA、ESA、ECC 等。\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8evl6u0spj30qc0d4ab8.jpg",alt:"非对称加密"}}),t._v("\n解释一下:\n在第三步中，客户端随机生成了一个密钥key2，并且用服务端传过来的key1对其进行加密一下传给服务端，因为服务端有这个公钥key1对应的私钥，所以可以得到客户端生成的key2，这样双方都有key2了，所以后续的通信双方就可以用key2对信息进行加密来通信了。所以在这一步中即使中间人劫持到了公钥key1，但是他没有私钥所以是无法解开key2的。")]),t._v(" "),r("p",[t._v("但是......如果中间人在第二步的时候将公钥修改成自己的公钥key3，并且他拥有key3的私钥，当客户端将自己的key2通过中间人的key3发送给服务端的时候又被中间人劫持到了，中间人就可以用自己的私钥解开key2，并装作若无其事的用之前劫持到的key1加密key2发送给服务端，这时候三方都有了用于对称加密的key2......有点绕，看图吧~")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8exm835b8j30ww0ggwft.jpg",alt:"狡猾的中间人"}})]),t._v(" "),r("p",[t._v("所以这时候"),r("strong",[t._v("HTTPS")]),t._v("就应运而生了~")]),t._v(" "),r("h2",{attrs:{id:"https"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#https"}},[t._v("#")]),t._v(" HTTPS")]),t._v(" "),r("p",[t._v("HTTPS 即是在 TCP/IP 四层协议的应用层和传输层之间加了一层 SSL/TLS 协议，对于 HTTP 层与 SSL/TLS 间的发送接收数据流程不变，这就很好地兼容了老的 HTTP 协议\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8ezhc2w9zj30rs0cwmzh.jpg",alt:"HTTPS"}})]),t._v(" "),r("p",[t._v("接下来看看HTTPS是怎么确保通信安全的~")]),t._v(" "),r("p",[t._v("第一步：服务端将自己的公钥和一些基本信息给证书颁发机构，证书机构返回给服务端一个证书\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8f04k77cuj31040jagnu.jpg",alt:"证书"}}),t._v("\n第二步：客户端和服务端通信时，客户端要先验证证书的真伪\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8f0rugy5oj312m0hc0vg.jpg",alt:"校验证书"}}),t._v("\n第三步：验证通过后，客户端继续用机构的公钥解密出证书中服务端的公钥key1，用key1来加密自己生成的key2\n"),r("img",{attrs:{src:"https://tva1.sinaimg.cn/large/006y8mN6ly1g8f13mwv2dj30qi0fudhi.jpg",alt:"通信"}}),t._v("\n第四步：服务端key1对应的私钥解密出key2，双方后续便可通过key2愉快的进行通信啦~")]),t._v(" "),r("p",[t._v("备注：摘要算法是通过一定的算法对源文件进行加密，只要源文件不同，计算得到的结果也就不同，但不能把摘要算法看成是加密算法，\n因为加密算法需要用密钥进行加解密，而摘要算法得到的结果是不可逆的，即不能用结果推出源文件")]),t._v(" "),r("p",[t._v("参考链接："),r("br"),t._v(" "),r("a",{attrs:{href:"https://juejin.im/post/5c889918e51d45346459994d",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://juejin.im/post/5c889918e51d45346459994d"),r("OutboundLink")],1),r("br"),t._v(" "),r("a",{attrs:{href:"https://www.jianshu.com/p/ffe8c203a471",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.jianshu.com/p/ffe8c203a471"),r("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=a.exports}}]);