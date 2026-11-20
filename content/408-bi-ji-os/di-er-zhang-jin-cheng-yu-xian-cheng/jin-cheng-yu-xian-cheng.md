---
title: 进程与线程
description: ""
date: 2026-10-14
updated: 2026-11-20
tags: []
aliases: []
order: 0
---

# 进程与线程

- 进程
    
    - ![c9897334b2a69c3e1d489bd81bc11b2b.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-a1df5f4df2152d7fb94c6b7f8c00713ed4c6eb4872dcd6a0ac1f543ac3fe7124.png)
        
    - ![0ee63955a128df70757daabd21424b42.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-58458f03a14dcf60656f7e97c71bd517155745cc5dc1047c94f265f714f50925.png)
        
- 进程的组成
    
    - ![2109fc7ad894d32b8903a9386406c16e.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-c4ed2a0b1a2b8af5b33a3a050d335d8fe053959ab073120f1219f9427b5f9ff0.png)
		- 进程控制块PCB
		  - 进程执行时，系统通过PCB查出状态以及优先级，要根据PCB的信息保存CPU状态信息，总之就是做什么事情都需要PCB 类似于同步通信断电保存and so on
		  - PCB需要组织起来，常用的诅咒方法有连接方式和索引方式两种
			  - 链接方式：也就是将同一状态的PCB连接成一个队列，也可以把处于阻塞的PCB按照阻塞原因放到不同的队列里面
			-  索引方式，把同一状态的进程组织在一章索引表里面去，索引表的项指向PCB
			  
			- 简单叙述一下 PCB 包括什么内容，大概有：

				1. 进程标识符
				2. 用户标识符
				3. 进程状态
				4. 进程优先级代码
				5. 入口地址
				6. 程序的外层地址
				7. 进入内存的时间
				8. CPU 占用时间
				9. 信号量的使用
				10. 代码段指针
				11. 数据段指针
				12. 堆栈段指针
				13. 文件描述符
				14. 键盘鼠标
				15. 通用寄存器值
				16. 地址寄存器值
				17. 控制寄存器值
				18. 标志寄存器值
				19. 状态字
			  
		- 程序段
		  - 也就是被调度程序调度到CPU执行的代码段
		   
		- 数据段已经很详细了
- 进程的特征
    > 此处并不重要所以无需背诵仅需理解
    - ![7b6b626615cb7bc4a0dd9b82b6d9612c.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-646085a4d9d5366e1d1524cabd66a61fb6d63a7ba62eb7718697e9b85c41ba57.png)
- 进程的内存映像
    
    - ![67a257d11e14230f26cd0a043ba028c4.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-d3952620502246d662d1941d9e2d49404bd57c861f05ffff2cecfafccada11eb.png)
- 进程的状态
    
    - 创建态
		- 对于创建态来说步骤如下
			- 首先申请一个PCB，然后填写用于控制和管理进程信息，分配资源，最后插入就绪序列转化成就绪态
    - 就绪态![6045ad0fbecb318993777faab921db8d.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-24bab3ea3e689a65ca4f1625d439bce52bd949e7e93f6f747d04062431462de8.png)
		- 获得CPU就马上启动，并且多个就绪态进程会排成一个就绪队列|FIFO规则？
    - 运行态![e349e2237c803909179013c11e218271.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-79ea7830095e800a65b9ffbee777b39e9ae8444324603bedb4df6d8602ac0e89.png)
		- 就是正在运行的进程，有多少个CPU就最多并行多少个进程？是max的原因应该是一个进程可以占据多个CPU
    - 阻塞态![8001e402bc2ef2f696cf143fe435ace0.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-38853e325c1f2b876246f29df86d622991c0ca8ae662f12ee9e9c2d6ed19bb7f.png)
		- 也叫做等待态，很像join() 等待某个资源 or IO完，即使CPU空闲也不可以工作，同样的，可以根据不同阻塞原因组成多个队列
    - 终止态![431503874bdd9636f5929b3bd548e58e.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-80d74f0f3d76eb0bd81ddeb392ce8f082208159939e3357dbe38cf4829cc4d45.png)
		- OS先设置终止态然后回收资源and so on.
    - 一条流程![e3d9a7f67fae11f29b4cccaa51d54918.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-b51efc07ace644b76982fa2266f31bfa7f8dce9e2daf95bd8ebcf8532932ec1f.png)
    - 进程状态保存![3bdb8a9730bdf12c8bb12e887f1d408a.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-3928e5f0bf9a997358bbc5ecf2274935d81e5884df32e58cbef6f4f68f698fd6.png)
    - PCB组织 链接的方式![87a204b448b6725ef2661f7e8bb8aa69.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-c1f6c98c19da70e76be62ae718a69b1e49861f91435e3ea989619d798e9f6e5f.png)前面讲过的
- 进程控制：实现对状态转换的管理
    
    - 原语![52b3fd7853477606518684a9ec3859c2.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-ba780c0822f42259c6feee19c91afd1d9d5e4b8c30a0e22aee7982e21c58c562.png)
        - 如何实现原子性
            - ![56dea311a8ba78e2cc141d44e5e14663.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-e4b438c5f61683a391aff45f248d072781909b2716651b6e90c831e857629ce5.png)通过开关中断
        - 创建原语
            - ![643722b1f202861f1b61f91d8140fb4c.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-b42d3ba06f7377d6cfe772322510e78edecbfff08ec16b133e9373397b354da3.png)
            - 引发原因![709bf49533ca2b86e25f04cdc311f1af.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-168253a2154711290fa16a8bb71f96c1f49e0eae69df04d0caf20da175120224.png)
        - 撤销原语
            - ![c00b1b7526eee489d00656fe21925277.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-794d721d3e5c2e8172258403f29075bb9a64e92f90ba25bf68a950879acdd0fb.png)
			  1. 根据进程的标识符，找到PCB读出进程状态
				2. 同图
				3. 如果要是有子孙进程的话终止
				4. 后续无需解释   
        - 终止的条件
            - ![95665c5295eb88d1c69f989da0dff44c.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-c94c333da0019df5425e460a3b3de824bac1b98a4abf52fcf6e6c2e9a446961a.png)
			- 正常结束就是任务已经完成，异常结束就是发生了异常事件，外界干预就是程序外界请求导致的运行终止
        - 进程的阻塞和唤醒
            - ![ffb537ff5ab2593ddc83c60a94813c38.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-ce92a060c94aab63e91026797481e499acfcce706673bd85518d1828e01bf7e4.png)
			- 注意阻塞原语也就是BLock原语和唤醒Wakeup原语是完全相反的，也就是必须阻塞和唤醒搭配出现，否则会无限阻塞
        - 切换原语
            - ![0e90cbf326be77b4cd268a6843ad8d52.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-22df73bc87805e9965d0349442d1b3f57987b42b1aa52d0e8c51cd165acd1eec.png)
    - 进程的通信
	  >值得一提的是我在https://xin1230032197.github.io/ai-infra/ru-men-zhun-bei/di-yi-zhang-bian-cheng-yu-yan-ji-chu 有写到queue and pipe and manager都属于进程通信方法呢
        - 两个进程之间的通信
            - 因为进程拥有的空间独立 所以需要OS支持
        - 共享存储
            - ![38dc9d3d3c83923ab04ee6f0348db161.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-8e24d58679a1f158c7793f59eb8befdc7018bf3a7b20fadf1a466ad2a9c66813.png)
            - 分为两种共享存储空间
                - ![417a27dccecdccc8f6a535f15446d8b0.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-db0ce102e193ec124de8b09f01e6be1fc5695ab908cc7bd2d3f5ed60079315ec.png)
				- 低级的就是数据结构高级的就是储存区。需要注意进程运行的时候一般不可以访问其他进程的空间，想让两个进程同时访问的话需要特殊的接口，当然线程是自带共享的
        - 消息传递
			- 好处是隐藏了通信实现细节，使得通信过程对用户透明，简化了通信程序的设计，最广泛的目前是，同时微内核和雾浮起就用了，而且支持多CPU 分布式和计算机网络。
            - ![f858f136b985966fbb6a24f834e9644f.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-11238cd5bf2dd211e3c9db20b5fb309944a03536de50ea9210e423d578efac92.png)
				- 简单来说就是进程发送信息进入消息队列，这里其实可以参考一下 send receive ai infra入门初步编程基础python并发多进程部分，
			
        - 间接消息传递
            - ![22b484507848f0c8bec881233aa6643b.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-40755758975ba7bec1cba91488b18860d63be11676af0d3065364396cc333ddc.png)
				- 类似于信箱，比如说Queue进程队列
        - 管道通信
            - ![1b6f54622216529b1f62bebe6a871e83.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-974352293efbc5ff73afac3f886e6105dc5c476c7c53acbe777e9f966c2dc4c7.png)
            - ![48fca2b2c8a6105098ecda1bf2465a61.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-abc91a03db3342cebd61462fe0926222d0c9355e202f4b1242504e2aafb2ba3b.png)
			- pipe文件 multiprocessing.Pipe()
			- 只要管道不满就可以一直写 只要管道不空就可以一直读
			- 保证三种效果
				 - 互斥，一个进程对管道进行R/D操作的时候，其他进程必须wait()
				 - 同步，写阻塞必须取出才能唤醒，读阻塞必须写入才可以唤醒
				 - 确定双方存在
					 
			- 那么是不是必须要单对单呢，实际上py多进程里是这样的
    - 信号
        - 作用![01ba883488ca1a979d094d756a1d30ec.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-9333ec5c7bd71f15ea15f68c721b9268405853d03a9d0f6ca34bb0a8a4a4a60c.png)
        - 实现原理
            - ![4448f82b7c142cd82463682c37c19255.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-f8adc7617503c4ac17539e81e08108fb3dd0c52b7228da252450c4221010c6bd.png)
			- 比如给进程发一个信号，对应的位变成1，一旦被处理就把对应的位变成0，同时如果被阻塞信号对应的位位1的话，那么将会忽略
            - 信号处理
                - ![e1f2680f2f623a03be9ba684b7501566.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-9b667d301acf33ca0005ffcdfcdc5a09113e358010e243893b4c38d8abbc5e1c.png)
                - ![ac31c65c257a40b8fbd5b7f9d80af223.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-5d38e6eab34569c8811c27eacd726d8881615a59b69346c2745f5601241e26e5.png)
            - 信号和异常的关系
                - ![b313b09df278459e7564750667c86b25.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-de15c22224db4af9a9d58642ca67a4bdd7cbe9218e490b49647cbdf6ad1d7d32.png)
     - 线程
       - 概念
         - ![3bb0ad6ac4c1a284bed096b61067479d.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-80aab4418a081a916fe1b82e53093e6c5bb41bb756e1454ed130d1e06945280e.png)
		 - 对于一个线程来说，它是由线程 ID、程序计数器、寄存器集合和堆栈组成的
       - 属性
          - ![6d35ac197f03f295f3eda2f1cfa16077.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-b016dc98b4e8ddbfb2921cb55fd6fcd4f5490c77bd110ffeeeb525004f5eaebf.png)
		    - 对于系统开销来说，创建或者撤销一个进程，操作系统付出的开销是要远大于线程的。
			- 不同的线程可以并发
       - 线程实现
         - 用户级线程
	        - ![4fd67d7fb9f8d802d2b9737375018b3c.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-823136e50ca681b85e4bd72867d2ff53f534bd0f388907584d21f238d7a53f1e.png)
	         - ![f231d9e3158075d8e356793033c20e56.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-cf1495cd4b86ca30fe071cad92d4e20749222182def58da1631abde2b6dcb821.png)
			  - 补充优点：调度算法可以是进程专用的，不同的进程可以根据线程的需要选择不同的调度算法
					   
			- 补充优点：用户及线程的实现和 OS 完全无关，是用户程序的一部分
			- 缺点：
				1. 当线程执行一个系统调用进入内核态阻塞的时候，其他的线程也被阻塞。
				1. 不能发挥多CPU的优势，一个进程只能对应一个CPU。
         - 内核级线程
            - ![e15fb8d100296a3d0ea035d1319d30fa.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-c7a07de0e3e1ea27d99e0b76119956ab4ade13fd7d5491d30ee797ea70ff1ad1.png)
			   
			-  组合方式
				  -  组合方式就是允许用户程序建立、调度和管理用户级线程，实际上就是可以根据进程的特点，自由选择用户级方式和内核级方式
					  
			-  线程库：为程序员提供创建和管理线程的API，实现方法有两种：
				1. 在用户空间内提供一个没有内核支持的库。这种库的话，就不需要调度OS
				1. 实现由OS直接支持的一个内核级的库。这个库的话，开销就会更大一些，因为涉及内核，需要OS啊
				- 这里用户级线程就有用到

    - 多线程模型
		- 一对一
	      - ![2ee7852b3a3d82519228fedb0052e305.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-8f46c5b927b9840cf7ea2ec9218e16cb8c51678db68d019a39664e73d0226cd4.png)
        - 多对一
          - ![d5b9fd86a63d3077cc9065109ff2298a.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-2f8af154980c4801b56224a7b127f45cb5d861724266c512dfab37a1ff3a3331.png)
         - 多对多
            - ![0e8d321f73958a10238b4f4103583934.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-e7fe7ecc68b84138ad9c3d1fc9c07cebfbf358b7add67cd7de5d018390cf852c.png)
				
		- 

   - 线程的状态与转换
      - ![7840b839e35fc05a66c4a576c2d87b55.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-0e71be35b841b1a5f98ee88489a57a498103d7386ac81dca3738d858a3ee581d.png)
   - 线程的组织与控制
      - ![c721189eb9f4eb9b95d548e34db489fe.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-cbf07e7d8ed94e638b9320a633882878a8810fc4f1321e6a4926803a8e8a2d78.png)
		- 调度用户程序启动的时候，一般由一个初始化线程（命名的线程）执行，它的功能就是创造新的线程。创造新线程的时候需要用一个线程创造函数，并且提供对应的参数，这些参数大部分就是线程控制块的内容
		- 对于线程的终止来说，线程终止之后并不立刻释放它所占有的资源。只有当进程中的其他线程执行了分离函数之后，被终止的线程才与资源分离，并释放资源。
		- 被终止但未释放资源的线程，仍然可以由其他线程调用，以使被终止的线程重新恢复运行。
			
- - - 


## 调度
- 
    - 一堆任务处理的顺序
    - 高级调度
        - 作业：一个具体的业务
        - ![9afabc4fa32d963ef820ab63d433121e.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-a2ac15e33f7a5e6d9d33f6aff698efca12f0c6c59dd0fc1e9ba7143769f5afa2.png)
    - 低级调度
        - ![0c6262867807b041df1e1a39b2ffae76.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-3871c3d24a6426c59407093e0cb68930eabc8918a1e2651bebca3acb4bea51c7.png)
    - 中级调度
        - ![44ae8d9889370b9538505d3462cb9b82.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-754bb320c31d4fa7909ebe55ed2fb99c17563eb5a6373d977477fc71903948cf.png)
    - 三调度对比
        - ![cf966ba3258c073973802b75c0fb7931.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-ee4f88edd8ebc54474de07694dfcb20d6873506964a6999f25f799eb399ca997.png)
- 七状态模型
    
    - ![6187923043ec3fd76a11f02d6962a5a2.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-f45c012db56b79b1c3e81657bb74902d647fdc3be2c2268a21d90c404a0f765f.png)
- 进程调度的时机 切换和方式
    
    - 时机
        - ![e7b37dfb6124cfb9de128e60c30eef26.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-98a35ab8421af5c1f8c7c9d280b85d6cfdc4d107c47ac21e98fe38d67d121321.png)
        - ![d22b9b7379d33f230dba614accecc2c4.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-ee7a579da553adff187a1d83426445d14826fd375cbf35b2022ac5eb4bade217.png)
    - 方式
        - ![344f0dfa0768b51e3c38228e0fbd1cae.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-5c8958ff0d1d128e582aec4d9f0d2e31428732cd212124de4d96806cec8847ad.png)
    - 过程
        - ![d8b98f36dbb1c82b3203ec6f9c593dbb.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-797fe8f0fbab92e2acc63415170053b83f67a63d06ce65b334152c53dd0bd8eb.png)
- 调度器和闲逛进程
    
    - ![75bc8ded0719d2823d548865fd3995a4.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-2874c49ca6d7e5cdca540a9a315cda944caed057ab7c23df06e198390d334554.png)
    - ![a0ae4a9613c20828279d414e17a820ea.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-ade89ac67a699dac591a0c46ee167be72cb61203e336d33e287398139e9ffbdc.png)
    - ![3307ed25ac39a8261ebe887e4be00055.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-8781abf7647e2c048aa99450960f9839230ea35f944dd6b85f8083af992c0432.png)
- 调度算法的评价指标
    
    - CPU利用率
        - ![46678502c12144cf4ec4721b951fe367.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-c80d5968891f6bb388d405182ffb75b68e9b4c376fd2a986e41223e07738965a.png)
    - 系统吞吐量
        - ![6bb2634aa372623a0748e6a9a9ce368c.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-d84c9ba90d2bece776c1d6a6d7215057c3cbeeda2e6905e2906af2a5d3485570.png)
    - 周转时间
        - ![3fbb4c4ee5c7644035444412fe472950.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-fd35f9ea9bb8fc37b75074d35dcb60a55e6143b01a8085891646e285ab30ab9a.png)
    - 带权周转时间
        - ![3c348f656e01f3961829b4108cdcebd5.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-3079dadcee3dc045649afc537c902bbae30f699817aec42510cd7402e810b507.png)
    - 等待时间
        - ![3002a05fb5d0bc6120f74cb311a73c44.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-5b20df98290c6e47595669bb8f730809acb93fdcf8750994d807e92c8033479e.png)
    - 响应时间
        - ![69753cbf294e138e8b42be551d847781.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-50cfa8632b8b55ebb7573942c18d426aceaf92e338d0487080e088810e26734f.png)
- 各种策略
    
    - 先来先服务
        - ![0a46bdf2126ed8902167fb21f5179d41.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-20785c83a2a0736186552c4704af9f8a178d1c7805c0df347aed36a5136fed92.png)
    - 短作业优先
        - ![fb3e797a5ec69fbbce8d81a81f7fdb7e.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-1a363e5133f67f9233013cefb6c26867f8762618053a00263f870ecbbf1fadec.png)
    - 高响应优先
        - ![530846a47ed730a89abf49aa2b9ca5cb.png](/images/articles/import-408-bi-ji-os-di-er-zhang-jin-cheng-yu-xian--4559a92f/img-9d2c19cd96d58cafa0fe200518556c4cff2bfb4c48df2e4869d72a34ff943533.png)
