let dllAliasMap = require('@dllAliasMap');

let importedDll = {};

window.importedDll = importedDll;

function importDll(name) {
  return new Promise(function (resolve, reject) {
		/**
		 * 配合webpack Promise.all的异步加载
		 * 流程：
		 * 1.定义模块内部变量importedDll
		 * 2.若dllAliasMap里不存在所需组件直接resolve
		 * 3.若importedDll中已存在该组件，则表示已经加载，无需再次加载，直接resolve
		 * 4.将script插入html，在回调函数中resolve，超时时间为120秒
		 */
    if (dllAliasMap[name] == undefined) {
      return resolve();
    }
    if (importedDll[dllAliasMap[name]]) {
      return resolve();
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.timeout = 120000;
    script.src = dllAliasMap[name];
    var timeout = setTimeout(onScriptComplete, 120000);
    script.onerror = script.onload = onScriptComplete;
    function onScriptComplete(e) {
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      importedDll[dllAliasMap[name]] = true;
      resolve();
    };
    head.appendChild(script);
  });
}

module.exports = importDll;
