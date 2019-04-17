const superagent = require('superagent')
const strEnc = require('./strEnc')
const fs = require('fs')
const download = require('download')
const path = require('path')
const adm_zip = require('adm-zip')
const slog = require('single-line-log').stdout

// 账号
// const fUname = "..."

// 密码
// const fPwd = "..."

// 下载地图间隔
//const hour = 0.5        //单位小时

// 地图存储路径
// const dirPathOfMaps = path.join(__dirname, "maps")
// const dirPathOfThemes = path.join(__dirname, "themes")

// 清空地图文件夹
function delDir(delpath) {
  let files = []
  if (fs.existsSync(delpath)) {
    files = fs.readdirSync(delpath)
    files.forEach((file, index) => {
      let curPath = delpath + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath) //递归删除文件夹
      } else {
        fs.unlinkSync(curPath) //删除文件
      }
    })
  }
}

// 新建文件夹
function creDir(crepath) {
  if (!fs.existsSync(crepath)) {
    try {
      fs.mkdirSync(crepath)
    } catch (error) {
      fs.mkdirSync(path.dirname(crepath))
    }
  }
}

/**
 * @typedef {object} Options
 * @property {string} fUname - username of fengmap
 * @property {string} fPwd - password of fengmap
 * @property {string} dirPathOfMaps - directory for .fmap
 * @property {string} dirPathOfThemes - directory for theme
 * @property {number} hour - interval in hour
 */
/**
 * @param {Options} opts
 */
module.exports.downloadMap = function(opts) {
  const { fUname, fPwd, dirPathOfMaps, dirPathOfThemes, hour } = opts
  const dirPathOfDownloads = path.join(__dirname, 'downloads')
  let reqHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
      'Chrome/73.0.3683.103 Safari/537.36'
  }
  const interval = hour * 60 * 60 * 1000
  let timer = setTimeout(load, 0)
  function load() {
    clearTimeout(timer)
    delDir(dirPathOfDownloads)
    creDir(dirPathOfDownloads)
    delDir(dirPathOfMaps)
    creDir(dirPathOfMaps)
    delDir(dirPathOfThemes)
    creDir(dirPathOfThemes)
    getDkAndCookie(reqHeaders)
  }

  function getDkAndCookie() {
    console.log('获取dk、cookie中……')
    let cookie
    let dk
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
        console.log('获取dk、cookie成功!')
        getToken({ cookie, dk })
      })
  }

  /**
   * @typedef {object} Options
   * @param {string} cookie - fengmap login cookie
   * @param {string} dk - encryption for password
   */
  /**
   * @param {Options} opts
   */
  function getToken(opts) {
    const { cookie, dk } = opts
    let access_token
    console.log('获取access_token中……')
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
        console.log('获取access_token成功!')
        getMapList(access_token)
      })
  }

  /**
   * @param {string} access_token - fengmap login token
   */
  function getMapList(access_token) {
    let maps = []
    console.log('获取地图下载地址中……')
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
  }

  /**
   * @typedef {object} Options
   * @param {array} maps - fengmap download url array
   * @param {string} access_token - fengmap login token
   */
  /**
   * @param {Options} opts
   */
  function downloadAndExtract(opts) {
    const { maps, access_token } = opts
    let current = 0
    console.log('地图下载中……')
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
          console.log('解压完成!')
          timer = setTimeout(load, interval)
        }
      })
      return mapId
    })
  }
}
