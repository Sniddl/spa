
function readyToLoadPages(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function fetchPage(url, fn) {
  var res = null
  var r = new XMLHttpRequest();
  r.open('GET', url, true)
  r.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status >= 200 && this.status < 400) {
      fn(this.responseText)
    } else console.error('Could not fetch page: ' + url);
  }
  r.send()
  r=null
}

function createNeededElements() {
  SniddlCreateEl({
    parent: '#app',
    attr: {id: 'pages'}
  })
  SniddlCreateEl({
    type: 'style',
    parent: 'head',
    attr: {id: 'sniddl-css'},
    html: '#app {display: flex;flex-direction: column;height: 100vh;}#pages {position: relative;flex-grow: 1}[id^="page-"] {position: absolute;top: 0;left: 0;width: 100%;height: 100%;}.page-hidden {opacity: 0;}.page-visible {opacity: 1;}'
  })
}

function getPageMetaByName(name) {
  return document.querySelectorAll('meta[property="sniddl:page"][name="'+ name +'"]')[0]
}

function getMetaByProperty(property) {
  return document.querySelectorAll('meta[property="'+ property +'"]')[0]
}

function SniddlCreateEl(o) {
  o.type = o.type || 'div'
  o.attr = o.attr || {}
  o.html = o.html
  var child = document.createElement(o.type)
  var parents = document.querySelectorAll(o.parent)
  var exists = false;
  Object.keys(o.attr).forEach(key => {
    var val = o.attr[key]
    if (key === 'id') {
      if (document.getElementById(val)) exists = true
      child = document.getElementById(val) || child
    }
    child.setAttribute(key, val)
  })
  if (!exists) parents.forEach(parent => parent.append(child))
  if (o.html) child.innerHTML = o.html

  return child
}

function createNeededElements() {
  SniddlCreateEl({
    type: 'style',
    parent: 'head',
    attr: {id: 'sniddl-css'},
    html: '#app {overflow-x: hidden;}.page-hidden {display: none;}'
  })
  SniddlCreateEl({
    parent: '#app',
    attr: {id: 'pages'}
  })
  if(getPageMetaByName('404')) {
    loadPageIntoDOM('404')
  } else {
    SniddlCreateEl({
      parent: '#pages',
      attr: {id: 'page-404', class: 'page-hidden'},
      html: '<h1>404 - Not found</h1>'
    })
  }
}

function loadPageIntoDOM(name, fn=function(){}) {
  var meta = getPageMetaByName(name)
  if (!meta) return fn(name, '404')
  var div = SniddlCreateEl({
    parent: '#pages',
    attr: {id: 'page-' + name}
  })
  if(div.classList.contains('page-visible')) return fn(name, 'already-visible')
  div.classList.add('page-hidden')
  window.$pages[name] = div
  fetchPage(meta.getAttribute('content'), res => {
    div.innerHTML = res
    fn(name)
  })
}

function showPage(name) {
  if (window.$page !== undefined)
    var old = Object.assign({}, window.$page)
  window.$page = {
    el: document.getElementById('page-' + name),
    name: name
  }
  if ($page.el) {
    if (old.el) {
      old.el.classList.add('page-hidden')
      old.el.classList.remove('page-visible')
    }
    $page.el.classList.remove('page-hidden')
    $page.el.classList.add('page-visible')
  }
}

function getLandingPage() {
  var split = location.hash.split('/')
  var arr = split.slice(1, split.length)
  window.$page.name = arr[0] || 'index'
  window.$params = arr.slice(1, arr.length)
  loadPageIntoDOM(window.$page.name, (name, err) => {
    if (err === '404') showPage('404')
    else showPage(name)
  })
}

window.reloadPagesFromMeta = function(fn=function(){}) {
  readyToLoadPages(function() {
    window.$pages = {}
    window.$page = {}
    createNeededElements()
    getLandingPage()
    var pages = document.querySelectorAll('meta[property="sniddl:page"]')
    var found = 0;
    setTimeout(function() {
      fn = window.onPagesReloaded || fn
      pages.forEach(page => loadPageIntoDOM(page.name, (name, err) => {
        found ++
        if (found === pages.length) fn()
      }))
    }, 500)

    window.addEventListener("hashchange", function () {
      getLandingPage()
      window.scroll(0,0)
    });
  })
}

reloadPagesFromMeta()
