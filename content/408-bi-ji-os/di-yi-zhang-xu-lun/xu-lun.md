---
title: 绪论
description: ""
date: 2026-10-12
updated: 2026-11-14
tags: []
aliases: []
order: 0
---

## 操作系统的概念
![39dd2567fd430e2b40772c5fd696a193.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-5805448e3f772d381e3a15a5d6b943d9e0b7cf4119d83aa0aaa5750a00d13d86.png)
   1. 作为系统资源的管理者
 ![502ff41c73814f0cc8ac1bafb7072924.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-fadbcfc0e63d5cf3dd248864dd9b4ba9391673a855619e3ff96edf80465f5766.png)
       > 功能和目标 就是封装啊 向上层提供更易用的服务
  2. 接口
   - 交互式命令=联机命令接口![15fdd2b54a8b87c297aba7e9c31839cb.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-dfb8dc1b4ee30c03870bfd2ef8c9c8f3d87008b2b50993baa5a3e476039199e5.png)
  - 脱机命令接口=批处理命令接口
         ![3882eec324690ec710839e73569435f6.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-300387316f782f64bbc0b0a0011266032333bd9528f23dec01ec11b2057ca6ef.png)
    > 以上两种接口是面向用户的
 - 程序接口
     ![215addf482f6220582a85d9238046fd5.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-67b6dca75a9a80abece5c62ad9e6309c82b83c64e45573d657f92e01713fcd68.png)
   > 这种接口是面向程序员的
## OS的四个特征
1. 并发
    ![5576a2b3bf23ab35c23b2af00535297d.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-f436d54f5b7e6c310680042e486bf5681e737c0821d9405275fee335b4306d92.png)
   > 并发性：宏观上同时微观上交替
2. 共享
    - ![72ee11c7b6793b3e9442b5b33db04305.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-8d55644db49d9df32ef0621db46af61f278bdfb3e4814196e51a21d43edbc25e.png)
    - 以上两个的关系![99d4d9e46aa3bda9b5c364fd50beb1f3.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-dbb85ad9e4b85ce8c8921b6285aa1676638daec9f62b9db2caf09f0399da9f5e.png)
    > 我在想的是 同时共享是不是只读呢 然后互斥的话就是可写可读
3. 虚拟化
   - 空分复用技术![8072dd4719da11ea37889c76996f99fc.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-5083c2e81ffa6b58b79fe226891a5efbfab64039ed52302f8271a6524f56eb29.png)
   - 时分复用技术![18f66938af76362a5e066039d4a1e80e.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-af0e64ff04161cc610e220600d135f62e0bc73a2002ba28f1ccecb85dc73a16a.png)
4. 异步
    ![96db84226789db9d04ac5ca92d03923d.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-c54675e86c3c8998c96a3abcb4cf633b609d67cbe549b2f7d2e5261b437e656c.png)
## OS的历史发展

  - 单道批处理系统
     ![cf1c0f258088736aed9915707b0b3a96.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-ea2968d56a06a7a3c8d22b9a329462283ffe960d8801e1ae58a44cc986a69de7.png)
- 多道批处理系统
    ![10548dfa69e990c74908473d44df9cc4.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-516e70cd3ced024ac9149c9218b51e8e94a1997dc428675eeec17075933c0e9d.png)
  > 个人理解就是使用了共享 使得各个部件的利用率上升了
- 实时操作系统
   ![adbb006cf17f8c08af527d8a5991850a.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-b675e8c58489ce4e57a158e277bcc2c71447adf206765e7a3a00d483aa532cd4.png)
  > 除此之外还有 网络操作系统和分布式操作系统
  > 
  > 网络操作系统：把网络中的计算机结合起来实现网络通信和资源共享，比如说局域网联机
  >
  > 分布式操作系统：分布性和并行性，超大机房
- 分时操作系统
    ![4dd1e8ce52c849a0be0d942384722ace.png](/images/articles/xu-lun/4dd1e8ce52c849a0be0d942384722ace.png)
- 个人操作系统
  - linux Android and Windows ios and so on
- - -


## 操作系统的运行机制
  - 指令
     ![a0fc5287e995b32b256a6d442f7cc75d.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-bf20f7673be823d8dc9fa532c5ff8e7007556f16ee6b525e1cddf30bbfa93815.png)
- 处理器状态
   ![d477123cdfb7cc6cf9aa6f4a03fe3077.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-ca1e24c7cb0a1bb5aff33df1432a79565da2deae6014a743267cfb16ff75da05.png)
   - 如何实现切换
      ![a0ef2d880770d64f8a42eb732c8f5f0b.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-db5553dfc9b04ff0541a6b4641499b0f2c5a630567e6f76abfed04ff1fe03126.png)
    - 程序
        - ![4616189ea06207553981c93a4697cd9d.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-347fe7b3476d1ec8210f007e8d3c25303c8b10fc1cf5a3508f59a23ab8c87afd.png)
     
- 时钟管理
  - 时钟第一功能计时
  - 提供标准的系统时间 然后通过时钟中断的管理实现进程切换调度等
- 中断
    - 作用
        - ![187e76988678a73aa64c731a3bdeff42.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-8b4eae0f09a4094dcd438764feff899e179a4f552a00ffb6641557ad7e1f6b80.png)
    - 类型
        - 内中断 也叫异常
            - ![65dfd939f2bf63788df9a8defdc5d7e5.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-dde5884552246c8229767321adbef830ff600a2d5e38306e4b52d660e1876aca.png)
            - 例子：指令中断 比如说 需要该换其他态去获取更多权限
            - 比如说trap fault abort终止
        - 外中断
            - ![870ef7061ea0674805fe23d150a7db96.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-5d3e6af6ab0f0db99c94e1525234bfcc642461e1f01a2c85603a3f20e389d139.png)
            - 例子：IO中断 时钟中断
        - 分类总图![883cad3ba7a74042e4cb60a3f5deb728.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-197ce1cea193eef7986ba509fc619eae6fe763087ca6f82720180e23d04dda7f.png)
        - 实际上这里分类的话内分段分成自愿中断和强迫中断，比如说指令中断主动自愿，强迫中断分成硬件故障和软件中断。 外中断则是外设请求or人工干预
        - 基本原理：![10cd071235e061edfd2f2e668b177a33.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-a8aebf0e6e74daaca31e987eb55c49bf65fd00cd143b60a34c57014e48aa52cd.png)
## 系统调用
  - 系统第哦啊用简单介绍 ![327df37697425993c29b3a079f87fad7.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-47aa958ddc8524c1b8979da7e67efba4c0758da9278531aca059d4dce651fbe7.png)
- 和库函数的区别![eb80134ba2f94318dbe7568064928e24.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-4063d4fcabd09b8b26ac314b8c23a37f64869936863b90d8c315fc42a6d25fd8.png)
- 什么时候必须使用系统调用
   ![4b764417cdb81b2dc57fdc95ee4b625b.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-579cf22ccf7c14ae91910fb10b5f66babf8b576f235979b7eedc70ec80e7944f.png)
  - 系统调用的过程![1c38fd9e340cbf1478013d256bcce14e.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-7a95633452bb55b5ff36f607e6acb00c2a58d46ae2611105b381fd3b1aa83246.png)
##  操作系统体系结构
  - OS内核 原语 以及
![3eb5052502437e49513ec33a73a43548.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-3661590b1a3f21b5bf8cc485c65a3b7a37f16691b98076d5fa31c68b8059ef20.png)![0e4dd13fb5d4bef0bddcd8b7f73c2bb5.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-75e651c888931f2170a6027d8f2437dbea52907fc13aec087c426c0b2895f75f.png)
    
    - 大内核与微内核

    ![09ae5f47e32f3cf8986d760ffad55b88.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-eebc2d919c04c94b9354ca78f20c777ab7e0b59f19f02f8ddf57bfe0fb9b555b.png)
## OS的不同结构类型

  - 分层结构![3fb85a1e6e442d68362e9e7b70e882ad.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-6910bf2c40099b27b5cbb05eb5602a2997a35d48b8b5b823e8131d377808c1f1.png)
    1. 便于系统提奥什验证 易于扩充维护
    2. 合理定义层级困难 效率差需要自底向上 
  - 模块化![a3110a3ea1902f4e1eef26a0c878a8f7.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-e1efb3b4b64239eb8ad16324b033b5ad1d023d77e52f2431a3dc339b1443a7b2.png)
    1. 划分的模块太小或导致系统过于混乱 太大会增加模块内部复杂性
    2. 考察独立性，也就是模块内部各部分之间的密切程度越高越好 耦合度 模块间的密切程度越低越好 感觉和聚类分析的定义差不多
  - 宏内核微内核
    ![image.png](/images/articles/xu-lun/image-2.png)
    1. 宏内核各个管理模块共享信息，性能优势巨大
    2. 微内核技术就是将一些非核心的功能迁移到用户空间，好处就是方便扩展系统内核不用去做改动
  - 微内核
    - 概念
      - 把不需要内核态执行的功能移动到用户态执行降低内核的设计复杂行。移动出来的OS分成若干程序执行独立 交互借助于微内核进行通信
     
    - 结构   
      - 微内核通常包含：与硬件紧密相关的部分 一些基本的功能 客户和服务器之间的通信
     
    - 基本功能
   
      - 进程线程管理
      - 低级存储器管理
      - 中断陷入处理
    - 特点
   
      - 扩展性和灵活性
      - 可靠性和安全性
      - 可移植性
      - 分布式计算


        
- 外核 暂时不列入
  - 对资源进行划分？为每个用户分配整个资源的自己，优点是减少而资源的映射曾 并且 分离了多道程序与用户操作系统代码
- 总结![dab191d80f3ff23d5acb8e53503a6cf2.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-0098a11a4044e134f7e7e8a2873b5bd8f42fb72ac803ceb627990f6b855d70b0.png)
- 操作系统引导
    - ![beee6f465c2d44beafefe07d23cf4048.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-dd208ec7fad26bc081cd99064725522b3e457ff734dc1b67d14bf2df77b4203f.png)
    - 复述一下王道书内容
      1. 激活CPU，通过读取ROM区boot成俗，执行BIOS指令
      2. BIOS构建中断向量表，然后POST进行通电自检，检查自己是否出现故障。出现故障的话就中断，这也是为什么前面要构建
      3. 加载OS的硬盘，BIOS读取 Boot Sequence把控制权交给启动顺序第一位的存储设备，然后CPU把该设备引导扇区的内容加载到内存中
      4. 加载主引导记录MBR，目的是告诉CPU去哪儿硬盘的哪儿找OS
      5. 扫描硬盘分区加载硬盘活动分区，找到硬盘活动分区之后加载移交控制权
      6. 加载分区引导记录PBR 用于寻找激活分区根目录下用于引导操作系统的程序
      7. 加载启动管理器 最后加载OS把OS加载到内存运行 
- 虚拟机
    - 传统计算机![4a0ce046ced48dc0deacf4005cdae0bc.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-c241ee100c826d7ec1b789c465b284dc6b0acae3c1325a1e240a383244225c3d.png)
    - ![4323891123476897b976a64864f8f4cc.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-a9ec1e40859d893be161b1bd799703409940f0faa595c801dd582b3d96ba81b2.png)
    - ![7c59622b44417e466494033439e713e8.png](/images/articles/import-408-bi-ji-os-di-yi-zhang-xu-lun-9eaf3dad/img-c781b68afb7535b1d3f29137a449d35213b052594dd67ca90cfd11a36b20a822.png)

- 做题补充
  - 常见的特权指令：IO指令，开关中断指令，修改PSW指令
  - 访管指令：用户调用的指令，所以不是特权指令 trap 原理上是INt 一个特殊值
  - 处理终端的时候，硬件负责保存**PC程序计数器 and PSW程序状态字**OS保存**除了硬件意外的还需要使用的不可恢复的内容**
  - ![image.png](/images/articles/xu-lun/image.png)
  - 这很奇怪吧 但是保护屏蔽字就是OS的事情
  - 时钟部分：硬件定时器到时
      ↓
产生时钟中断
      ↓
CPU 响应中断，进入内核
      ↓
时钟中断服务程序执行：
更新时间、统计 CPU 使用时间、扣减剩余时间片
      ↓
检查是否需要调度
> 不是，这谁懂啊
-
  - CPU从用户态转化成内核态，是硬件在内核处理程序执行之前就已经状态切换完了
> 不是，这玩意也没学过啊
