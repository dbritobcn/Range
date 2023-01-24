import {RangeDto} from "../mappers/range.dto";
import {RangeFacade} from "./range.facade";

export class RangeHttpFacade implements RangeFacade {
  async getRange(): Promise<RangeDto> {
    try {
      return fetch(`${process.env.REACT_APP_API_URL}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(RangeDto.fromServer);
    } catch {
      throw new Error('Error loading range');
    }
  }
}
