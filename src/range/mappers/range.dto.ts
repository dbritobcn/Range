import {RangeDtoException} from "./exception";

export class RangeDto {
  private constructor(public readonly min: number,
                      public readonly max: number,
                      public readonly values?: number[]) {
  }

  static fromServer(props: any): RangeDto {
    const {rangeValues} = props;
    RangeDto.validate(rangeValues);
    const orderedValues = props.rangeValues.sort((a: number, b: number) => a - b);
    const result = {
      min: orderedValues[0],
      max: orderedValues[orderedValues.length - 1],
      values: orderedValues
    };
    return new RangeDto(result.min, result.max, result.values);
  }

  static validate(data: number[]): void {
    if (!data.length) {
      throw new RangeDtoException.Params();
    }
    if (data.some((value: number) => typeof value !== 'number')) {
      throw new RangeDtoException.DataType();
    }
  }
}
