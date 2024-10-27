---
title: NodeJS中的测试

---




## 单元测试

在计算机编程中，单元测试（英语：Unit Testing）又称为模块测试 [来源请求] ，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。

### 意义 

- 避免线上 bug,问题可以很快的被发现
- 提高代码的质量,一段编写良好的代码一定是“可方便测试”的
- 快速定位bug，每个测试用例可以关联某个模块
- 放心重构，加功能，再也不用担心“把代码改坏'
- 单元测试的质量也占据了评判代码质量的极大比重

```js
const assert = require('assert')

function addTwo(a) {
    return a +2;
}

function testAddTow() {
     const x =5;
     const y1 = x +2;
     const y2 = addTwo(x);
     try{
        assert.equal(y1,y2)
     }catch(err) {
    
     }
}

```

## Mocha
