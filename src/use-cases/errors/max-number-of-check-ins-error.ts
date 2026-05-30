export class MaxNumberOFCheckInsError extends Error {
  constructor() {
    super('Max number of check-ins reached.');
  }
}
