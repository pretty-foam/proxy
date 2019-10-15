# introduce

Getting HTTP High Anonymity Proxy


## Instructions

### The first way


1. npm i  getting-agent -g
2. gat start  10      (10:Number of proxy IP acquired)

### The second way


1. npm i getting-agent

```javascript

const gat = require('getting-agent');
(async ()=>{
  const res = await gat(10,false) //10 Gets the number of proxy IP, false does not save local files, true saves local JSON files
  console.log(res)
})()

```


# 介绍

获取HTTP高匿代理

## 使用说明

### 第一种方式

1. npm i  getting-agent -g
2. gat start  10      (10:获取的代理IP数量)

### 第二种方式

1. npm i getting-agent

```javascript

const gat = require('getting-agent');
(async ()=>{
  const res = await gat(10,false) //10 获取代理IP数量 ，false 不保存本地文件，true 保存本地json文件
  console.log(res)
})()

```
