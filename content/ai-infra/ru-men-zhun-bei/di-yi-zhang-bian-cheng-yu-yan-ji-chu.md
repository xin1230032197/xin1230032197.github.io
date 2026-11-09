---
title: 第一章 编程语言基础
description: ""
date: 2026-11-08
updated: 2026-11-10
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
