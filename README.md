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
设置请求头（具体情况可以根据需要增加或者删减请求头的内容）

  let reqHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
      'Chrome/73.0.3683.103 Safari/537.36'
  }
  
利用superagent发送请求

  superagent
      .get('https://www.fengmap.com/FMCloud/user/dk')
      .set(reqHeaders)
      .query({ _: Date.parse(new Date()) })
      .end((err, res) => {
        if (err) {
          console.log(err.message)
          return
        }
        cookie = res.header['set-cookie']
        dk = res.body.dk
      })
      
如下图，请求需要带一个时间戳
```
![image](https://github.com/895433995/pachong/blob/master/images/step1.png)

```
如下图，拿到set-cookie的内容，dk在res.body里
```
![image](https://github.com/895433995/pachong/blob/master/images/step11.png)

#### 步骤二

```
登录并获取access_token

  superagent
      .post('https://www.fengmap.com/FMCloud/user/login')
      .set(reqHeaders)
      .set({
        cookie: cookie
      })
      .query({ timestamp: Date.parse(new Date()) })
      .send({
        fmuserName: fUname,
        isAuto: false,
        password: strEnc(encodeURIComponent(fPwd), dk, '', '')
      })
      .end((err, res) => {
        if (err) {
          console.log(err.message)
          return
        }
        access_token = JSON.parse(res.text).access_token
      })
      
如下两张图，此次请求还是需要带一个时间戳，设置之前获得的cookie，并且发送登录需要的账号和密码（这里需要注意的是密码是经过加密处理的，可以将加密的strEnc.js文件下载下来，之前获得的dk现在派上用场了）,请求成功后就获得需要的access_token了
 ```
![image](https://github.com/895433995/pachong/blob/master/images/step21.png)
![image](https://github.com/895433995/pachong/blob/master/images/step22.png)

#### 步骤三

```
有了access_token之后，事情就好办了！（以下是我本次练习的一个项目，主要定时去爬取可下载的地图，之后想做什么就看自己的需求了）

请求地图数据
  
  superagent
      .get('https://www.fengmap.com/FMCloud/map/owner')
      .set(reqHeaders)
      .query({
        access_token: access_token,
        t: Date.parse(new Date()),
        _: Date.parse(new Date())
      })
      .end((err, res) => {
        if (err) {
          console.log(err.message)
          return
        }
        res.body.list.map(item => {
          if (item.enableEdit === 1 || item.enableEdit === '1') {
            maps.push(item.mapId)
          }
          return item
        })
        console.log('获取地图下载地址成功!')
        downloadAndExtract({ maps, access_token })
      })

如下图，本次请求将之前获得的access_token发送出去就行了，同时query里的剩下两个参数都是时间戳。请求成功后将数据存放在maps数组里以供后续下载使用
```
![image](https://github.com/895433995/pachong/blob/master/images/step31.png)

#### 步骤四

```
现在就需要用到download依赖了

  maps.map(mapId => {
      let url = `https://www.fengmap.com/FMCloud/fmap/download/${mapId}?access_token=${access_token}`
      slog('下载进度:0.0%')
      download(url, dirPathOfDownloads).then(() => {
        current++
        const percent = ((current / maps.length) * 100.0).toFixed(2)
        slog('下载进度:', percent, '%')
        if (current === maps.length) {
          console.log('\n')
          console.log(`${current}份地图全部下载完成!`)
          console.log('正在解压……')
          let files = fs.readdirSync(dirPathOfDownloads)
          files.forEach(file => {
            let curPath = dirPathOfDownloads + '/' + file
            let unzip = new adm_zip(curPath)
            unzip.extractAllTo(dirPathOfMaps, true)
            fs.unlinkSync(curPath) //删除文件
          })

          files = fs.readdirSync(dirPathOfMaps)
          files.forEach(file => {
            if (file.indexOf('.zip') !== -1) {
              let curPath = dirPathOfMaps + '/' + file
              const fileName = file.split('.')[0]
              let unzip = new adm_zip(curPath)
              unzip.extractAllTo(dirPathOfThemes + '/' + fileName, true)
              fs.unlinkSync(curPath)
            }
          })
          fs.rmdirSync(dirPathOfDownloads)
        }
      })
      return mapId
      
如下图，模拟点击下载后，请求的地址需要access_token以及mapid，mapid在上一步的maps数组中可以得到,上述代码中用adm-zip包对下载的地图进行了解压处理。
```
![image](https://github.com/895433995/pachong/blob/master/images/step41.png)

### 本人也是第一次写爬虫，有不足的地方还请大家指出哈！！！
