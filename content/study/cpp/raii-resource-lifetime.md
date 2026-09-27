---
title: 用 RAII 管理资源生命周期
description: 从异常路径上的文件泄漏出发，用作用域、析构和独占所有权组织 C++ 资源管理。
date: 2026-09-27
updated: 2026-09-27
tags: [C++, RAII, 异常安全]
order: 10
---

打开文件、申请内存和获取锁，都建立了一项需要在将来履行的释放义务。如果释放动作只放在函数末尾，提前返回和异常就容易打断这条路径。RAII 的思路是把资源交给对象，让对象的生命周期承担释放义务。

## 从一条失败路径看问题

考虑一个打开文件后调用解析函数的例子。正常返回时会执行 `fclose`；如果解析函数抛出异常，控制流直接离开函数，裸指针本身不会关闭文件。

```cpp {5-6}
#include <cstdio>
#include <stdexcept>

void parse(std::FILE* file); // 解析失败时可能抛出异常
void load() {
    auto* file = std::fopen("notes.txt", "rb");
    if (!file) throw std::runtime_error("打开失败");
    parse(file);
    std::fclose(file);
}
```

在每个出口都补上一遍清理，很快会遇到重复代码。继续嵌套两三个资源后，清理顺序也开始难以审查。资源管理应成为结构的一部分，而不是要求维护者记住所有控制流分支。

## 把释放义务交给对象

`std::unique_ptr` 除了管理 `new` 得到的对象，也可以配合自定义删除器管理其他资源。下面的例子明确使用 `fclose`，不会错误地对文件句柄调用 `delete`。

```cpp {7-11,16}
#include <cstdio>
#include <memory>
#include <stdexcept>

void parse(std::FILE* file);

struct FileCloser {
    void operator()(std::FILE* file) const noexcept {
        if (file) std::fclose(file);
    }
};

using File = std::unique_ptr<std::FILE, FileCloser>;

void load() {
    File file(std::fopen("notes.txt", "rb"));
    if (!file) throw std::runtime_error("打开失败");
    parse(file.get());
}
```

离开作用域时，`file` 的析构函数调用删除器。在正常返回或通常的异常栈展开中，文件都会得到关闭。`get()` 只是借出指针，`parse` 不应据此接管所有权，也不应把它保存到超过 `file` 生命周期的地方。

> [!WARNING]
> 这个删除器忽略关闭失败，适合展示读取资源的生命周期。对需要确认写入成功的流程，应在正常路径显式检查刷新或关闭结果；析构函数不适合承担需要向调用者报告失败的提交操作。

### 所有权要在接口上可见

| 表达方式 | 通常表达的意图 | 需要审查的边界 |
| --- | --- | --- |
| `T&` | 借用一个已有对象 | 引用是否比对象活得更久 |
| `T*` | 可为空的借用，或底层接口 | 是否存在隐含的释放约定 |
| `std::unique_ptr<T>` | 独占所有权 | 是否需要转移而不是复制 |
| `std::shared_ptr<T>` | 共享所有权 | 是否产生循环引用 |

表格描述的是常见接口约定，不是编译器对所有裸指针语义的判断。旧接口可能使用裸指针转移所有权，需要在边界处进行封装。

## 锁也可以使用同一思路

锁的释放义务同样可以绑定到作用域。以下示例中，锁对象在数据访问完成后离开作用域；即使 `push_back` 抛出异常，锁也不会被遗忘。

```cpp {9}
#include <mutex>
#include <vector>

std::mutex values_mutex;
std::vector<int> values;

void append(int value) {
    // 临界区只包住必须同步的数据访问。
    std::lock_guard<std::mutex> guard(values_mutex);
    values.push_back(value);
}
```

> [!TIP]
> 先缩小临界区，再讨论锁实现是否足够快。把网络请求或耗时计算放进锁内，可能比选择哪一种锁影响更大。

## RAII 的保证有边界

RAII 依赖对象析构被执行。进程被强制结束、程序异常终止而没有栈展开，或者资源通过 `release()` 被主动脱离管理，都需要单独考虑。它解决的是正常语言执行路径中的资源生命周期，不是跨进程事务或断电恢复。

另一个常见误区是“没有资源泄漏，就有强异常保证”。函数可能在抛出异常前已经修改了部分业务状态。资源安全和业务操作的原子性是两个需要分别验证的问题。[^guarantee]

阅读建议：[C++ Core Guidelines：自动管理资源](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r1-manage-resources-automatically-using-resource-handles-and-raii)。

[^guarantee]: 例如先向容器 A 插入，再向容器 B 插入，第二步失败后，A 可能已经改变。若要求“全部成功或全部不变”，需要设计回滚或先构造后提交的步骤。

