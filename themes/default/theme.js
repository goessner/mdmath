const theme = module.exports = {
  html(data) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/default.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css">
<link rel="stylesheet" href="${data.cssuri}">
${data.usrcss ? `<link rel="stylesheet" href="${data.usrcss}">` : ''}
</head>
<body class="markdown-body">
${data.content}
</body>
</html>` 
}
}
