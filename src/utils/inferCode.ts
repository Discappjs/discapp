export default function inferCode(name: string) {
  const suffix = 'Command'

  if (name.endsWith(suffix)) {
    return name.slice(0, -suffix.length).toLowerCase()
  }

  return name.toLowerCase()
}
