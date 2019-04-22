const path = require('path')
const { downloadMap } = require('./libs/mapDownloader')
// 账号
const fUname = '...'

// 密码
const fPwd = '...'

// 下载地图间隔
const hour = 0.5 //单位小时

// 地图存储路径
const dirPathOfMaps = path.join(__dirname, '../public/maps')
const dirPathOfThemes = path.join(__dirname, '../public/themes')

downloadMap({ fUname, fPwd, dirPathOfMaps, dirPathOfThemes, hour })
