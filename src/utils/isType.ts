export function isObject(target: any): target is object {
  return typeof target === 'object'
}

export function isString(target: any): target is string {
  return typeof target === 'string'
}

export function isNumber(target: any): target is number {
  return typeof target === 'number'
}
