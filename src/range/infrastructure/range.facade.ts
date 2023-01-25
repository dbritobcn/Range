import {RangeDto} from "../mappers/range.dto";
import {RangeType} from "../presentation/range";

export abstract class RangeFacade {
  abstract getRange(type: RangeType): Promise<RangeDto>;
}
