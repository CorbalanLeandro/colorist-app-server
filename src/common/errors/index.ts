export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`Not implemented: ${method}`);
  }
}
