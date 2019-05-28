import {
  getSettings,
  disableDebug,
  getJsList,
  initStart,
  run
} from '../../../../templates-utils/cocos-common.js'
import {
  loadProgress,
  loadScene
} from '../../../../templates-utils/cocos-utils'
import {
  xhrRequest
} from '../../../../templates-utils/xhr'
import {
  getUrlParam,
  normalize,
  normalizeStaticPath
} from '../../../../templates-utils/utils'

;
(function (context) {
  const __CANVAS_ID__ = 'GameCanvas'
  const staticPath = normalizeStaticPath('{{{}}}')
  const settings = getSettings()
  const jsonUrl =  decodeURIComponent(getUrlParam('addr'))
  const url = `/wowschrest/gw/bootcamp/game/content?resourceUrl=${jsonUrl}`
  const isDev = true // process.env.NODE_ENV === 'production' ? false : true
  const jsList = getJsList(staticPath, settings)
  disableDebug(settings)

  xhrRequest("GET", isDev ? jsonUrl : url, {
    dataType: 'json'
  }).then(function (res) {
    return isDev ?
      Promise.resolve(res) :
      xhrRequest("GET", res.data, {
        dataType: 'json'
      })
  }).then(function (result) {
    window._json = result
    window._jsonRes = printAttr(result)
    window._jsonItemsArr = normalize(result, ['resources', 'commonRes'])
    const onstart = onStart.bind(null, settings, staticPath, window._jsonItemsArr)
    run(__CANVAS_ID__, settings, jsList, onstart)
  }).catch(err => {
    console.log(err)
  })

  function printAttr(node, res = {}) {
    if (node instanceof Object) {
      for (var p in node) {
        if (node[p].length && node[p].slice(0, 5) == "https") {
          res[p] = node[p];
        }
        printAttr(node[p], res);
      }
    }
    return res
  }

  /**
   * @description 初始化屏幕（方向， 大小）以及静态资源的路径， 加载素材
   * @param {*} staticPath
   * @param {*} cb
   */
  function onStart(settings, staticPath, assets) {
    const splash = document.getElementById('splash')
    const progressBar = splash.querySelector('.progress-bar span')
    splash.style.display = 'block'
    progressBar.style.width = '0%'

    initStart(settings, staticPath)

    loadProgress(assets, function (complete, percent, item) {
      if (!window.Vue)
        progressBar.style.width = percent.toFixed(2) + '%'

      if (complete) {
        loadScene(settings.launchScene)
        .then(function () {
          if (cc.sys.isBrowser) {
            // show canvas
            var canvas = document.getElementById(__CANVAS_ID__)
            canvas.style.visibility = ''
            var div = document.getElementById('GameDiv')
            if (div) {
              div.style.backgroundImage = ''
            }
          }
        })
      }
    })
  }
})(window);
