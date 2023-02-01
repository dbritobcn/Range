import {RangeDto} from "../src/range/mappers/range.dto";

export const rangeRegularFixture = RangeDto.fromServer({rangeValues: [1, 10]});
export const rangeFixedFixture = RangeDto.fromServer({rangeValues: [1.99, 5.99, 2.99, 30.99, 50.99, 70.99]});
