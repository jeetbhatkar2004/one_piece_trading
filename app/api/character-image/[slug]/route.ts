import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Mapping from character slugs to actual image filenames (regenerated_avatars naming)
// Handles slugs that don't match simple slug->filename patterns
const slugToImageMap: Record<string, string> = {
  // Hyphenated / alternate names
  'ashura-doji': 'ashuradoji.png',
  'avalo-pizarro': 'avalopizzaro.png',
  'baby-5': 'baby5.png',
  'belo-betty': 'balobetty.png',
  'benn-beckman': 'bennbeckman.png',
  'big-mom': 'bigmom.png',
  'black-maria': 'blackmaria.png',
  'boa': 'boahancock.png',
  'boa-hancock': 'boahancock.png',
  'bon-clay': 'bonclay.png',
  'catarina-devon': 'catrinadevon.png',
  'caesar': 'ceaser.png', // typo in source file
  'doc-q': 'docq.png',
  'don-chinjao': 'donchinjao.png',
  'fisher-tiger': 'fishertiger.png',
  'gan-fall': 'ganfall.png',
  'gol-d-roger': 'goldroger.png',
  'kid': 'eustasskid.png',
  'eustass-kid': 'eustasskid.png',
  'gaban': 'gaban.png',
  'scopper-gaban': 'gaban.png',
  'jinbe': 'jinbei.png',
  'jinbei': 'jinbei.png',
  'kalifa': 'khalifa.png', // spelling in regenerated
  'hiyori': 'kozukihiyori.png',
  'kozuki-hiyori': 'kozukihiyori.png',
  'toki': 'kozukitoki.png',
  'kozuki-toki': 'kozukitoki.png',
  'kyros': 'kyrios.png', // typo in source file
  'lao-g': 'lao_g.png',
  'lucky-roux': 'luckyroux.png',
  'noland': 'nolan.png',
  'nusjuro': 'nuzjuro.png',
  'kiku': 'O-kiku.png',
  'kikunojo': 'O-kiku.png',
  'page-one': 'page_one.png',
  'pica': 'pika.png', // typo in source file
  'roger': 'goldroger.png',
  'rocks': 'xebec.png',
  'xebec': 'xebec.png',
  'rocks-d-xebec': 'xebec.png',
  'ryokugyu': 'greenbull.png',
  's-shark': 's-shark.png',
  'sanji': 'sanji.png',
  'katakuri': 'katakuriii.png', // filename has triple i in regenerated_avatars
  'sanjuan-wolf': 'sanjuanwolf.png',
  'apoo': 'scratchmanapoo.png',
  'senor-pink': 'senorpink.png',
  'señor-pink': 'senorpink.png',
  'van-augur': 'van_auger.png',
  'vasco-shot': 'vascoshot.png',
  'urouge': 'urogue.png', // spelling in regenerated
  'usopp': 'ussop.png',
  'ussop': 'ussop.png',
  'whos-who': 'whoswho.png',
  'yasopp': 'yassop.png',
  'aokiji': 'aokiji.png',
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug.toLowerCase()
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'characters')
    const extensions = ['.png', '.jpg', '.webp', '.jpeg']

    // 1. Check explicit slug mapping (regenerated_avatars naming)
    if (slugToImageMap[slug]) {
      const mappedFilename = slugToImageMap[slug]
      const filePath = path.join(imagesDir, mappedFilename)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({
          image: `/images/characters/${mappedFilename}`,
          type: 'file',
        })
      }
    }

    // 2. Try exact slug match (e.g. luffy -> luffy.png)
    for (const ext of extensions) {
      const filename = `${slug}${ext}`
      const filePath = path.join(imagesDir, filename)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({
          image: `/images/characters/${filename}`,
          type: 'file',
        })
      }
    }

    // 3. Try slug without hyphens (e.g. boa-hancock -> boahancock.png)
    const slugNoHyphen = slug.replace(/-/g, '')
    for (const ext of extensions) {
      const filename = `${slugNoHyphen}${ext}`
      const filePath = path.join(imagesDir, filename)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({
          image: `/images/characters/${filename}`,
          type: 'file',
        })
      }
    }

    // 4. Try slug with underscores (e.g. lao-g might be lao_g)
    const slugUnderscore = slug.replace(/-/g, '_')
    for (const ext of extensions) {
      const filename = `${slugUnderscore}${ext}`
      const filePath = path.join(imagesDir, filename)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({
          image: `/images/characters/${filename}`,
          type: 'file',
        })
      }
    }

    return NextResponse.json({
      image: null,
      type: 'fallback',
    })
  } catch (error) {
    console.error('Error serving character image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
