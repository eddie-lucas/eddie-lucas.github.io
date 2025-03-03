import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as i,c as o,d as l,a as s,b as p,e as c}from"./app-d83e1369.js";const r={},m={href:"https://blog.csdn.net/qq_38192105/article/details/113865023?ops_request_misc=&request_id=&biz_id=102&utm_term=nvm%E7%AE%A1%E7%90%86%E5%B7%B2%E7%BB%8F%E4%B8%8B%E8%BD%BD%E7%9A%84node%E5%AE%89%E8%A3%85%E5%8C%85&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-5-113865023.142%5Ev93%5EchatgptT3_1&spm=1018.2226.3001.4187",target:"_blank",rel:"noopener noreferrer"};function d(v,n){const e=t("ExternalLinkIcon");return i(),o("div",null,[n[1]||(n[1]=l(`<p>nvm是一个node版本管理工具</p><ol><li><p>首先在D-&gt;mySoftware-&gt;node里面创建两个文件夹：nvm和nodejs</p></li><li><p>解压出nvm的exe安装程序，将其放在与nvm和nodejs同级目录下</p></li><li><p>exe程序中第一个选择目录的地方选择node，第二个选择nodejs</p></li><li><p>将多个不同版本的node压缩包放到nvm文件夹中，右键解压到当前文件夹</p></li><li><p>重命名解压出的node文件夹为：v16.20.0等</p></li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>nvm <span class="token function">install</span> <span class="token number">18.18</span>.2
nvm <span class="token function">ls</span>
nvm use <span class="token number">16.20</span>.0
<span class="token comment"># nvm下载node的镜像，公司内网可能不需要配置，应该有现成的安装包</span>
nvm node_mirror https://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/


<span class="token comment"># 如果是公司内网，公司内网会提供一个</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry http://127.0.0.1:8081/repository/npm-taobao
<span class="token comment"># 如果是外网，使用taobao镜像(过期了)</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npm.taobao.org
<span class="token comment"># 如果是外网，使用这个镜像(taobao的过期了，用这个)</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com
<span class="token comment">#下面的每个版本的npm都执行一次</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> prefix <span class="token string">&quot;D:\\mySoftware<span class="token entity" title="\\n">\\n</span>ode<span class="token entity" title="\\n">\\n</span>odejs<span class="token entity" title="\\n">\\n</span>ode_global&quot;</span>

<span class="token function">npm</span> config <span class="token builtin class-name">set</span> cache <span class="token string">&quot;D:\\mySoftware<span class="token entity" title="\\n">\\n</span>ode<span class="token entity" title="\\n">\\n</span>odejs<span class="token entity" title="\\n">\\n</span>ode_cache&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)),s("p",null,[s("a",m,[n[0]||(n[0]=p("nvm及node安装过程")),c(e)])])])}const k=a(r,[["render",d],["__file","nvm_node安装.html.vue"]]);export{k as default};
