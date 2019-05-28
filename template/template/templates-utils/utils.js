/**
 * @description 获取 url 上的 query 参数
 * @param name 参数名
 * @param url 目标 url
 */
export function getUrlParam (name, url = location.href) {
  if (typeof url !== 'string') {
    console.error('[ERROR]: url must be string type')
  }

  let reg = new RegExp('[\\?&#]' + name + '=([^\\?&#]+)')

  if (!reg.test(url)) return ''
  else return url.match(reg)[1]
}

/**
 * @description 序列化， 将对象的值序列化
 * @param {Object} obj
 * @param {Array} keys 需要序列化的属性（最外层属性）， 如果为空时则获取所有属性
 * @param {Array} set
 */
export function normalize(obj, keys, set = []) {
  if (!Array.isArray(keys) || !keys.length)
    keys = Object.keys(obj)
  keys.forEach(key => {
    const val = obj[key]
    if (typeof val === 'string') {
      set.push(val)
    } else if (typeof val === 'object') {
      normalize(val, [], set)
    }
  })

  return [...set]
}

/**
 * @description 将 staticPath 序列化为 /a/b/ 形式
 * @param {*} path
 * @returns
 */
export function normalizeStaticPath (path) {
  const SPLIT = '/'
  return path.split(SPLIT).reduce((acc, frag) => {
    return acc + (frag ? SPLIT + frag : '')
  }, '') + SPLIT
}
