import decamelize from 'decamelize'

export default function inferCode(name: string) {
  const suffix = 'Command'

  if (name.endsWith(suffix)) {
    name = name.slice(0, -suffix.length)
  }

  return decamelize(name, {
    separator: '-',
  })
}
