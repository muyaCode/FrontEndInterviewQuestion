# Web开发面试题

[珠峰架构师成长计划——cookie](http://www.zhufengpeixun.com/strong/html/22.cookie.html)

[珠峰架构师成长计划——session](http://www.zhufengpeixun.com/strong/html/23.session.html)

# cookie

HTTP 协议本身是无状态的，而 Cookie 是在 HTTP 中的㇐个请求头，用来保存㇐小块数据，Cookie 会传递到服务端，用来作为会话标识。服务端可以通过
Set-Cookie 来设置 cookie，而客户端网页 也可以通过 document.cookie 来操作 cookie。

### document 操作 cookie

需要问 AI 完善.....

```js
document.cookie;
```

### cookie 的过期控制

cookie 可以通过 max-age 和 expires 控制过期时间，如果不设置过期时间，cookie 会在浏览器完全关闭时失效。

### 防止 cookie 被 javascript 脚本操作

可以在 Set-Cookie 时使用 HttpOnly 控制。㇐定程度上缓解 XSS 攻击

### 服务端 Set-Cookie

㇐个 Set-Cookie 也只能设置㇐个 cookie，如果需要设置多个，则返回多个 Set-Cookie 头。

Set-Cookie 和 document.cookie 操作类似，但是要注意两个选项，分别是 HttpOnly 和 SameSite， HttpOnly 在上㇐小节说过了。SameSite 则是预防 CSRF 攻击的㇐种手段，允许服务器要求某个 cookie 在跨站请求时不会被发送。

● SameSite=Strict：跨站请求时，不携带 cookie。
● SameSite=Lax：宽松的，跨站请求时，也不会携带 cookie。但是从外部站点导航到本站点时会携带 cookie。Lax 是高版本 Chrome（80 版本以上）的
默认设置。

Lax 保证了这种场景可用：比如你在 github 已经登录过了，现在希望通过另外㇐个网站的链接跳转到 github，并且能保持 gitlab 的登录态，就需要用到
Lax。而 Strict 会阻止这㇐行为，这可能会 要求你重新登录 github。

● SameSite=None：不做限制，跨站请求时，会携带 cookie。使用 SameSite=None 时，需要配合 Secure 使用，也就是要求 Https 协议下才能使用 None。

### 跨站 cookie

恶意的跨站传递 cookie

在被恶意注入的情况下（比如 XSS），就可能导致本站点的 cookie 泄露。比如㇐个论坛留⾔板块，被 XSS 注入了㇐段脚本，脚本会动态加载㇐张图片，图片的地址可能是⿊客服务。

这样㇐来，只要用户打开留⾔板块，自己的 cookie 信息就泄露了，就有可能被⿊客冒充身份，造成损失。

### 业务需要的共享 cookie

为了满足类似于单点登录这样的功能，我们在统㇐认证平台 authgateway.myenterprise.com 登录后，希望公司内部另㇐个站点 other.myenterprise.com 也能共享这种登录状态。那么服务器端在 authgateway.myenterprise.com 登录成功后，应该 Set-Cookie 时将 domain 部分设置为 myenterprise.com，这样 myenterprise.com 的各个子域名才能共享登录状态。

但是这样也有⻛险，㇐旦某个子站被 XSS，就有可能全部被攻击（Cookie 作用域攻击）。最好启用全站 HTTPS+Secure，也必须适当缩小 cookie 的作用域
（限制 domain 和 path）。

### cookie 篡改

这个就很好理解了，document.cookie 是可以操作 cookie 的，这就留下了㇐些隐患，对于关键 cookie 信息，必须启用 HttpOnly 防护。

### cookie 劫持

如果没有 HTTPS 证书的保障，cookie 也是明文传输，相当于裸奔。除了 XSS 攻击劫持 cookie，攻击者还可以通过中间⼈攻击获取 HTTP 报文中的
cookie。对于这些劫持情况，应该对 cookie 加密/ 签名或者采用 Https 防范！强缓存和协商缓存

### cookie 和 session 的区别，localstorage 和 sessionstorage 的区别

参考回答：

Cookie 和 session 都可用来存储用户信息，cookie 存放于客户端，session 存放于服务器端，因为 cookie 存放于客户端有可能被窃取，所以 cookie 一般用来存放不敏感的信息，比如用户设置的网站主题，敏感的信息用 session 存储，比如用户的登陆信息，session 可以存放于文件，数据库，内存中都可以，cookie 可以服务器端响应的时候设置，也可以客户端通过 JS 设置 cookie 会在请求时在 http 首部发送给客户端，cookie 一般在客户端有大小限制，一般为 4K，

### 下面从几个方向区分一下 cookie，localstorage，sessionstorage 的区别

1、生命周期：

- Cookie：可设置失效时间，否则默认为关闭浏览器后失效
- Localstorage:除非被手动清除，否则永久保存
- Sessionstorage：仅在当前网页会话下有效，关闭页面或浏览器后就会被清除

2、存放数据：

- Cookie：4k 左右
- Localstorage 和 sessionstorage：可以保存 5M 的信息

3、http 请求：

- Cookie：每次都会携带在 http 头中，如果使用 cookie 保存过多数据会带来性能问题
- 其他两个：仅在客户端即浏览器中保存，不参与和服务器的通信

4、易用性：

- Cookie：需要程序员自己封装，原生的 cookie 接口不友好
- 其他两个：即可采用原生接口，亦可再次封装

5、应用场景：

从安全性来说，因为每次 http 请求都回携带 cookie 信息，这样子浪费了带宽，所以 cookie 应该尽可能的少用，此外 cookie 还需要指定作用域，不可以跨域调用，限制很多，但是用户识别用户登陆来说，cookie 还是比 storage 好用，其他情况下可以用 storage，localstorage 可以用来在页面传递参数，sessionstorage 可以用来保存一些临时的数据，防止用户刷新页面后丢失了一些参数。

Cookie、sessionStorage、localStorage 的区别

::: details 查看参考回答

参考回答：

共同点：都是保存在浏览器端，并且是同源的

Cookie：cookie 数据始终在同源的 http 请求中携带（即使不需要），即 cookie 在浏览器和服务器间来回传递。而 sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。cookie 数据还有路径（path）的概念，可以限制 cookie 只属于某个路径下,存储的大小很小只有 4K 左右。（key：可以在浏览器和服务器端来回传递，存储容量小，只有大约 4K 左右）

sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持，localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；

cookie 只在设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭。（key：本身就是一个回话过程，关闭浏览器后消失，session 为一个回话，当页面不同即使是同一页面打开两次，也被视为同一次回话）

localStorage：localStorage 在所有同源窗口中都是共享的；cookie 也是在所有同源窗口中都是共享的。（key：同源窗口都会共享，并且不会失效，不管窗口或者浏览器关闭与否都会始终生效）

#### 补充说明一下 cookie 的作用：

##### 保存用户登录状态

例如将用户 id 存储于一个 cookie 内，这样当用户下次访问该页面时就不需要重新登录了，现在很多论坛和社区都提供这样的功能。 cookie 还可以设置过期时间，当超过时间期限后，cookie 就会自动消失。因此，系统往往可以提示用户保持登录状态的时间：常见选项有一个月、三个 月、一年等。

##### 跟踪用户行为

例如一个天气预报网站，能够根据用户选择的地区显示当地的天气情况。如果每次都需要选择所在地是烦琐的，当利用了 cookie 后就会显得很人性化了，
系统能够记住上一次访问的地区，当下次再打开该页面时，它就会自动显示上次用户所在地区的天气情况。因为一切都是在后 台完成，所以这样的页面就像为某个用户所定制的一样，使用起来非常方便定制页面。如果网站提供了换肤或更换布局的功能，那么可以使用 cookie 来记录用户的选项，例如：背景色、分辨率等。当用户下次访问时，仍然可以保存上一次访问的界面风格。

:::

# 待定

### cookie 和 token 都存放在 header 中，为什么不会劫持 token？

参考答案：

由于浏览器会自动发送 cookie 到服务器，因此攻击者可以利用这种特点进行 csrf 攻击。

而通常 token 是不放到 cookie 中的，需要浏览器端使用 JS 自行保存到 localstorage 中，在请求时也需要手动的加入到请求头中，因此不容易引发 csrf 攻击。

### 介绍下如何实现 token 加密

参考答案：

以最常见的 token 格式 jwt 为例, token 分为三段，分别是 header、payload、signature。 其中，header 标识签名算法和令牌类型；payload 标识主体信息，包含令牌过期时间、发布时间、发行者、主体内容等；signature 是使用特定的算法对前面两部分进行加密，得到的加密结果。

token 有防篡改的特点，如果攻击者改动了前面两个部分，就会导致和第三部分对应不上，使得 token 失效。而攻击者不知道加密秘钥，因此又无法修改第三部分的值。

所以，在秘钥不被泄露的前提下，一个验证通过的 token 是值得被信任的。

### 说下单点登录

参考答案：

SSO 一般都需要一个独立的认证中心（passport），子系统的登录均得通过 passport，子系统本身将不参与登录操作，当一个系统成功登录以后，passport 将会颁发一个令牌给各个子系统，子系统可以拿着令牌会获取各自的受保护资源，为了减少频繁认证，各个子系统在被 passport 授权以后，会建立一个局部会话，在一定时间内可以无需再次向 passport 发起认证。

**具体流程是**：

- 用户访问系统 1 的受保护资源，系统 1 发现用户未登录，跳转至 sso 认证中心，并将自己的地址作为参数
- sso 认证中心发现用户未登录，将用户引导至登录页面
- 用户输入用户名密码提交登录申请
- sso 认证中心校验用户信息，创建用户与 sso 认证中心之间的会话，称为全局会话，同时创建授权令牌
- sso 认证中心带着令牌跳转会最初的请求地址（系统 1）
- 系统 1 拿到令牌，去 sso 认证中心校验令牌是否有效
- sso 认证中心校验令牌，返回有效，注册系统 1
- 系统 1 使用该令牌创建与用户的会话，称为局部会话，返回受保护资源
- 用户访问系统 2 的受保护资源
- 系统 2 发现用户未登录，跳转至 sso 认证中心，并将自己的地址作为参数
- sso 认证中心发现用户已登录，跳转回系统 2 的地址，并附上令牌
- 系统 2 拿到令牌，去 sso 认证中心校验令牌是否有效
- sso 认证中心校验令牌，返回有效，注册系统 2
- 系统 2 使用该令牌创建与用户的局部会话，返回受保护资源

### 文件上传如何做断点续传（网易）

参考答案：

客户端将文件的二进制内容进行分片，每片数据按顺序进行序号标识，上传每片数据时同时附带其序号。服务器接收到每片数据时，将其保存成一个临时文件，并记录每个文件的 hash 和序号。

若上传中止，将来再次上传时，可以向服务器索要已上传的分片序号，客户端仅需上传剩余分片即可。

当全部分片上传完成后，服务器按照分片的顺序组装成完整的文件，并删除分片文件。

### cookie/sessionStorage/localStorage 的区别

参考答案：

cookie、sessionStorage、localStorage 都是保存本地数据的方式

其中，cookie 兼容性较好，所有浏览器均支持。浏览器针对 cookie 会有一些默认行为，比如当响应头中出现 set-cookie 字段时，浏览器会自动保存 cookie 的值；再比如，浏览器发送请求时，会附带匹配的 cookie 到请求头中。这些默认行为，使得 cookie 长期以来担任着维持登录状态的责任。与此同时，也正是因为浏览器的默认行为，给了恶意攻击者可乘之机，CSRF 攻击就是一个典型的利用 cookie 的攻击方式。虽然 cookie 不断的改进，但前端仍然需要另一种更加安全的保存数据的方式。

HTML5 新增了 sessionStorage 和 localStorage，前者用于保存会话级别的数据，后者用于更持久的保存数据。浏览器针对它们没有任何默认行为，这样一来，就把保存数据、读取数据的工作交给了前端开发者，这就让恶意攻击者难以针对登录状态进行攻击。

cookie 的大小是有限制的，一般浏览器会限制同一个域下的 cookie 总量为 4M，而 sessionStorage 和 localStorage 则没有限制

cookie 会与 domain、path 关联，而 sessionStorage 和 localStorage 只与 domain 关联

### session 怎么消除

参考答案：

#### 1.过期时间

当客户端长时间没有传递 sessionid 过来时，服务器可以在过期时间之后自动清除 session

#### 2.客户端主动通知

可以使用 JS 监听客户端页面关闭或其他退出操作，然后通知服务器清除 session

### cookie 和 session

- session ： 是一个抽象概念，开发者为了实现中断和继续等操作，将 user agent 和 server 之间一对一的交互，抽象为“会话”，进而衍生出“会话状态”，也就是 session 的概念
- cookie ：它是一个世纪存在的东⻄， http 协议中定义在 header 中的字段，可以认为是 session 的一种后端无状态实现

现在我们常说的 session ，是为了绕开 cookie 的各种限制，通常借助 cookie 本身和后端存储实现的，一种更高级的会话状态实现

session 的常见实现要借助 cookie 来发送 sessionID

### cookie 有哪些字段可以设置

**考察点：cookie**

::: details 查看参考回答

name 字段为一个 cookie 的名称。

value 字段为一个 cookie 的值。

domain 字段为可以访问此 cookie 的域名。

非顶级域名，如二级域名或者三级域名，设置的 cookie 的 domain 只能为顶级域名或者二级域名或者三级域名本身，不能设置其他二级域名的 cookie，否则 cookie 无法生成。

顶级域名只能设置 domain 为顶级域名，不能设置为二级域名或者三级域名，否则 cookie 无法生成。

二级域名能读取设置了 domain 为顶级域名或者自身的 cookie，不能读取其他二级域名 domain 的 cookie。所以要想 cookie 在多个二级域名中共享，需要设置 domain 为顶级域名，这样就可以在所有二级域名里面或者到这个 cookie 的值了。

顶级域名只能获取到 domain 设置为顶级域名的 cookie，其他 domain 设置为二级域名的无法获取。

path 字段为可以访问此 cookie 的页面路径。 比如 domain 是 abc.com,path 是/test，那么只有/test 路径下的页面可以读取此 cookie。

expires/Max-Age 字段为此 cookie 超时时间。

若设置其值为一个时间，那么当到达此时间后，此 cookie 失效。不设置的话默认值是 Session，意思是 cookie 会和 session 一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此 cookie 失效。

Size 字段 此 cookie 大小。

http 字段 cookie 的 httponly 属性。若此属性为 true，则只有在 http 请求头中会带有此 cookie 的信息，而不能通过 document.cookie 来访问此 cookie。

secure 字段 设置是否只能通过 https 来传递此条 cookie

:::

### cookie 有哪些编码方式？

**考察点：cookie**

::: details 查看参考回答

encodeURI（）

:::

### 除了 cookie，还有什么存储方式。说说 cookie 和 localStorage 的区别

**考察点：浏览器存储**

::: details 查看参考回答

还有 localStorage，sessionStorage，indexdDB 等 cookie 和 localStorage 的区别：

cookie 数据始终在同源的 http 请求中携带(即使不需要)，即 cookie 在浏览器和服务器间来回传递

cookie 数据还有路径（path）的概念，可以限制。cookie 只属于某个路径下

存储大小限制也不同，cookie 数据不能超过 4K，同时因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如回话标识。

localStorage 虽然也有存储大小的限制，但是比 cookie 大得多，可以达到 5M 或更大

localStorage 始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie 只在设置的 cookie 过期时间之前一直有效，即使窗口和浏览器关闭。

:::

### cookie 和 session 的区别

**考察点：cookie**

::: details 查看参考回答

1、 cookie 数据存放在客户的浏览器上，session 数据放在服务器上。

2、 cookie 不是很安全，别人可以分析存放在本地的 COOKIE 并进行 COOKIE 欺骗考虑到安全应当使用 session。

3、 session 会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用 COOKIE。

4、 单个 cookie 保存的数据不能超过 4K，很多浏览器都限制一个站点最多保存 20 个 cookie。

5、HTTP 是一个无状态协议，因此 Cookie 的最大的作用就是存储 sessionId 用来唯一标识用户

:::

### sessionStorage，localStorage 和 cookie 的区别

1. 共同点：都是保存在浏览器端，且同源的
2. 区别:

- cookie 始终在同源的 http 请求中携带（即使不需要），即 cookie 在浏览器和服务器之间来回传递；而 sessionStorage 和 localStorage 不会自动把数据发送到服务器，仅在本地保存。cookie 还有路径（path）的概念，可以限制 cookie 只属于某个路径下。
- 存储大小限制不同。cookie 不能超过 4K，因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如：会话标识。sessionStorage 和 localStorage 虽然也有存储大小限制，但比 cookie 大得多，可以达到 5M 或更大。
- 数据有效期不同。sessionStorage 仅在当前浏览器窗口关闭之前有效；localStorage 始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie 只在设置的 cookie 过期时间之前有效。
- 作用域不同。sessionStorage 不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 和 cookie 在所有同源窗口中都是共享的。

### cookie 和 session 的区别，localstorage 和 sessionstorage 的区别

::: details 查看参考回答

Cookie 和 session 都可用来存储用户信息，cookie 存放于客户端，session 存放于服务器端，因为 cookie 存放于客户端有可能被窃取，所以 cookie 一般用来存放不敏感的信息，比如用户设置的网站主题，敏感的信息用 session 存储，比如用户的登陆信息，session 可以存放于文件，数据库，内存中都可以，cookie 可以服务器端响应的时候设置，也可以客户端通过 JS 设置 cookie 会在请求时在 http 首部发送给客户端，cookie 一般在客户端有大小限制，一般为 4K，

下面从几个方向区分一下 cookie，localstorage，sessionstorage 的区别

1、生命周期：

- Cookie：可设置失效时间，否则默认为关闭浏览器后失效
- Localstorage:除非被手动清除，否则永久保存
- Sessionstorage：仅在当前网页会话下有效，关闭页面或浏览器后就会被清除

2、存放数据：

- Cookie：4k 左右
- Localstorage 和 sessionstorage：可以保存 5M 的信息

3、http 请求：

- Cookie：每次都会携带在 http 头中，如果使用 cookie 保存过多数据会带来性能问题
- 其他两个：仅在客户端即浏览器中保存，不参与和服务器的通信

4、易用性：

- Cookie：需要程序员自己封装，原生的 cookie 接口不友好
- 其他两个：即可采用原生接口，亦可再次封装

5、应用场景：

从安全性来说，因为每次 http 请求都回携带 cookie 信息，这样子浪费了带宽，所以 cookie 应该尽可能的少用，此外 cookie 还需要指定作用域，不可以跨域调用，限制很多，但是用户识别用户登陆来说，cookie 还是比 storage 好用，其他情况下可以用 storage，localstorage 可以用来在页面传递参数，sessionstorage 可以用来保存一些临时的数据，防止用户刷新页面后丢失了一些参数。

:::

### 对 Cookie 了解多少？

#### Cookie 简介

HTTP 是一个无状态的协议，每次 http 请求都是独立、无关的，默认不需要保留状态信息。但有时候需要保存一些状态，怎么办呢？

HTTP 为此引入了 Cookie。Cookie 本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储(在 chrome 开发者面板的 Application 这一栏可以看到)。向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。而服务端可以通过响应头中的 Set-Cookie 字段来对客户端写入 Cookie 。举例如下:

#### Cookie 属性

##### 1）生存周期

Cookie 的有效期可以通过 Expires 和 Max-Age 两个属性来设置。

- Expires 即 过期时间
- Max-Age 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

##### 2）作用域

关于作用域也有两个属性: Domain 和 path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说， `/` 表示域名下的任意路径都允许使用 Cookie。

##### 3）安全相关

如果带上 Secure ，说明只能通过 HTTPS 传输 cookie。

如果 cookie 字段带上 HttpOnly ，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。

相应的，对于 CSRF 攻击的预防，也有 SameSite 属性。

SameSite 可以设置为三个值， Strict 、 Lax 和 None 。

a. 在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 sanyuan.com 网站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。

b. 在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单 况或者 a 标签发送 get 请求 的情况下可以携带 Cookie，其他情况均不能。

c. 在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。

#### Cookie 的缺点

- 1）容量缺陷。Cookie 的体积上限只有 4KB ，只能用来存储少量的信息。
- 2）性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过 Domain 和 Path 指定作用域来解决。
- 3）安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在 HttpOnly 为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

### websocket 和 ajax 的区别是什么，websocket 的应用场景有哪些

**考察点：计算机网络**

::: details 查看参考回答

WebSocket 的诞生本质上就是为了解决 HTTP 协议本身的单向性问题：请求必须由客户端向服务端发起，然后服务端进行响应。这个 Request-Response 的关系是无法改变的。对于一般的网页浏览和访问当然没问题，一旦我们需要服务端主动向客户端发送消息时就麻烦了，因为此前的 TCP 连接已经释放，根本找不到客户端在哪。

为了能及时从服务器获取数据，程序员们煞费苦心研究出来的各种解决方案其实都是在 HTTP 框架下做的妥协，没法子，浏览器这东西只支持 HTTP，我们有什么办法。所以大家要么定时去轮询，要么就靠长连接——客户端发起请求，服务端把这个连接攥在手里不回复，等有消息了再回，如果超时了客户端就再请求一次——其实大家也懂，这只是个减少了请求次数、实时性更好的轮询，本质没变。

WebSocket 就是从技术根本上解决这个问题的：看名字就知道，它借用了 Web 的端口和消息头来创建连接，后续的数据传输又和基于 TCP 的 Socket 几乎完全一样，但封装了好多原本在 Socket 开发时需要我们手动去做的功能。比如原生支持 wss 安全访问（跟 https 共用端口和证书）、创建连接时的校验、从数据帧中自动拆分消息包等等。

换句话说，原本我们在浏览器里只能使用 HTTP 协议，现在有了 Socket，还是个更好用的 Socket。

了解了 WebSocket 的背景和特性之后，就可以回答它能不能取代 AJAX 这个问题了：

对于服务器与客户端的双向通信，WebSocket 简直是不二之选。如果不是还有少数旧版浏览器尚在服役的话，所有的轮询、长连接等方式早就该废弃掉。那些整合多种双向推送消息方式的库（如 <http://Socket.IO、SignalR）当初最大的卖点就是兼容所有浏览器版本，自动识别旧版浏览器并采取不同的连接方式，现在也渐渐失去了优势——所有新版浏览器都兼容> WebSocket，直接用原生的就行了。

说句题外话，这点很像 jQuery，在原生 js 难用时迅速崛起，当其他库和原生 js 都吸收了
它的很多优势时，慢慢就不那么重要了。

但是，很大一部分 AJAX 的使用场景仍然是传统的请求-响应形式，比如获取 json 数据、post 表单之类。这些功能虽然靠 WebSocket 也能实现，但就像在原本传输数据流的 TCP 之上定义了基于请求的 HTTP 协议一样，我们也要在 WebSocket 之上重新定义一种新的协议，最少也要加个 request id 用来区分每次响应数据对应的请求吧。

……但是，何苦一层叠一层地造个新轮子呢？直接使用 AJAX 不是更简单、更成熟吗？

另外还有一种情况，也就是传输大文件、图片、媒体流的时候，最好还是老老实实用 HTTP 来传。如果一定要用 WebSocket 的话，至少也专门为这些数据专门开辟个新通道，而别去占用那条用于推送消息、对实时性要求很强的连接。否则会把串行的 WebSocket 彻底堵死的。

所以说，WebSocket 在用于双向传输、推送消息方面能够做到灵活、简便、高效，但在普通的 Request-Response 过程中并没有太大用武之地，比起普通的 HTTP 请求来反倒麻烦了许多，甚至更为低效。

每项技术都有自身的优缺点，在适合它的地方能发挥出最大长处，而看到它的几个优点就不分场合地全方位推广的话，可能会适得其反。

我们自己在开发能与手机通信的互联网机器人时就使用了 WebSocket，效果很好。但并不是用它取代 HTTP，而是取代了原先用于通信的基于 TCP 的 Socket。

优点是：

原先在 Socket 连接后还要进行一些复杂的身份验证，同时要阻止未验证的连接发送控制指令。现在不需要了，在建立 WebSocket 连接的 url 里就能携带身份验证参数，验证不通过可以直接拒绝，不用设置状态；

原先自己实现了一套类似 SSL 的非对称加密机制，现在完全不需要了，直接通过 wss 加密，还能顺便保证证书的可信性；

原先要自己定义 Socket 数据格式，设置长度与标志，处理粘包、分包等问题，现在 WebSocket 收到的直接就是完整的数据包，完全不用自己处理；

前端的 nginx 可以直接进行转发与负载均衡，部署简单多了

:::

### 知道什么跨域方式吗，jsonp 具体流程是什么，如何实现原生 Jsonp 封装，优化，对于

CORS，服务器怎么判断它该不该跨域呢

**考察点：计算机网络**

::: details 查看参考回答

常见的跨域方式大概有七种，大致可分为 iframe、api 跨域

1、JSONP，全称为 json with padding，解决老版本浏览器跨域数据访问问题，原理是 web 页面调用 JS 文件不受浏览器同源策略限制，所以通过 script 标签可以进行跨域请求，流程如下：

- 首先前端设置好回调参数，并将其作为 URL 的参数
- 服务器端收到请求后，通过该参数获取到回调函数名，并将数据放在参数中返回
- 收到结果后因为是 script 标签，所以浏览器当做脚本运行，

2、cors，全称是跨域资源共享，允许浏览器向跨源服务器发出 XMLHTTP Request 请求，从而克服了 ajax 只能同源使用的策略，实现 cors 的关键是服务器，只要服务器实现了 cros 接口，就可以跨域通信

前端逻辑很简单，正常发起 ajax 请求即可，成功的关键在于服务器

Access-Control-Allow-Origin 是否包含请求页面的域名，如果不包含的话，浏览器将认为这是
一次失败的异步请求，将会调用 xhr.onerror 中的函数。

Cros 使用简单，支持 POST 方式，但是存在兼容问题

浏览器将 cors 请求分为两类，简单请求和非简单请求，对于简单请求，浏览器直接发出 cors 请求，就是在头信息之中增加一个 origin 字段，用于说明本次请求来自哪个协议+域名+端口，服务器根据这个值，决定是否同意本次请求，如果服务器同意本次请求，返回的响应中会多出几个头信息字段：

- Access-Control-Allow-Orign：返回 origin 的字段或者\*
- Access-Control-Allow-Credentials,该字段可选，是一个 bool 值，表示是否允许发送
- cookie，
- Access-Control-Expose-Headers

参考：<http://www.ruanyifeng.com/blog/2016/04/cors.html>

3、服务器代理：

即当你有跨域的请求操作时发给后端，让后端帮你代为请求，

此外还有四中不常用的方式，也可了解下：

- location.hash：
- Window.name
- postMessage

参考：<https://juejin.im/entry/59feae9df265da43094488f6>

:::

### 怎么生成 token，怎么传递

**考察点：计算机网络**

::: details 查看参考回答

接口特点汇总：

- 1、因为是非开放性的，所以所有的接口都是封闭的，只对公司内部的产品有效；
- 2、因为是非开放性的，所以 OAuth 那套协议是行不通的，因为没有中间用户的授权过程；
- 3、有点接口需要用户登录才能访问；
- 4、有点接口不需要用户登录就可访问；

针对以上特点，移动端与服务端的通信就需要 2 把钥匙，即 2 个 token。

- **第一个 token 是针对接口的（api_token）；**

  - 它的职责是保持接口访问的隐蔽性和有效性，保证接口只能给自家人用，怎么做到？参考思路如下：

    - 现在的接口基本是 mvc 模式，URL 基本是 restful 风格，URL 大体格式如下：

      <http://blog.snsgou.com/模块名/控制器名/方法名?参数名1=参数值1&参数名2=参数值2&参数名> 3=参数值 3

    - 接口 token 生成规则参考如下：

      api_token = md5 ('模块名' + '控制器名' + '方法名' + '2017-07-18' + '加密密钥') =
      770fed4ca2aabd20ae9a5dd774711de2

      其中的

      1、 '2013-12-18' 为当天时间，

      2、'加密密钥' 为私有的加密密钥，手机端需要在服务端注册一个“接口使用者”账号后，
      系统会分配一个账号及密码，数据表设计参考如下：

      |    字段名     |  字段类型   |       注释       |
      | :-----------: | :---------: | :--------------: |
      |   client_id   | varchar(20) |    客户端 ID     |
      | client_secret | varchar(20) | 客户端(加密)密匙 |

    - 服务端接口校验，PHP 实现流程如下：

    - ```php
      <?php
      // 1、 获取 GET 参数值
      
      $module = $_GET['mod'];
      $controller = $_GET['ctl'];
      $action = $_GET['act'];
      $client_id = $_GET['client_id'];
      $api_token = $_GET['api_token'];
      
      // 2、 根据客户端传过来的 client_id，查询数据库，获取对应的 client_secret。
      
      $client_secret = getclientSecretById($client_id);
      
      // 3、 服务器重新生成一份 api_token
      
      $api_token_server = md5($module.$controller.$action.date('Y-m-d',
      time()).$client_secret);
      
      // 4、 客户端传过来的 api_token 与服务器生成的 api_token 进行校对，如果不相等，则表示验证失败。
      
      if($api_token != $api_token_server){
      exit('access deny');
      }
      
      // 5、 验证通过，返回数据到客户端。
      ```

    -

- **第二个 token 是针对用户的（user_token）；**

  - 它的职责是保护用户的用户名及密码多次提交，以防密码泄露。

  - 如果接口需要用户登录，其访问流程如下：

    - 1、用户提交“用户名”和“密码”，实现登录（条件允许，这一步最好走 https）；
    - 2、登录成功后，服务端返回一个 user_token，生成规则参考如下：

  - 服务端用数据表维护 user_token 的状态，表设计如下：

    - |   字段名    |  字段类型   |         注释          |
      | :---------: | :---------: | :-------------------: |
      |   user_id   |     int     |        用户 ID        |
      | user_token  | varchar(36) |      用户 token       |
      | expire_time |     int     | 过期时间(Unix 时间戳) |

  - 服务端生成 user_token 后，返回给客户端（自己存储），客户端每次接口请求时，如果接口需要用户登录才能访问，则需要把 user_id 与 user_token 传回给服务端，服务端接受到这 2 个参数后，需要做以下几步：

    - 1、检测 api_token 的有效性；
    - 2、删除过期的 user_token 表记录；
    - 3、根据 user_id，user_token 获取表记录，如果表记录不存在，直接返回错误，如果记录存在，则进行下一步；
    - 4、更新 user_token 的过期时间（延期，保证其有效期内连续操作不掉线）；
    - 5、返回接口数据。

  - 那么 token 如何传递呢，ajax 中传递 token 有以下几种方式：

    - 1、放在请求头中：
    - 2、使用 beforeSend 方法设置请求头

:::

### fetch 发送 2 次请求的原因

参考回答：

fetch 发送 post 请求的时候，总是发送 2 次，第一次状态码是 204，第二次才成功？

原因很简单，因为你用 fetch 的 post 请求的时候，导致 fetch 第一次发送了一个 Options 请求，询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求。

### Fetch API 与传统 Request 的区别

fetch 符合关注点分离，使用 Promise，API 更加丰富，支持 Async/Await

语意简单，更加语意化可以使用 isomorphic-fetch ，同构方便