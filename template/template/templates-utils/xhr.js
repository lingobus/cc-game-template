/**
 * @description 发送 http 请求
 * @param {enum} action get or post
 * @param {*} url
 * @param {Object} opts { timeout: 6000, dataType: 'json' }
 */
export function xhrRequest(action, url, opts) {
  if (typeof opts === 'undefined') opts = {};
  const xhr = cc.loader.getXMLHttpRequest();
  const { DONE } = window.XMLHttpRequest

  xhr.open(action.toUpperCase(), url, true);

  if (cc.sys.isNative)
    xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
  // set timeout
  xhr.timeout = !isNaN(parseInt(opts.timeout)) ? opts.timeout : 60000;

  // set
  xhr.send();

  return new Promise(function (resolve, reject) {
    xhr.onreadystatechange = function () {
      try {
        if (xhr.readyState === DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let result = xhr.responseText;
            if (opts.dataType === 'json') {
              result = JSON.parse(result);
            }
            resolve(result, xhr);
          } else {
            reject(xhr);
          }
        }
      } catch (e) {
        reject(e);
      }
    };
  });
}
