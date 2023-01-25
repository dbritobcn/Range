export namespace RangeDtoException {
  export class Params extends Error {
    constructor() {
      super('Wrong range params');
    }
  }

  export class DataType extends Error {
    constructor() {
      super('Wrong data type');
    }
  }
}
