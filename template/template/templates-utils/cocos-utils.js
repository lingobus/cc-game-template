import { normalize } from './utils'

/**
 * @description 加载数据， 并获得加载进度
 * @param {Array|Object} assetsArr
 * @param {(complete, percent, item) => {}} cb
 */
export function loadProgress (assetsArr, cb = () => {}) {
  const _assetsArr = normalize(assetsArr)
  cc.loader.onProgress = function (completedCount, totalCount, item) {
    const percent = 100 * completedCount / totalCount;
    const loaded = percent === 100 && completedCount === _assetsArr.length

    cb(loaded, percent, item)
    if (loaded) {
      cc.loader.onProgress = null;
    }
  }

  cc.loader.load(assetsArr, function (error, item) {

  })
}

/**
 * @description 加载场景
 * @param {*} scene 场景名
 * @returns {Promise}
 */
export function loadScene(scene) {
  return new Promise(function (resolve, reject) {
    cc.director.loadScene(scene, function () {
      if (process.env.NODE_ENV === 'development') {
        console.log('Success to load scene: ' + scene);
      }
      resolve()
    });
  })
}
