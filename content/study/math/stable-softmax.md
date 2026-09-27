---
title: 从指数溢出到稳定 Softmax
aliases: [稳定Softmax, 数值稳定Softmax]
description: 从一个可复现的溢出例子出发，推导减去最大值的等价变换，并讨论浮点边界与验证方法。
date: 2026-09-27
updated: 2026-09-27
tags: [数学, 数值稳定性, Python, Softmax]
order: 10
---

Softmax 把一组实数转换成非负且和为一的权重。这个定义很短，但“数学上有定义”和“计算机能准确算出”是两件事。理解这一区别，比记住一段实现更有用。

## 从定义开始

设输入向量为 $x=(x_1,\ldots,x_n)$，第 $i$ 个分量对应的输出是

$$
p_i=\frac{\exp(x_i)}{\sum_{j=1}^{n}\exp(x_j)}.
$$

在实数运算中，只要输入有限，分母就大于零。实际计算使用有限位数的浮点格式，指数结果可能超出可表示范围。以常见的双精度环境为例，直接计算 `math.exp(1000.0)` 就会溢出；最终比值本来应该有限，并不能保护中间结果。

> [!NOTE]
> 溢出发生在指数运算阶段。把分母加上一个很小的数，无法修复已经溢出的分子。

## 为什么可以减去最大值

给所有输入减去同一个有限常数 $m$，相当于把分子、分母同时乘以 $e^{-m}$：

$$
\frac{e^{x_i-m}}{\sum_j e^{x_j-m}}
=\frac{e^{-m}e^{x_i}}{e^{-m}\sum_j e^{x_j}}
=\frac{e^{x_i}}{\sum_j e^{x_j}}.
$$

取 $m=\max_j x_j$ 后，每个指数的参数都不大于零，因此指数值不会超过一；至少一个参数为零，对应的指数为一。对有限输入，这消除了直接指数计算的上溢风险，也避免分母因所有指数都下溢而变成零。

### 一个可以运行的实现

下面的实现拒绝空输入、NaN 和无穷值，让它的适用范围保持明确。第 9–11 行是稳定化的关键，`math.fsum` 用于减少求和阶段的精度损失。[^fsum]

```python {9-11}
import math

def softmax(values):
    values = [float(x) for x in values]
    if not values:
        raise ValueError("输入不能为空")
    if not all(math.isfinite(x) for x in values):
        raise ValueError("输入必须是有限数")
    maximum = max(values)
    weights = [math.exp(x - maximum) for x in values]
    total = math.fsum(weights)
    return [weight / total for weight in weights]

print(softmax([1000.0, 1001.0, 1002.0]))
```

三个权重约为 `0.090031`、`0.244728`、`0.665241`。它们和输入 `[0, 1, 2]` 的结果一致，展示了平移不变性。

## 把性质写成检查

单看一次输出很难发现问题。更可靠的检查来自定义：输出非负、总和近似为一、等值输入产生均匀权重，以及整体平移不改变结果。

| 输入 | 检查目标 | 预期行为 |
| --- | --- | --- |
| `[0, 0, 0]` | 对称性 | 每个分量约为三分之一 |
| `[1000, 1001, 1002]` | 大正数 | 不因指数上溢而失败 |
| `[-1000, -1001, -1002]` | 大负数 | 最大分量仍占最高权重 |
| `[0, -1000]` | 极小概率 | 次要分量可能下溢为零 |
| `[]` 或含 NaN 的输入 | 定义域 | 显式报错 |

```python {3-5}
p = softmax([1000, 1001, 1002])
q = softmax([0, 1, 2])
assert all(value >= 0 for value in p)
assert math.isclose(math.fsum(p), 1.0)
assert all(math.isclose(a, b) for a, b in zip(p, q))
```

> 数值稳定性不是消除一切舍入误差，而是避免让不必要的中间结果破坏一个本可求解的问题。

## 需要对数概率时

先计算概率再取对数，可能遇到概率已下溢为零的问题。可以直接写出对数形式，把危险的乘除法转化为更合适的运算顺序：

$$
\log p_i = x_i - m - \log\left(\sum_{j=1}^{n}\exp(x_j-m)\right),\qquad m=\max_j x_j.
$$

这也是阅读数值代码时值得关注的习惯：先确定真正需要的输出，再选择公式。减去最大值不能让无限大的输入恢复有限，也不能保证每个极小概率都可表示；边界条件仍应明确记录。

[^fsum]: `math.fsum` 的求和精度与平台实现有关，不能把它理解为任意精度运算。接口说明见 [Python 数学函数文档](https://docs.python.org/3/library/math.html#math.fsum)。

