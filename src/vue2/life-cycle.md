---
title: Vue2.x 生命周期
date: 2021-05-01
category:
  - Vue
type:
  - vue2
---

![](./images/lifecycle.png)

## 父子生命周期

父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounte

父beforeUpdate->子beforeUpdate->子updated->父updated

父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
