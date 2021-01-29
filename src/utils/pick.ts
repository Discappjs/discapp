export default function pick(target: any, keysToInclude: string[]) {
  const resObject = {}

  for (const key of Object.keys(target)) {
    if (keysToInclude.includes(key)) {
      resObject[key] = target[key]
    }
  }

  return resObject
}
