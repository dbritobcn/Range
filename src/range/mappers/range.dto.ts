export class RangeDto {
  private constructor(public readonly min: number,
                      public readonly max: number) {
  }

  static fromServer(props: any): RangeDto {
    RangeDto.validate(props);
    return new RangeDto(props.min, props.max);
  }

  static validate(props: any): void {
    if (!props.min || !props.max) {
      throw new Error('Wrong range params');
    }
  }
}
