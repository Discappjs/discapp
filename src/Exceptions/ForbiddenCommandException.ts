export default class ForbiddenCommandException extends Error {
  constructor(
    public readonly code: string,
    public readonly commandCode: string,
    public readonly requires: string,
    public readonly message: string
  ) {
    super()
    Error.captureStackTrace(this, this.constructor)
  }
}
