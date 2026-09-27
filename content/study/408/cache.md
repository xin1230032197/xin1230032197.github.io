---
title: Cache Mapping
aliases: [缓存映射, Cache映射]
description: 直接映射、组相联与全相联：一个地址如何找到它的位置。
date: 2026-09-03
updated: 2026-09-10
tags:
  - "408"
  - Architecture
order: 20
sample: true
---

Cache 利用时间局部性与空间局部性，让常用数据更靠近处理器。映射方式回答一个问题：主存中的块，可以放进 Cache 的哪些位置？

## Address decomposition

常见的组相联 Cache 将地址拆成 Tag、Index 和 Offset。

| 字段 | 作用 |
| --- | --- |
| Tag | 判断是否为目标块 |
| Index | 选择 Cache 组 |
| Offset | 选择块内字节 |

## Direct mapping

每个主存块只有一个候选位置。硬件简单，但映射到同一位置的两个热点块可能不断互相替换。

## Set associativity

一个块先通过 Index 找到一组，再比较组内多个 Way 的 Tag。提高相联度能缓解部分冲突，但会增加比较与替换管理的成本。

### A worked example

假设 Cache 的数据容量为 32 KiB，块大小为 64 B，采用 8 路组相联，则共有 64 组。在按字节寻址、采用通常的位划分映射时，块内偏移和组索引各需要 6 位。

$$S = \frac{C}{B \times E} = \frac{32768}{64 \times 8} = 64$$

## Fully associative

每个块可以放到任意位置，无需组索引。更多的放置自由度伴随更多硬件成本。

## Takeaways

Cache 容量、块大小和相联度需要一起理解。命中率只是性能的一部分，命中延迟和缺失代价同样重要。

相关：[GPU Memory Hierarchy](/infra/cuda/memory-hierarchy)。
