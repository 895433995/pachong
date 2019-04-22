const superagent = require('superagent')
const { ensureDir, readdir, remove } = require('fs-extra')
const strEnc = require('./strEnc')
const download = require('download')
const path = require('path')
const adm_zip = require('adm-zip')
const slog = require('single-line-log').stdout

const reqHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
    'Chrome/73.0.3683.103 Safari/537.36'
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
  reload(opts)
}

/**
 * @param {Options} opts 
 */
async function reload(opts) {
  const { dirPathOfMaps, dirPathOfThemes, hour } = opts
  const dirPathOfDownloads = path.join(__dirname, 'downloads')

  setTimeout(() => {
    reload(opts)
  }, hour * 60 * 60 * 1000)

  await Promise.all([remove(dirPathOfDownloads)])
  await Promise.all([ensureDir(dirPathOfDownloads), ensureDir(dirPathOfMaps), ensureDir(dirPathOfThemes)])

  const { dk, cookie } = await getDkAndCookie()
  const { access_token } = await getToken({cookie, dk}, opts)
  const { maps } = await getMapList(access_token)
  downloadAndExtract(maps, access_token, dirPathOfDownloads, opts)
}

/**
 * @return {Promise<{cookie: string, dk: string}>}
 */
async function getDkAndCookie() {
  console.log('获取dk、cookie中……')

  const { body, header } = await superagent
    .get('https://www.fengmap.com/FMCloud/user/dk')
    .set(reqHeaders)
    .query({ _: Date.parse(new Date()) })
  const cookie = header['set-cookie']
  const dk = body.dk
  console.log('获取dk、cookie成功!', dk, cookie)
  return { cookie, dk }
}

/**
 * @param {{cookie: string, dk: string}} cookieOpts
 * @param {Options} opts
 * 
 * @return {Promise<{access_token: string}>}
 */
async function getToken(cookieOpts, opts) {
  const { fUname, fPwd } = opts
  const { cookie, dk } = cookieOpts
  console.log('获取access_token中……')
  const { body } = await superagent
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
  const { access_token } = body
  console.log('获取access_token成功!', access_token)
  return {access_token}
}

/**
 * @param {string} access_token - fengmap login token
 * 
 * @return {Promise<{maps: Array<string>}>}
 */
async function getMapList(access_token) {
  console.log('获取地图下载地址中……')
  const { body } = await superagent
    .get('https://www.fengmap.com/FMCloud/map/owner')
    .set(reqHeaders)
    .query({
      access_token: access_token,
      t: Date.parse(new Date()),
      _: Date.parse(new Date())
    })
  
  const maps = body.list.filter(item => (item.enableEdit === 1 || item.enableEdit === '1')).map(item => item.mapId)
  
  console.log('获取地图下载地址成功!', `${maps.join(',')}`)
  return { maps }
}

/** 
 * @param {Array<string>} maps - fengmap download url array
 * @param {string} access_token - fengmap login token
 * @param {string} dirPathOfDownloads
 * @param {Options} opts
 */
async function downloadAndExtract(maps, access_token, dirPathOfDownloads, opts) {
  const { dirPathOfMaps, dirPathOfThemes } = opts
  let current = 0
  console.log('地图下载中……')
  await Promise.all(
    maps.map(mapId => 
      download(
        `https://www.fengmap.com/FMCloud/fmap/download/${mapId}?access_token=${access_token}`,
        dirPathOfDownloads
      )
    )
  )

  console.log(`${maps.length}份地图全部下载完成!`)

  console.log('正在解压……')

  const downloadedFiles = await readdir(dirPathOfDownloads)

  await Promise.all(
    downloadedFiles.map(file => {
      const curPath = dirPathOfDownloads + '/' + file
      new adm_zip(curPath).extractAllTo(dirPathOfMaps, true)
      return remove(curPath)
    })
  )

  const extratdFiles = await readdir(dirPathOfMaps)
  const themeFiles = extratdFiles.filter(file => file.endsWith('.zip'))

  await Promise.all(
    themeFiles.map(file => {
      const curPath = dirPathOfMaps + '/' + file
      const fileName = file.slice(0, -4)
      new adm_zip(curPath).extractAllTo(dirPathOfThemes + '/' + fileName, true)
      return remove(curPath)
    })
  )

  await remove(dirPathOfDownloads)
  console.log('解压完成!')

}