import {RangeDto} from "../mappers/range.dto";

export abstract class RangeFacade {
  abstract getRange(): Promise<RangeDto>;
}
