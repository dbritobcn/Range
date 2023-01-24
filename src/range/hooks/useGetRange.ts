import {useState} from "react";
import {RangeHttpFacade} from "../infrastructure/range.httpFacade";
import {RangeDto} from "../mappers/range.dto";

const http = new RangeHttpFacade();

export const useGetRange = (): Promise<RangeDto> => {
  const [state] = useState(async () => {
    const value: RangeDto = await http.getRange();
    return value;
  });

  return state;
}
