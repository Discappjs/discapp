export default interface CommandContract {
  setProperty(key: string, value: any): this
  beforeExecute(): void
  execute(): any
  afterExecute(): void
}
