# 简介
基于[NEI](https://github.com/x-orpheus/nei-toolkit)实现的本地MOCK服务功能。支持一个工程使用多个NEI项目。

## 使用

安装：

```bash
npm i mock-nei -D
```

启动本地mock服务：
```javascript
const express = require('express')
const mock = require('mock-nei')
const app = express()
const keys = ['projectKey1','projectKey2']
mock(app, {keys, online: true})
```

## 参数说明

| 参数   | 说明                        | 默认值 | 是否必填 | 类型    |
| ------ | --------------------------- | ------ | -------- | ------- |
| keys   | NEI project key             | []     | 是       | Array   |
| online | 是否使用 NEI 在线 mock 功能  | false   | 否       | Boolean |
| root  | mock文件路径                 | 'mock-nei'| 否       | String |
