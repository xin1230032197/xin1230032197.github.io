---
title: GPU Memory Hierarchy
aliases: [GPU存储层次, GPU 内存层次]
description: 从 Global Memory 到 Register，理解数据如何在 GPU 中流动。
date: 2026-09-01
updated: 2026-09-12
tags:
  - CUDA
  - GPU
  - Memory
order: 10
sample: true
---

GPU 的计算能力往往不是唯一的瓶颈。数据放在哪里、由谁访问、如何复用，同样决定一个 Kernel 的效率。

> 优化之前，先画出数据的路径。

## Overview

CUDA 提供不同作用域与生命周期的存储空间。编程模型中的存储空间与硬件 Cache 并不是一一对应的：例如，Global Memory 的访问也可能命中片上缓存。

![GPU 存储层次：线程私有 Registers，线程块共享 Shared Memory，所有线程访问 Global Memory](/diagrams/memory-hierarchy.svg)

| 存储空间 | 可见范围 | 典型用途 |
| --- | --- | --- |
| Registers | 单个线程 | 局部标量、循环计数 |
| Shared Memory | 线程块 | 协作加载、数据复用 |
| Global Memory | 设备上的线程 | 输入、输出和大数组 |
| L1 / L2 Cache | 硬件管理 | 缓存存储访问 |

## Global Memory

Global Memory 容量较大，数据在 Kernel 调用之间可以保留。相邻线程访问相邻地址，通常更有利于合并内存事务。

```cpp
__global__ void vector_add(const float* a,
                          const float* b,
                          float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];
}
```

### Coalesced access

上面的例子让相邻线程读写相邻元素。实际事务数量仍取决于访问宽度、地址对齐与设备架构，不能仅凭源代码行数推断。

## Shared Memory

Shared Memory 由同一线程块中的线程共享。常见做法是协作加载一块数据、同步、计算，然后再进入下一块。

> [!NOTE]
> 当线程之间存在数据依赖时，需要正确同步。不要让同一线程块中的部分线程跳过必需的 `__syncthreads()`。

### Bank conflicts

共享内存被划分为多个 Bank。访问模式可能导致冲突，使一次请求被拆成多次处理。Padding 有时能改善布局，但需要通过测量验证。

#### A small design question

增加共享内存的使用能减少重复加载，也可能限制同时驻留的线程块。优化是权衡，而不是单向地“使用越多越好”。

## Registers

寄存器保存线程私有的数据。寄存器压力过大时，编译器可能将值溢出到 Local Memory；这里的 Local 描述线程私有作用域，并不代表数据一定存放在片上。[^spill]

## L1 / L2 Cache

缓存由硬件管理。具体容量、共享方式和可配置项随架构变化，应查询目标 GPU 的文档。不要把某一代设备的数字写成永久规律。

## Arithmetic intensity

算术强度描述每传输一个字节完成多少计算：

$$
I = \frac{\text{FLOPs}}{\text{Bytes transferred}}
$$

在简化的 Roofline 模型中，可达性能受计算峰值与内存带宽共同限制，$I$ 越高并不总意味着更快：

$$P \leq \min(P_{\mathrm{peak}}, B \cdot I)$$

## Summary

1. 先确认数据的作用域和生命周期。
2. 尽量让访问连续，并复用已加载的数据。
3. 同时观察寄存器、共享内存与占用率。
4. 以目标硬件上的测量作为判断依据。

延伸阅读：[[缓存映射|Cache Mapping]] · [[coalesced-access|合并访存的地址分析]] · [NVIDIA CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)

[^spill]: Local Memory 通常位于设备内存中，其访问也可能被缓存。使用编译器资源报告与性能工具验证是否发生溢出。
