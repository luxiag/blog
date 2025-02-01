---
title: 泛型
date: 2024-12-05
category:
  - DotNet
---


```cs
public static void ShowInt(int iParameter) {
  Console.WriteLine(iParameter);
}

public static void ShowString(string sParameter) {
  Console.WriteLine(sParameter);
}


```

```cs
// 1.任何父类出现的地方都可以使用子类来代替
// 2.Object是所有类的父类

// 问题
// 1. 装箱拆箱

public static void ShowObject(object oParameter) {
  Console.WriteLine(oParameter.GetType().Name,oParameter)
}

```

设计思想--延迟声明：在声明的时候不指定类型，在调用的时候再指定类型
