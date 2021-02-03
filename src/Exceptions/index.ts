export default class Exception extends Error {
  constructor(
    public readonly code: string,
    public readonly commandCode: string,
    public readonly argumentName: string,
    public readonly message: string
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}
