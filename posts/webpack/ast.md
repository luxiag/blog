---
title: ast
category: Webpack
date: 2021-10-21
---

## 解析过程

AST 整个解析过程分为两个步骤

分词：将整个代码字符串分割成语法单元数组
语法分析：建立分析语法单元之间的关系

## 语法单元

Javascript 代码中的语法单元主要包括以下这么几种

- 关键字：`const`、`let`、`var`等
- 标识符：可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些常量
- 运算符
- 数字
- 空格
- 注释

## 词法分析

```js
let jsx = `let element=<h1>hello</h1>`;

function lexical(code) {
  const tokens = [];
  for (let i = 0; i < code.length; i++) {
    let char = code.charAt(i);
    if (char == "=") {
      tokens.push({
        type: "operator",
        value: char,
      });
    }
    if (char == "<") {
      const token = {
        type: "JSXElement",
        value: char,
      };
      tokens.push(token);
      let isClose = false;
      for (i++; i < code.length; i++) {
        char = code.charAt(i);
        token.value += char;
        if (char == ">") {
          if (isClose) {
            break;
          } else {
            isClose = true;
          }
        }
      }
      continue;
    }
    if (/[a-zA-Z\$\_]/.test(char)) {
      const token = {
        type: "Identifier",
        value: char,
      };
      tokens.push(token);
      for (i++; i < code.length; i++) {
        char = code.charAt(i);
        if (/[a-zA-Z\$\_]/.test(char)) {
          token.value += char;
        } else {
          i--;
          break;
        }
      }
      continue;
    }

    if (/\s/.test(char)) {
      const token = {
        type: "whitespace",
        value: char,
      };
      tokens.push(token);
      for (i++; i < code.length; i++) {
        char = code.charAt[i];
        if (/\s/.test(char)) {
          token.value += char;
        } else {
          i--;
          break;
        }
      }
      continue;
    }
  }
  return tokens;
}
let result = lexical(jsx);
console.log(result);
```

::: details result

```js
[
  { type: "Identifier", value: "let" },
  { type: "whitespace", value: " " },
  { type: "Identifier", value: "element" },
  { type: "operator", value: "=" },
  { type: "JSXElement", value: "<h1>hello</h1>" },
];
```

:::

## 语法分析

- 语义分析则是将得到的词汇进行一个立体的组合，确定词语之间的关系
- 简单来说语法分析是对语句和表达式识别，这是个递归过程

```js
// babylon7 https://astexplorer.net/
// babylon7 https://astexplorer.net/
function parse(tokens) {
  const ast = {
    type: "Program",
    body: [],
    sourceType: "script",
  };
  let i = 0; //标示当前位置
  let currentToken; //当前的符号
  while ((currentToken = tokens[i])) {
    if (
      currentToken.type == "Identifier" &&
      (currentToken.value == "let" || currentToken.value == "var")
    ) {
      const VariableDeclaration = {
        type: "VariableDeclaration",
        declarations: [],
      };
      i += 2;
      currentToken = tokens[i];
      let VariableDeclarator = {
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
          name: currentToken.value,
        },
      };
      VariableDeclaration.declarations.push(VariableDeclarator);
      i += 2;
      currentToken = tokens[i];
      if (currentToken.type == "JSXElement") {
        let value = currentToken.value;
        let [, type, children] = value.match(/([^<]+?)>([^<]+)<\/\1>/);
        VariableDeclarator.init = {
          type: "JSXElement",
          openingElement: {
            type: "JSXOpeningElement",
            name: {
              type: "JSXIdentifier",
              name: "h1",
            },
          },
          closingElement: {
            type: "JSXClosingElement",
            name: {
              type: "JSXIdentifier",
              name: "h1",
            },
          },
          name: type,
          children: [
            {
              type: "JSXText",
              value: "hello",
            },
          ],
        };
      } else {
        VariableDeclarator.init = {
          type: "Literal",
          value: currentToken.value,
        };
      }
      ast.body.push(VariableDeclaration);
    }
    i++;
  }
  return ast;
}

let tokens = [
  { type: "Identifier", value: "let" },
  { type: "whitespace", value: " " },
  { type: "Identifier", value: "element" },
  { type: "operator", value: "=" },
  { type: "JSXElement", value: "<h1>hello</h1>" },
];
let result = parse(tokens);
console.log(result);
console.log(JSON.stringify(result));
```

::: details result

```js
{
    "type": "Program",
    "body": [{
        "type": "VariableDeclaration",
        "declarations": [{
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "element"
            },
            "init": {
                "type": "JSXElement",
                "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    }
                },
                "closingElement": {
                    "type": "JSXClosingElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    }
                },
                "name": "h1",
                "children": [{
                    "type": "JSXText",
                    "value": "hello"
                }]
            }
        }]
    }],
    "sourceType": "script"
}
```

:::
