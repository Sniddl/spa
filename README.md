#Sniddl SPA
Render pages in the background & navigate site without redirecting. Uses native JS & HTML meta tags.

#Features
- Increase speed and performance.
- Use file separation on static HTML websites.
- Use hashes to navigate preloaded pages without redirecting.
- Load targeted page upon landing.

#Installation
```sh
npm install --save sniddl-spa
```

```js
require('sniddl-spa')
```
Or download this file and add it to your public folder.

#Examples
I created an example website. It only took about 10–20 minutes to complete the whole thing. http://spa.sniddl.com Notice how the url changes when you change page. This allows you to link users to a specific page like a normal website. If the page does not exist then a 404 appears. Also notice the time it takes to load the DOM completely.

#Customize

###CSS
All the pages either have a class of page-hidden or page-visible customize those any way you want.
###Set The Home Page
Set the home page by setting the corresponding meta tag's name to index
```html
<meta property="sniddl:page" name="index" content="/views/home.html">
```

###Set the 404 Page
Set the 404 page by setting the corresponding meta tag's name to 404
```html
<meta property="sniddl:page" name="index" content="/views/home.html">
```

###Info about the current page
All info about the current page can be accessed by the global $page variable

###Url Parameters
Build dynamic pages using the parameters passed by the URL. Use the global $params variable to access them. For example: Visiting the urlhttps://example.com/home/user/john would result in the following.
```js
$params = ["user", "john"]
$page = {name: 'home', el: <Element>}
```

###Get loaded pages
All the pages loaded into the DOM can be accessed with the global $pages variable.

###Pages Reloaded
You can reload all the pages based on which meta tags are preset. This would be useful if you need to dynamically change the pages. You can call the reloadPagesFromMeta function which has a callback for when the pages are done loading. If you don't want to use a callback you can also use the global function onPagesReloaded 
```js
reloadPagesFromMeta(() => {
  console.log('pages have loaded');
})
```
```js
reloadPagesFromMeta()
window.onPagesReloaded = function () {
  console.log('pages have loaded')
}
```

#Use Cases
Electron Apps
Fast loading web pages (w/out 3rd party ads)
JS framework routing
