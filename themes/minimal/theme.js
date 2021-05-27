const theme = module.exports = {
  html(data) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css">
${data.usrcss ? `<link rel="stylesheet" href="${data.usrcss}">` : ''}
<title>${data.title || 'mdmath page'}</title>
</head>
<body class="markdown-body">
${data.content}
</body>
</html>` 
}
}
