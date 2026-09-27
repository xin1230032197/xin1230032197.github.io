---
title: I/O Models
description: 从等待数据到完成拷贝，分清阻塞、非阻塞与多路复用。
date: 2026-09-02
updated: 2026-09-08
tags:
  - Systems
  - Linux
  - I/O
order: 30
sample: true
---

讨论 I/O 时，先明确两个维度：调用是否等待，以及完成通知如何交付。阻塞与异步并不是同一个维度的两个端点。

## Blocking I/O

阻塞读取可以等待数据就绪，再把结果返回调用者。实现直观，但一个线程在等待期间无法继续执行其他用户代码。

## Non-blocking I/O

非阻塞描述调用在无法立即完成时返回，而不是保证操作“已经完成”。调用者需要处理重试与部分读写。

## Multiplexing

`select`、`poll` 和 `epoll` 可以等待多个文件描述符的就绪事件。就绪表示可以尝试相应操作，不表示业务请求已经处理完成。

### Readiness is not completion

事件到达后仍需读取、解析并更新连接状态。正确处理 EOF、错误和背压，比选择某个 API 更基础。

## A practical checklist

- 是否处理部分读写？
- 如何管理缓冲区？
- 连接关闭时是否释放资源？
- 慢消费者是否会导致无限积压？

参考：[Linux epoll 手册](https://man7.org/linux/man-pages/man7/epoll.7.html)。
