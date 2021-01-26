import fs from 'fs'
import path from 'path'

export default function getDirectoryFiles(dirPath: string) {
  const dirFiles = fs.readdirSync(dirPath)
  const result = []

  for (const dirFile of dirFiles) {
    if (['.ts', '.js'].includes(path.extname(dirFile))) {
      result.push(path.resolve(dirPath, dirFile))
    }
  }

  return result
}
