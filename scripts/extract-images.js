const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '../public/images/characters')
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.htm') || f.endsWith('.html'))

files.forEach(filename => {
  const filePath = path.join(imagesDir, filename)
  const htmlContent = fs.readFileSync(filePath, 'utf-8')
  
  // Try to find base64 image - look for the longest match
  const base64Pattern = /data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\s]+)/g
  let bestMatch = null
  let maxLength = 0
  
  let match
  while ((match = base64Pattern.exec(htmlContent)) !== null) {
    const fullMatch = match[0]
    if (fullMatch.length > maxLength) {
      maxLength = fullMatch.length
      bestMatch = fullMatch
    }
  }
  
  if (bestMatch) {
    // Extract the image type and data
    const typeMatch = bestMatch.match(/data:image\/([^;]+);base64,/)
    if (typeMatch) {
      const imageType = typeMatch[1]
      const base64Data = bestMatch.split(',')[1]
      const outputFilename = filename.replace(/\.(htm|html)$/, `.${imageType}`)
      const outputPath = path.join(imagesDir, outputFilename)
      
      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(outputPath, imageBuffer)
      console.log(`Extracted ${outputFilename} from ${filename}`)
    }
  } else {
    console.log(`No base64 image found in ${filename}`)
  }
})

console.log('Image extraction complete!')
