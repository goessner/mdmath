const theme = module.exports = {
  html(data) {
  return `<!doctype html>
<html${data.lang ? ` lang="${data.lang}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,user-scalable=no">
<meta name="description" content="${data.description || (data.title + ' - microjam page')}">
${data.authors ? `<meta name="author" content="${data.authors.join()}">` : ''}
${data.date ? `<meta name="date" content="${new Date(data.date).toString()}">` : ''}
${data.tags ? `<meta name="keywords" content="${data.tags.join()}">` : ''}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/vs.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/goessner/mdmath/themes/publication/style.css">
${data.usrcss ? `<link rel="stylesheet" href="${data.usrcss}">` : ''}
<title>${data.title}</title>
</head>
<body id="top">
<header>
${data.title ? `<h1>${data.title}</h1>` : ''}
${data.subtitle ? `<h3>${data.subtitle}</h3>` : ''}
${data.authors ? `<h4>${data.authors.join(', ')}</h4>` : ''}
${data.adresses ? `<h5>${data.adresses.join('<br>')}</h5>` : ''}
${data.date ? `<h5>${data.date}</h5>` : ''}
${data.tags ? `<h5><b>Keywords:</b> ${data.tags.join(', ')}</h5>` : ''}
</header>
<main>
${data.content}
</main>
</body>
</html>` 
}
}
