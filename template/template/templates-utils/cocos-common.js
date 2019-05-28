export function getSettings () {
  const settings = window._CCSettings;

  window._CCSettings = undefined;
  return settings
}

export function disableDebug(settings) {
  if (!settings.debug) {
    var uuids = settings.uuids;

    var rawAssets = settings.rawAssets;
    var assetTypes = settings.assetTypes;
    var realRawAssets = settings.rawAssets = {};
    for (var mount in rawAssets) {
      var entries = rawAssets[mount];
      var realEntries = realRawAssets[mount] = {};
      for (var id in entries) {
        var entry = entries[id];
        var type = entry[1];
        // retrieve minified raw asset
        if (typeof type === 'number') {
          entry[1] = assetTypes[type];
        }
        // retrieve uuid
        realEntries[uuids[id] || id] = entry;
      }
    }

    var scenes = settings.scenes;
    for (var i = 0; i < scenes.length; ++i) {
      var scene = scenes[i];
      if (typeof scene.uuid === 'number') {
        scene.uuid = uuids[scene.uuid];
      }
    }

    var packedAssets = settings.packedAssets;
    for (var packId in packedAssets) {
      var packedIds = packedAssets[packId];
      for (var j = 0; j < packedIds.length; ++j) {
        if (typeof packedIds[j] === 'number') {
          packedIds[j] = uuids[packedIds[j]];
        }
      }
    }
  }
}

/**
 * @description 获取所有需要的 js
 * @param {*} staticPath 静态资源的基础路径， 如 /game-static/pick-easter-egg/
 * @param {*} settings
 */
export function getJsList(staticPath, settings) {
  // jsList
  var jsList = settings.jsList;

  var bundledScript = settings.debug ? staticPath + 'src/project.dev.js' : staticPath + 'src/project.js';
  if (jsList) {
    jsList = jsList.map(function (x) {
      return 'src/' + x;
    });
    jsList.push(bundledScript);
  } else {
    jsList = [bundledScript];
  }

  return jsList
}

/**
 * @description 运行游戏
 * @param {*} canvasId
 * @param {*} settings
 * @param {*} jsList
 * @param {*} onStart
 */
export function run(canvasId, settings, jsList, onStart) {
  const option = {
    id: canvasId,
    scenes: settings.scenes,
    debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
    showFPS: settings.debug,
    frameRate: 60,
    jsList,
    groupList: settings.groupList,
    collisionMatrix: settings.collisionMatrix
  };

  cc.game.run(option, onStart);
}

/**
 * @description 静态资源的路径
 * @param {*} staticPath
 */
function initAssets (settings, staticPath) {
  // init assets
  cc.AssetLibrary.init({
    libraryPath: staticPath + 'res/import',
    rawAssetsBase: staticPath + 'res/raw-',
    rawAssets: settings.rawAssets,
    packedAssets: settings.packedAssets,
    md5AssetsMap: settings.md5AssetsMap
  });
}

/**
 * @description 初始化屏幕的方向和尺寸
 */
function initOrientation (settings) {
  cc.loader.downloader._subpackages = settings.subpackages
  cc.view.enableRetina(true)
  cc.view.resizeWithBrowserSize(true)

  if (cc.sys.isMobile) {
    if (settings.orientation === 'landscape') {
      cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
    } else if (settings.orientation === 'portrait') {
      cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)
    }
    cc.view.enableAutoFullScreen([
      cc.sys.BROWSER_TYPE_BAIDU,
      cc.sys.BROWSER_TYPE_WECHAT,
      cc.sys.BROWSER_TYPE_MOBILE_QQ,
      cc.sys.BROWSER_TYPE_MIUI,
    ].indexOf(cc.sys.browserType) < 0)
  }
}

/**
 * @description 初始化屏幕（方向， 大小）以及静态资源的路径， 加载素材
 * @param {*} staticPath
 * @param {*} cb
 */
export function initStart(settings, staticPath) {
  initOrientation(settings)
  initAssets(settings, staticPath)

  // Limit downloading max concurrent task to 2,
  // more tasks simultaneously may cause performance draw back on some android system / browsers.
  // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
  if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
    cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
  }
};
