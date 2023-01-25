import {RangeDtoException} from "./exception";

export class RangeDto {
  private constructor(public readonly min: number,
                      public readonly max: number,
                      public readonly data: number[]) {
  }

  static fromServer(props: any): RangeDto {
    const {data} = props;
    RangeDto.validate(data);
    const orderedData = props.data.sort((a: number, b: number) => a - b);
    const result = {
      min: orderedData[0],
      max: orderedData[orderedData.length - 1],
      data: orderedData.slice(1, -1)
    };
    return new RangeDto(result.min, result.max, result.data);
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
