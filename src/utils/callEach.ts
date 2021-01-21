export default async function callEach(fns: Function[], args: any[]) {
  for (const fn of fns) {
    await fn(...args)
  }
}
