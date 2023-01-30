import {useState} from "react";
import {RangeHttpFacade} from "../infrastructure/range.httpFacade";
import {RangeDto} from "../mappers/range.dto";
import {RangeType} from "../presentation/range";

const http = new RangeHttpFacade();

export const useGetRange = (type: RangeType = RangeType.REGULAR): Promise<RangeDto> => {
  const [state] = useState(async () => await http.getRange(type));
  return state;
}
