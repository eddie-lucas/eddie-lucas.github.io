import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as o,d as p}from"./app-d83e1369.js";const i={};function l(n,e){return s(),o("div",null,e[0]||(e[0]=[p(`<h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>所属系统介绍：银行的<strong>证据链系统</strong>是银行风险控制的重要系统，旨在确保银行业务的合规性，安全性和问题可追溯性，该系统通过收集、整理、存储各类业务活动的相关证据，形成完整的证据链，以支持银行在面临法律纠纷，内部审计或外部监管时能够迅速提供有效的证据支持</p><p>问题产生背景：该系统的<strong>交易记录查找功能</strong>，涉及到<code>excel导入</code>，通常是业务人员在其它系统将数据导出，然后再导入到此系统，从而能够进行查找。业务人员<strong>导入excel数据条数90+w</strong>，然后生产环境就报oom了，还好该系统并未对客，产生的影响比较小，该功能原来由外包人员进行开发，后续由于外包人员离场，产生了问题，交由我来排查解决</p><h2 id="排查过程" tabindex="-1"><a class="header-anchor" href="#排查过程" aria-hidden="true">#</a> 排查过程</h2><p>采取的行动：由于银行管理较为严格，我无法真正的接触到生产环境，只能请运维老师按照我的思路进行排查</p><ol><li><p>查看日志，定位问题为此功能以及报错代码（运维老师查看生产，提供截图）</p></li><li><p>本地环境模拟导入功能</p><ol><li>向业务人员要到了excel文件</li><li>通过<code>-Xms2048m -Xmx2048m</code>设置内存大小，也可以设置的更小一点</li><li>本地测试导入功能，并且配置<code>vm options</code></li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>//方法1：报oom自动导出
<span class="token parameter variable">-Xms2048m</span> <span class="token parameter variable">-Xmx2048m</span> <span class="token parameter variable">-XX:+HeapDumpOnOutOfMemoryError</span> <span class="token parameter variable">-XX:HeapDumpPath</span><span class="token operator">=</span>D:/tmp
//方法2：通过jps获取pid，利用jmap导出dump文件
jmap <span class="token parameter variable">-dump:format</span><span class="token operator">=</span>b,file<span class="token operator">=</span>oom.dump <span class="token number">15580</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>本地进行测试的时候，测试了两种情况：</p><ul><li>一种是内容较少的excel文件，并未进行报错</li><li>另外就是测试大文件的导入，然后本地也报错了oom</li></ul><figure><img src="https://gitee.com/eddie-lucas/images/raw/master/img/image-20240805164122465.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后使用idea自带的profiler对dump文件进行分析，另外也可以用MAT</p><figure><img src="https://gitee.com/eddie-lucas/images/raw/master/img/image-20240805161312702.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上图的字段说明：</p><ul><li>count：该类型对象的数量</li><li>shallow size：指的是对象本身占用的内存大小，不包括他所引用的其他对象所占用的内存，简单来说，它就是对象头（类型信息，哈希码，GC分代年龄，锁状态等）和对象字段（基本类型字段和引用类型字段的引用），引用类型字段，只计算引用本身的大小，不计算被引用的对象的大小</li><li>retained size：一个对象被垃圾回收后，能够释放的内存大小，这个大小包括了该对象本身占用的内存（shallow size），以及所有仅通过该对象可达的对象所占用的内存</li></ul><p>oom异常类型说明：</p><ul><li><strong>GC overhead limit exceeded</strong>：当jvm花费大量的时间进行GC，但是只回收到很少的内存，报这个oom</li></ul><p>通过定位到这两个类所在的包，然后发现是由于引入了<code>apache poi</code>相关的依赖所引入的类，通过调研得知：</p><p><strong>apache poi</strong>是一种用于处理excel的技术，但是存在比较严重的问题就是<strong>十分消耗内存</strong>，另外定位到的报错代码是</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Workbook</span> workbook <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">XSSFWorkbook</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这行代码就是很正常的apache poi创建Workbook的代码，也就是说，oom并不是由于开发人员自己的代码导致的，而是由于apache poi内部的代码</p><p><strong>问题原因分析</strong>：apache poi解析excel文件过程中，会在内存中创建大量的对象，这些对象数量庞大，且excel文件越大，需要创建的对象越多，并且由于excel并未解析完成，所以还需要继续创建这些对象，但是此时内存空间紧张，需要进行GC，但是这些对象又是不能够回收的，所以报oom了</p><h2 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h2><p>通过调研，发现apache poi十分的消耗内存，对大文件的处理场景无法进行很好的支持，并且对于消耗大量内存的行为是需要改善的，原项目一直使用的是apache poi进行excel的处理，考虑到后续需要避免再次发生这种问题，将apache poi替换为easy excel，<strong>easy excel相比于apache poi更加快速，简洁，并且在处理大文件的时候，使用磁盘做缓存，更加节约内存</strong></p><blockquote><p>easy excel为什么不用占用大量内存？</p></blockquote><ol><li><p>easy excel采用了逐行解析和读取的方式处理excel文件，而apache poi会将整个excel文件或者其大部分呢内容一次性加载到内存，从而导致内存占用高，</p></li><li><p>另外，easy excel还提供了灵活的缓存策略，可以根据文件大小自动选择内存缓存或者磁盘缓存，对于较小的文件采用内存缓存来提高解析速度，对于大文件，使用磁盘做缓存，更加节约内存</p></li><li><p>excel文件在底层实现上基于xml，解析excel通常有两种模式：DOM和SAX，easy excel基于SAX模式，apache poi基于DOM模式，SAX模式边扫描边处理，每次处理一点内容</p></li></ol><p>DOM工作原理：把所有内容一次性加载进内存，并且构建节点树</p><p>SAX工作原理：对文档进行顺序扫描，当扫描到不同的开始标签和结束标签时会触发事件，事件处理函数做出相应 的动作，然后继续顺序扫描，直至文档结束</p>`,26)]))}const t=a(i,[["render",l],["__file","apache poi导致的oom.html.vue"]]);export{t as default};
