---
title: 第一章 编程语言基础
description: ""
date: 2026-11-08
updated: 2026-11-13
tags: []
aliases: []
order: 0
---

基于https://caomaolufei.github.io/AIInfraGuide/prerequisites/ 的学习
- - -
## 三层语言
脚本语言->系统层->设备层

python shell c/c++ CUDA c++

## 工具
```bash
python --version       # 正在使用哪个 Python
which python           # 这个可执行文件来自哪里
python -m pip --version

g++ --version          # C++ 编译器版本
cmake --version        # 构建系统版本

uname -a               # 内核与系统信息
ps aux                 # 有哪些进程
free -h                # 主机内存使用
df -h                   # 文件系统容量

nvidia-smi             # 驱动可见的 GPU 与进程
nvcc --version         # CUDA Toolkit 中的编译器版本
# 比如说出现问题的诊断路径？
```
## python基础
> 写一些重要的部分算了，权当回忆
> 
> 妈的出大问题了，vibe coding太久了代码全忘完了
- - -
额外补充一些知识把
```python
#->用于标注函数返回值类型的符号
def happpy(scale:int)->float: #这里：表示的是类型标注
# Callable用于表示可以呗调用的东西
Callable[[float],float]#前面表示参数类型 后面表示返回值类型
# lambda表达式 简单函数
lambda i=i: i for i in range(3);
#然后接下来是@，@是一个装饰器 1会把定义的东西交给他处理
def log(func):
    def wrapper():
        print("开始执行")
        result = func()
        print("执行结束")
        return result

    return wrapper
@log
def greet():
    print("你好")


greet()
#这里实际发生的就是log(greet)

```
>:有很多用法 比如说while： def：表示内容 在lambda里面用于分割参数和返回的表达式，在名字后面表示类型标注
>在字典里{}分割key and value 在[]里切片 eg:[开始：结束：步长] 格式化字符串中引出显示格式
>
>还有：=这个是一个赋值 然后再泛型类型参数里面也可以用作写类型的上界
- 关于@
    - python内置了三个@property @staticmethod @classmethod
    - ![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-2.png)
    - 装饰器也可以带括号，当带括号的时候先调用他取得装饰器，当然要看文档观察参数作用

- 关于实例方法类方法还有静态函数
  - 关于*self*对象 *cls*类 是约定俗成的参数名字
  - 实例方法操作具体对象 类方法接受类本身 静态方法只传参数
  - ![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-3.png)
- 关于next（）

  -  ![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-4.png)
- 关于迭代器

  - 一共能够反复用于next（）的对象，靠yield给出值
  - 实际上也是for的来源，再容器对象上面调用iter()迭代器 然后不断用__next__去进行调用，到最后用StopIteration异常结束
  - 所以可以给类去添加一共迭代器行为

- 生成器
  - 在普通的def函数里面写yield 就是生成器函数 调用之后得到一共生成器对象
  - 之后的每次next取值 函数才执行直到遇见下一个yield 
- 其中如果把生成器转化城其他的内容会重新物化元素导致性能变差

- 生成器一般只能消费一次

- - -
1. 名字绑定对象，赋值建立引用
2. is 表示身份 ==强调逻辑
3. 可变对象不可变对象
```python
int a=10;
a=20;
# 这里面对象是10，对a赋值20本身不改变10而是创立新的引用 让a->20
c=[1,2];
d=c;
c.append(3); # 这种就是更改可变对象
d=[23,1];# 绑定新的对象
```
  - 也就是说对于不可变对象，新的绑定其实是创建了一个新的对象，但是对于可变对象也可以绑定新的对象而不是更改
    - 不可变对象有**int,float,bool,str,bytes,tuple**
    - 可变对象**list,dict,set**以及大多数实例

4. 深浅拷贝
```python
import copy;
src=[[1],[2]];
shallow=src.copy()# 浅拷贝
deep=copy.deepcopy(src)#深拷贝
# 区别在于 浅拷贝对于这里的外层会复制但是对于src里面的[1],[2]会变成指向，也就是如果对于src里
#的两个列表依旧会导致对shallow里进行改变，但是对于deep并不会影响
```
但是并不是所有的拷贝都要用深拷贝，否则会产生大量开销，要思考只读和读写

以及函数的参数默认参数只会创建一次

5. 作用域and闭包andLEGB
   - LEGB=Local ENclosing外层函数 Global模块 Buitins内置
   - LEGB也就是python查找名字的顺序
   - 闭包会保存外层作用域的变量
   - 闭包再调用的时候才会读取外层名字
    > 所谓闭包就是函数 能够再外层执行结束之后继续使用外层的变量

6. 类数据模型与协议
    -  特殊方法![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image.png)
        -  当然，我是当成c++里面重载运算符一样去认为的  
7. with自动关闭包

8. 异常处理原则：1. 只捕获具体异常 2. 能恢复才捕获 3.![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-5.png)

## PYTHON并发性能分析
### python多线程基础
1. 多线程threading
   - 实质上是：单一进程内部多个线程交替执行任务，适用于大量阻塞IO操作
   - https://docs.python.org/zh-cn/3.14/library/threading.html
   - _thread底层及多线程API
     -   https://docs.python.org/zh-cn/3.14/library/_thread.html#module-_thread
   - 简单给出
     ```python
     import threading
     Thread()# 创造线程
     start() #启动线程
     join() # 等待线程执行结束
     is_alive()#检查线程是否仍在运行
      ```
2. GIL全局解释器锁
   - 可以通过自由线程构建版禁用，实现真正的线程并行执行
   - 而且有阻塞IO、numpy、pythrch原生拓展的时候释放GIL
3. ThreadPoolExecutor线程池
    - concurrent.futures 模块提供的线程池工具。
    - 提前创造一定数量的工作线程，让这些线程反复执行任务
    -  1. 主线程提交任务
       2. 任务进入任务队列
       3. 空闲工作线程从任务队列中去除任务
       4. 执行任务保存结果
       5. 主线程获取结果
    -  介绍一些代码 
        -  1. from concurrent.futures import ThreadPlloExecutor
           2. ThreadPoolExecutor(max_workerds=num) 此处num喂线程池最多使用工作线程 如果不指定的话默认是min(32,(os.process_count() or 1)+ 4)
           3. 池名.submit(fn,*args,**kwargs)将一个函数机器参数交给线程池运行并且返回一个Future对象。
              - 其中 fn是执行函数 *args是传递给函数的位置参数
              - **kwargs**是传递给函数的关键字参数   ，注意以上参数不限量
              - 结束之后返回future，然后单独及逆行处理
           4. future对象
               - future作为每个任务和状态结构凭证
               - 常用方法如下
                 -   ![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-6.png)
               - 当任务没完成的时候 **result（）** 会等待
               - **cancel()** 不能在future执行的时候停止
           5. **map(fn, *iterables, timeout=None, chunksize=1, buffersize=None)*** 批量提交任务 但是需要函数相同 只是参数不同，最终结果按照顺序获取结果
           6. **as_completed()** 谁先完成就处理谁
           7. **with() and shutdown()**
              - 当离开with的时候，线程池会自动执行固安必操作，并且等待任务完成
               ```python
               with ThreadPoolExector(max_worker=3)as exector

                 exector.submit(worker,1)
                 exector.submit(worker,2)
                 exector.submit(worker,3)

              print("exit")
              ```
              在这里 print会在所有任务执行完成之后在打印
              - shutdown的功能是手动关闭线程池
![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-7.png)
            8. 死锁和线程安全
               - 也就是使用lock（）独占共享内存，防止死锁，OS会学的
              
            9. 补充线程之间的通信
                - **queue.Queue()**  一种线程安全的数据传递机制，这点区分与进程
                - put()get() 放入取出任务 task_done()告诉队列任务处理完成 join不解释了
                - 共享list使用锁去解决


4. asyncio
   - 使用一个线程管理大量任务，当任务遇到io等待的时候，切换
   - 协程函数 **async def fun()** 得到的是一个协程对象
   - 执行方法**asyncio.run(fun())** 首先fun()创建协程对象，然后 asyncio.run()创建并管理事件循环，执行，返回100，最后run返回结果
   - await asynico.sleep() 用于挂起当前协程用于允许事件循环调度其他任务
   - asyncio.creat_task() 把协程安排到事件循环中执行 等效于asyncio.gather(),可以批量写 返回一个task对象
5. 多进程
   -  超越GIL的真并行 比如说计算求和的时候可以多CPU计算 乱发命令等等
   -  和线程区别最重要的是不共享变量
   -  创建一个新的进程消耗很多空间资源和时间资源，所以适用于大量数值计算复杂py循环图像处理密集型数据处理
   -  Process(target=) 创建进程对象 target指定子进程执行的函数 args kwargs不必多说
   -  strat() join() is_alive() 上文提到过
   -  terminaite()请求终止 exitcode()查看子进程退出码
   -  需要注意的是 一定要写 if name=="main" 避免子进程无线叠加主进程 另外还需要注意子进程目标函数定义在模块顶端 不适用局部函数lambda 或者无法序列化的对象
   -  进程池
       -  和线程池的思路是一样的![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-8.png)
        ```python
        from concurrent.future import ProcessPoolExector# python提供
        import os
        ProcessPoolExecutor(max_workers=num)# 进程的数量
        ```
        - ![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-9.png)
    
   -  进程间通信IPC
     -  Queue进程队列 ：
         1. 线程之间也可以使用**queue.Queue()**  当然进程的目的是传递不同进程之间的信息
         2. ```python 
              import multiprocessing as mp
              q=mp.Queue() # 创建队列
              p=mp.Process(target=worker,args=(q,))#将队列传递给子进程
              p.start()
              #这里假装子进程实际上通过q.put()输入了result
              result=q.get()#读取数据
            ```
      - Pipe 管道通信
        - multiprocessing.Pipe()
        - 仅仅支持两进程之间通信，点对点 send() recv()接收发送 close()关闭链接
      - Manager:共享python对象
        - ```python
          multiprocessing.Manager()
          manager.list()
          manager.dict()
          manager.Queue()
          manager.Namespace()
          manager.Lock()
          ```   
        - 需要注意这个是一个管理进程，然后让其他的进程向这个管理进程去发送操作请求
        - 进程池也通常使用这个东西呢
 - 共享内存 Shared Memory
   -   from multiprocessing import shared_memory
   -   以后用得上再说吧
 - 多进程同步
   -   mulitiprocessing.Lock() 也就是进程锁
   -   lock=mulitiprocessing.Lock();with lock: 然后去进行操作
   -   multiprocessing.Value("i",0)创建一个可以被多进程访问的共享数值对象，其中i表示类型 0是初始值
   -   锁只允许一个进程进入临界区 但是有的时候限制多个 multiprocessing.Semphore(n)此限制n
   -   需要类似于join() event.wait()表示等待时间被设置  event.set()解除
![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-10.png)
  - 进程启动方式**spawn fork forkserver**
    - spawn 先创建py解释器 然后导入模块 准备执行任务 执行子进程函数
      - 进程相对独立 不复制父进程的整个状态 开销大 需要可序列化
    - fork![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-11.png)
      - cow on write
      - 只有当修改对应内存页的时候才会启动赋值，所以开销相对比较小
    - forkserver
      - 启动一个 forkserver。主进程请求创建子进程。forkserver 创建新的子进程。子进程执行指定任务。兼容效率和安全
     
6. 序列化
   - 一个进程无法直接访问其他的进程所以，需要![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-12.png)
   - pickle模块
     - **pickle.dumps()** 序列化
     - **pickle.loads()** 反序列化
     - data
  ↓
pickle.dumps(data)
  ↓
bytes
  ↓
pickle.loads(bytes)
  ↓
new_data
      - **dump()** 序列化写入文件
      - **load()** 从文件读取并且反序列化
- - -
9. Python并发提示点
    - **asyncio** and **thread**  循环 and 多个线程交替，避免阻塞-> I/O密集
    - 线程的内置操作看起来正确，实际上很有可能会破坏这个假设
    - 多进程成本高
    - asyncio协作IO开发 ，应当使用异步库或者把阻塞工作放到线程进程执行器（？）
    - 基准测试不能只测一次，不能把初始化算进去or忘记GPU异步执行
    - 排查顺序![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-13.png)
    - python优化迅速![image.png](/images/articles/di-yi-zhang-bian-cheng-yu-yan-ji-chu/image-14.png)
