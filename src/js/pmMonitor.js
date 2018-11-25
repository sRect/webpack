// 计算加载时间
function getPerformanceTiming() {
  var performance = window.performance;
  if (!performance) {
    // 当前浏览器不支持
    console.log('你的浏览器不支持 performance 接口');
    return;
  }
  var t = performance.timing;
  var times = {};
  // 重定向的时间
  // 拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
  times.redirect = t.redirectEnd - t.redirectStart;
  // DNS 查询时间
  // DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
  // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart;
  // 页面加载完成的时间
  // 这几乎代表了用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart;
  // 解析 DOM 树结构的时间
  // 反省下你的 DOM 树嵌套是不是太多了！
  times.domReady = t.domComplete - t.responseEnd;
  // 解析DOM树结构的时间，包括内嵌资源
  times.domResolved = t.domComplete - t.domLoading;
  // 白屏时间，读取页面第一个字节的时间
  // 这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
  // TTFB 即 Time To First Byte 的意思
  // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
  times.ttfb = t.responseStart - t.navigationStart;
  // 内容加载完成的时间
  // 页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
  times.request = t.responseEnd - t.requestStart;
  // 执行 onload 回调函数的时间
  // 是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
  times.loadEvent = t.loadEventEnd - t.loadEventStart;
  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart;
  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
  return times;
}

function resourceTiming() {
  // let resourceList = window.performance.getEntries("resource");
  let resourceList = performance.getEntriesByType("resource");
  let obj = {};
  resourceList.map(item => {
    console.log(item)
    obj[item.name] = item.responseEnd - item.startTime;
    // console.log(`${item.name}加载耗时：${item.responseEnd - item.startTime}`)
  })

  return obj;
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    setTimeout(function () {
      if (document.readyState === 'complete') {
        console.log(getPerformanceTiming());
      } else {
        console.log('time out');
      }
    }, 2000);
  }
};

window.onload = function () {
  setTimeout(() => {
    console.log(resourceTiming())
  }, 2000)
}