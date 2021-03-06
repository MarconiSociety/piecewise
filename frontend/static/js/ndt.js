/* jshint esversion: 6, asi: true */
/* globals ndt7core */
import ndt7core from './ndt7-core.js';

'use strict';

function withElementDo(elementId, callable) {
  const elem = document.getElementById(elementId)
  if (elem) {
    callable(elem)
  }
}

function updateView(elementId, appInfo) {
  withElementDo(elementId, function (elem) {
    const elapsed = appInfo.ElapsedTime / 1e06     /* second */
    let speed = appInfo.NumBytes / elapsed         /* B/s    */
    speed *= 8                                     /* bit/s  */
    speed /= 1e06                                  /* Mbit/s */
    elem.innerHTML = speed.toFixed(3) + ' Mbit/s'
  })
}

function runSomething(testName, callback) {
  ndt7core.run(location.href, testName, function(ev, val) {
    console.log(ev, val)
    if (ev === 'complete') {
      if (callback !== undefined) {
        callback()
      }
      return
    }
    if (ev === 'measurement' && val.AppInfo !== undefined &&
        val.Origin === 'client') {
      updateView(testName, val.AppInfo)
    }
  })
}

function runDownload(callback) {
  runSomething('download', callback)
}

function runUpload(callback) {
  runSomething('upload', callback)
}
