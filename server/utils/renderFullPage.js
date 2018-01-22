export default ({ markup, preloadedState }) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Life Co.</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/style.css" rel="stylesheet">
      </head>
      <body>
        <div id='app'>${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${
            JSON.stringify(preloadedState || {}).replace('/</g', '\\u003c')
          }
        </script>
        <script src='/bundle.js'></script>
      </body>
    </html>
  `
}
