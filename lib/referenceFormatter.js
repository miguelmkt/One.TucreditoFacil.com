function getRefsLabel(language) {
  if (language === 'pt') return 'Referencias'
  if (language === 'fr') return 'References'
  if (language === 'en') return 'References'
  return 'Referencias'
}

function uniqueUrls(urls) {
  return [...new Set(urls.map(u => u.trim()).filter(Boolean))]
}

function extractUrlsFromHtml(chunk) {
  const urls = []
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi
  let m
  while ((m = urlRegex.exec(chunk)) !== null) {
    urls.push(m[0])
  }
  return uniqueUrls(urls)
}

export function formatReferencesContainer(html, language = 'es') {
  if (!html || typeof html !== 'string') return html

  const labelRegex = '(Refer[eê]ncias|Referencias|References|R[ée]f[ée]rences)'
  const refsBlockRegex = new RegExp(`<\\s*(p|h2|h3)[^>]*>\\s*${labelRegex}\\s*<\\/\\s*\\1\\s*>\\s*<ul[^>]*>([\\s\\S]*?)<\\/ul>`, 'i')

  const found = html.match(refsBlockRegex)
  if (!found) return html

  const ulInner = found[3] || ''
  const urls = extractUrlsFromHtml(ulInner)
  if (urls.length === 0) return html

  const refsLabel = getRefsLabel(language)
  // add some default extra references (non-duplicated)
  const extraLinks = [
    'https://www.condusef.gob.mx/',
    'https://www.bbva.mx/',
    'https://www.banxico.org.mx/',
    'https://www.gob.mx/',
  ]

  const allUrls = uniqueUrls([...urls, ...extraLinks])

  const items = allUrls.map(u => `    <li class="mb-2"><a href="${u}" target="_blank" rel="noopener noreferrer" class="text-gray-900 no-underline hover:underline break-all overflow-wrap-anywhere" style="color:inherit;word-break:break-all;overflow-wrap:anywhere;">${u}</a></li>`).join('\n')

  const container = [
    '<div class="my-8 w-full">',
    '  <div class="rounded-md border border-gray-200 p-6 bg-white overflow-hidden">',
    `    <h3 class="m-0 text-3xl font-bold text-center text-gray-900 mb-3" style="font-size:1.875rem;font-weight:700;text-align:center;margin-bottom:0.75rem;color:#111827;">${refsLabel}</h3>`,
    '    <hr class="border-t border-gray-200 mb-4" />',
    '    <ul class="list-disc list-inside m-0 text-gray-900 space-y-1" style="word-break:break-all;overflow-wrap:anywhere;">',
    items,
    '    </ul>',
    '  </div>',
    '</div>',
  ].join('\n')

  return html.replace(refsBlockRegex, container)
}
