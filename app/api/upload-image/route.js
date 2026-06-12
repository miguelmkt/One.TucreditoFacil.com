import fs from 'fs/promises'
import path from 'path'

function sanitizeBaseName(name) {
  return String(name || 'imagem')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'imagem'
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/(png|jpeg|jpg|webp|gif));base64,([\s\S]+)$/i)
  if (!match) return null
  const mime = match[1].toLowerCase()
  const extMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  const ext = extMap[mime] || 'png'
  const base64 = match[3]
  return { ext, base64 }
}

export async function POST(req) {
  try {
    const { dataUrl, filename } = await req.json()
    const parsed = parseDataUrl(dataUrl)
    if (!parsed) {
      return Response.json({ error: 'Formato de imagem invalido' }, { status: 400 })
    }

    const buf = Buffer.from(parsed.base64, 'base64')
    if (buf.length > 8 * 1024 * 1024) {
      return Response.json({ error: 'Imagem muito grande. Maximo 8MB' }, { status: 400 })
    }

    const dir = path.join(process.cwd(), 'public', 'imagens', 'img-post')
    await fs.mkdir(dir, { recursive: true })

    const baseName = sanitizeBaseName(filename)
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const fileName = `${baseName}-${unique}.${parsed.ext}`
    const absPath = path.join(dir, fileName)

    await fs.writeFile(absPath, buf)

    return Response.json({ ok: true, url: `/imagens/img-post/${fileName}` })
  } catch (e) {
    return Response.json({ error: 'Falha ao salvar imagem' }, { status: 500 })
  }
}
