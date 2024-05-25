import{_ as s,c as n,o as a,a5 as l}from"./chunks/framework.DVTrgelf.js";const C=JSON.parse('{"title":"手写实现工具","description":"","frontmatter":{},"headers":[],"relativePath":"Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现工具.md","filePath":"Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现工具.md","lastUpdated":1716655893000}'),p={name:"Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现工具.md"},e=l(`<h1 id="手写实现工具" tabindex="-1">手写实现工具 <a class="header-anchor" href="#手写实现工具" aria-label="Permalink to &quot;手写实现工具&quot;">​</a></h1><h2 id="实现小型打包工具" tabindex="-1">实现小型打包工具 <a class="header-anchor" href="#实现小型打包工具" aria-label="Permalink to &quot;实现小型打包工具&quot;">​</a></h2><p>该工具可以实现以下两个功能：</p><ul><li>将 ES6 转换为 ES5</li><li>支持在 JS 文件中 import CSS 文件</li></ul><p>通过这个工具的实现，大家可以理解到打包工具的原理到底是什么</p><h3 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h3><p>因为涉及到 ES6 转 ES5 ，所以我们首先需要安装一些 Babel 相关的工具</p><div class="language-bash line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#61AFEF;">pnpm</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> babylon</span><span style="color:#98C379;"> babel-traverse</span><span style="color:#98C379;"> babel-core</span><span style="color:#98C379;"> babel-preset-env</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>接下来我们将这些工具引入文件中</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#C678DD;">const</span><span style="color:#E5C07B;"> fs</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;fs&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">const</span><span style="color:#E5C07B;"> path</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;path&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">const</span><span style="color:#E5C07B;"> babylon</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;babylon&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">const</span><span style="color:#E5C07B;"> traverse</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;babel-traverse&quot;</span><span style="color:#ABB2BF;">).</span><span style="color:#E06C75;">default</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">const</span><span style="color:#ABB2BF;"> { </span><span style="color:#E5C07B;">transformFromAst</span><span style="color:#ABB2BF;"> } </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;babel-core&quot;</span><span style="color:#ABB2BF;">);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>首先，我们先来实现如何使用 Babel 转换代码</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> readCode</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">filePath</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 读取文件内容</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> content</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> fs</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">readFileSync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">filePath</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;utf-8&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 生成 AST</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> ast</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> babylon</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">parse</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">content</span><span style="color:#ABB2BF;">, {</span></span>
<span class="line"><span style="color:#E06C75;">		sourceType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;module&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">	});</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 寻找当前文件的依赖关系</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> dependencies</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> [];</span></span>
<span class="line"><span style="color:#61AFEF;">	traverse</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ast</span><span style="color:#ABB2BF;">, {</span></span>
<span class="line"><span style="color:#61AFEF;">		ImportDeclaration</span><span style="color:#ABB2BF;">: ({ </span><span style="color:#E06C75;font-style:italic;">node</span><span style="color:#ABB2BF;"> }) </span><span style="color:#C678DD;">=&gt;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#E5C07B;">			dependencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">push</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">node</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">source</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">		},</span></span>
<span class="line"><span style="color:#ABB2BF;">	});</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 通过 AST 将代码转为 ES5</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#ABB2BF;"> { </span><span style="color:#E5C07B;">code</span><span style="color:#ABB2BF;"> } </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> transformFromAst</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ast</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">null</span><span style="color:#ABB2BF;">, {</span></span>
<span class="line"><span style="color:#E06C75;">		presets</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;env&quot;</span><span style="color:#ABB2BF;">],</span></span>
<span class="line"><span style="color:#ABB2BF;">	});</span></span>
<span class="line"><span style="color:#C678DD;">	return</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#E06C75;">		filePath</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">		dependencies</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">		code</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">	};</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><ul><li>首先我们传入一个文件路径参数，然后通过 fs 将文件中的内容读取出来 接下来我们通过 babylon 解析代码获取 AST ，目的是为了分析代码中是否还引入了别的文件</li><li>通过 dependencies 来存储文件中的依赖，然后再将 AST 转换为 ES5 代码</li><li>最后函数返回了一个对象，对象中包含了当前文件路径、当前文件依赖和当前文件转换后的代码</li></ul><p>接下来我们需要实现一个函数，这个函数的功能有以下几点：</p><ul><li>调用 readCode 函数，传入入口文件</li><li>分析入口文件的依赖</li><li>识别 JS 和 CSS 文件</li></ul><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> getDependencies</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">entry</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 读取入口文件</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> entryObject</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> readCode</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">entry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> dependencies</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> [</span><span style="color:#E06C75;">entryObject</span><span style="color:#ABB2BF;">];</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 遍历所有文件依赖关系</span></span>
<span class="line"><span style="color:#C678DD;">	for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">const</span><span style="color:#E5C07B;"> asset</span><span style="color:#C678DD;"> of</span><span style="color:#E06C75;"> dependencies</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 获得文件目录</span></span>
<span class="line"><span style="color:#C678DD;">		const</span><span style="color:#E5C07B;"> dirname</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> path</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">dirname</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">asset</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">filePath</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 遍历当前文件依赖关系</span></span>
<span class="line"><span style="color:#E5C07B;">		asset</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">dependencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">forEach</span><span style="color:#ABB2BF;">((</span><span style="color:#E06C75;font-style:italic;">relativePath</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">=&gt;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">			// 获得绝对路径</span></span>
<span class="line"><span style="color:#C678DD;">			const</span><span style="color:#E5C07B;"> absolutePath</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> path</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">join</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">dirname</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">relativePath</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">			// CSS 文件逻辑就是将代码插入到 \`style\` 标签中</span></span>
<span class="line"><span style="color:#C678DD;">			if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">/</span><span style="color:#56B6C2;">\\.</span><span style="color:#E06C75;">css</span><span style="color:#C678DD;">$</span><span style="color:#E06C75;">/</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">test</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">absolutePath</span><span style="color:#ABB2BF;">)) {</span></span>
<span class="line"><span style="color:#C678DD;">				const</span><span style="color:#E5C07B;"> content</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> fs</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">readFileSync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">absolutePath</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;utf-8&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">				const</span><span style="color:#E5C07B;"> code</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> \`</span></span>
<span class="line"><span style="color:#98C379;">				const style = document.createElement(&#39;style&#39;)</span></span>
<span class="line"><span style="color:#98C379;">				style.innerText = </span><span style="color:#C678DD;">\${</span><span style="color:#E5C07B;">JSON</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">stringify</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">content</span><span style="color:#ABB2BF;">).</span><span style="color:#61AFEF;">replace</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">/</span><span style="color:#56B6C2;">\\\\</span><span style="color:#E06C75;">r</span><span style="color:#56B6C2;">\\\\</span><span style="color:#E06C75;">n/</span><span style="color:#C678DD;">g</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">)</span><span style="color:#C678DD;">}</span></span>
<span class="line"><span style="color:#98C379;">				document.head.appendChild(style)</span></span>
<span class="line"><span style="color:#98C379;">				\`</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">				dependencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">push</span><span style="color:#ABB2BF;">({</span></span>
<span class="line"><span style="color:#E06C75;">					filePath</span><span style="color:#ABB2BF;">: </span><span style="color:#E06C75;">absolutePath</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">					relativePath</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">					dependencies</span><span style="color:#ABB2BF;">: [],</span></span>
<span class="line"><span style="color:#E06C75;">					code</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">				});</span></span>
<span class="line"><span style="color:#ABB2BF;">			} </span><span style="color:#C678DD;">else</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">				// JS 代码需要继续查找是否有依赖关系</span></span>
<span class="line"><span style="color:#C678DD;">				const</span><span style="color:#E5C07B;"> child</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> readCode</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">absolutePath</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">				child</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">relativePath</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> relativePath</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">				dependencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">push</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">child</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">			}</span></span>
<span class="line"><span style="color:#ABB2BF;">		});</span></span>
<span class="line"><span style="color:#ABB2BF;">	}</span></span>
<span class="line"><span style="color:#C678DD;">	return</span><span style="color:#E06C75;"> dependencies</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><ul><li>首先我们读取入口文件，然后创建一个数组，该数组的目的是存储代码中涉及到的所有文件</li><li>接下来我们遍历这个数组，一开始这个数组中只有入口文件，在遍历的过程中，如果入口文件有依赖其他的文件，那么就会被 push 到这个数组中</li><li>在遍历的过程中，我们先获得该文件对应的目录，然后遍历当前文件的依赖关系</li><li>在遍历当前文件依赖关系的过程中，首先生成依赖文件的绝对路径，然后判断当前文件是 CSS 文件还是 JS 文件 <ul><li>如果是 CSS 文件的话，我们就不能用 Babel 去编译了，只需要读取 CSS 文件中的代码，然后创建一个 style 标签，将代码插入进标签并且放入 head 中即可</li><li>如果是 JS 文件的话，我们还需要分析 JS 文件是否还有别的依赖关系</li></ul></li><li>最后将读取文件后的对象 push 进数组中</li><li>现在我们已经获取到了所有的依赖文件，接下来就是实现打包的功能了</li></ul><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> bundle</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">dependencies</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">entry</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">	let</span><span style="color:#E06C75;"> modules</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 构建函数参数，生成的结构为</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// { &#39;./entry.js&#39;: function(module, exports, require) { 代码 } }</span></span>
<span class="line"><span style="color:#E5C07B;">	dependencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">forEach</span><span style="color:#ABB2BF;">((</span><span style="color:#E06C75;font-style:italic;">dep</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">=&gt;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">		const</span><span style="color:#E5C07B;"> filePath</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> dep</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">relativePath</span><span style="color:#56B6C2;"> ||</span><span style="color:#E06C75;"> entry</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">		modules</span><span style="color:#56B6C2;"> +=</span><span style="color:#98C379;"> \`&#39;</span><span style="color:#C678DD;">\${</span><span style="color:#E06C75;">filePath</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&#39;: (</span></span>
<span class="line"><span style="color:#98C379;">	function (module, exports, require) { </span><span style="color:#C678DD;">\${</span><span style="color:#E5C07B;">dep</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">code</span><span style="color:#C678DD;">}</span><span style="color:#98C379;"> }</span></span>
<span class="line"><span style="color:#98C379;">	),\`</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">	});</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 构建 require 函数，目的是为了获取模块暴露出来的内容</span></span>
<span class="line"><span style="color:#C678DD;">	const</span><span style="color:#E5C07B;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> \`</span></span>
<span class="line"><span style="color:#98C379;">	(function(modules) {</span></span>
<span class="line"><span style="color:#98C379;">	function require(id) {</span></span>
<span class="line"><span style="color:#98C379;">	const module = { exports : {} }</span></span>
<span class="line"><span style="color:#98C379;">	modules[id](module, module.exports, require)</span></span>
<span class="line"><span style="color:#98C379;">	return module.exports</span></span>
<span class="line"><span style="color:#98C379;">	}</span></span>
<span class="line"><span style="color:#98C379;">	require(&#39;</span><span style="color:#C678DD;">\${</span><span style="color:#E06C75;">entry</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&#39;)})({</span><span style="color:#C678DD;">\${</span><span style="color:#E06C75;">modules</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">})</span></span>
<span class="line"><span style="color:#98C379;">	\`</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 当生成的内容写入到文件中</span></span>
<span class="line"><span style="color:#E5C07B;">	fs</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">writeFileSync</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;./bundle.js&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">result</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>这段代码需要结合着 Babel 转换后的代码来看，这样大家就能理解为什么需 要这样写了</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#7F848E;font-style:italic;">// entry.js</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> _a</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;./a.js&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> _a2</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> _interopRequireDefault</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">_a</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> _interopRequireDefault</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">obj</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">	return</span><span style="color:#E06C75;"> obj</span><span style="color:#56B6C2;"> &amp;&amp;</span><span style="color:#E5C07B;"> obj</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">__esModule</span><span style="color:#C678DD;"> ?</span><span style="color:#E06C75;"> obj</span><span style="color:#C678DD;"> :</span><span style="color:#ABB2BF;"> { </span><span style="color:#E06C75;">default</span><span style="color:#ABB2BF;">: </span><span style="color:#E06C75;">obj</span><span style="color:#ABB2BF;"> };</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#E5C07B;">console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">_a2</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">default</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// a.js</span></span>
<span class="line"><span style="color:#E5C07B;">Object</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">defineProperty</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">exports</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;__esModule&quot;</span><span style="color:#ABB2BF;">, {</span></span>
<span class="line"><span style="color:#E06C75;">	value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> a</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">exports</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">default</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> a</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Babel 将我们 ES6 的模块化代码转换为了 CommonJS 的代码，但是浏览器 是不支持 CommonJS 的，所以如果这段代码需要在浏览器环境下运行的话， 我们需要自己实现 CommonJS 相关的代码，这就是 bundle 函数做的大部 分事情。</p><h4 id="接下来我们再来逐行解析-bundle-函数" tabindex="-1">接下来我们再来逐行解析 bundle 函数 <a class="header-anchor" href="#接下来我们再来逐行解析-bundle-函数" aria-label="Permalink to &quot;接下来我们再来逐行解析 bundle 函数&quot;">​</a></h4><ul><li>首先遍历所有依赖文件，构建出一个函数参数对象</li><li>对象的属性就是当前文件的相对路径，属性值是一个函数，函数体是当前文件下的代码，</li><li>函数接受三个参数 module 、 exports 、 require <ul><li>module 参数对应 CommonJS 中的 module</li><li>exports 参数对应 CommonJS 中的 module.export</li><li>require 参数对应我们自己创建的 require 函数</li></ul></li><li>接下来就是构造一个使用参数的函数了，函数做的事情很简单，就是内部创建一个 require 函数，然后调用 require(entry) ，也就是 require(&#39;./entry.js&#39;) ，这样就会从函数参数中找到 ./entry.js 对应的函数并执行，最后将导出的内容通过 module.export 的方式让外部获取到</li><li>最后再将打包出来的内容写入到单独的文件中</li></ul><p>如果你对于上面的实现还有疑惑的话，可以阅读下打包后的部分简化代码</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki one-dark-pro vp-code"><code><span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">function</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;font-style:italic;">modules</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">	function</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">id</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 构造一个 CommonJS 导出代码</span></span>
<span class="line"><span style="color:#C678DD;">		const</span><span style="color:#E5C07B;"> module</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> { </span><span style="color:#E06C75;">exports</span><span style="color:#ABB2BF;">: {} };</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 去参数中获取文件对应的函数并执行</span></span>
<span class="line"><span style="color:#E06C75;">		modules</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">](</span><span style="color:#E5C07B;">module</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">module</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">exports</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">require</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">		return</span><span style="color:#E5C07B;"> module</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">exports</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">	}</span></span>
<span class="line"><span style="color:#61AFEF;">	require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;./entry.js&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">})({</span></span>
<span class="line"><span style="color:#98C379;">	&quot;./entry.js&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">function</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;font-style:italic;">module</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">exports</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">require</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 这里继续通过构造的 require 去找到 a.js 文件对应的函数</span></span>
<span class="line"><span style="color:#C678DD;">		var</span><span style="color:#E06C75;"> _a</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> require</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;./a.js&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">		console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">_a2</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">default</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">	},</span></span>
<span class="line"><span style="color:#98C379;">	&quot;./a.js&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">function</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;font-style:italic;">module</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">exports</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">require</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">		var</span><span style="color:#E06C75;"> a</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 将 require 函数中的变量 module 变成了这样的结构</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// module.exports = 1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">		// 这样就能在外部取到导出的内容了</span></span>
<span class="line"><span style="color:#E5C07B;">		exports</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">default</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> a</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">	},</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">	// 省略</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>虽然实现这个工具只写了不到 100 行的代码，但是打包工具的核⼼原理就是 这些了</p><ul><li>找出入口文件所有的依赖关系</li><li>然后通过构建 CommonJS 代码来获取 exports 导出的内容</li></ul>`,27),o=[e];function t(r,c,B,y,i,u){return a(),n("div",null,o)}const F=s(p,[["render",t]]);export{C as __pageData,F as default};
