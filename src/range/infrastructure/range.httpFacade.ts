import {RangeDto} from "../mappers/range.dto";
import {RangeFacade} from "./range.facade";
import {RangeType} from "../presentation/range";

export class RangeHttpFacade implements RangeFacade {
  async getRange(type: RangeType): Promise<RangeDto> {
    try {
      return fetch(`${process.env.REACT_APP_API_URL}/${type}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(RangeDto.fromServer);
    } catch {
      throw new Error('Error loading range');
    }
  }
}
