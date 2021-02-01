export default class Exception extends Error {
  constructor(
    public readonly code: string,
    public readonly commandName: string,
    public readonly argumentName: string,
    public readonly message: string
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}
