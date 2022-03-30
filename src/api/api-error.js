export default class ServerError extends Error {
  constructor(message, name) {
    super();
    this.message = message;
    this.name = name;
  }
}
