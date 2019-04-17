# pachong

记一次蜂鸟地图下载（初学爬虫）（登录地址：https://www.fengmap.com/login/login.html）

## 本地调试

```
cd src/
```

```
node test.js
```

## 安装依赖

```
yarn
```
## 依赖说明

### 1. superagent

```
superagent是nodejs里一个非常方便的客户端请求代理模块
```
 
### 2. download

```
download用于之后下载地图
```

### 3. adm-zip

```
adm-zip用于将下载后的zip地图包解压
```

### 4. single-line-log

```
single-line-log可以让控制台在单行输出，之后显示下载进度会用到
```

### 具体步骤如下

#### 步骤一

```
设置请求头
  let reqHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
      'Chrome/73.0.3683.103 Safari/537.36'
  }

