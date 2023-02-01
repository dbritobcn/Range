import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CustomRange, RangeType} from "../range/presentation/range";
import {RangeDto} from "../range/mappers/range.dto";
import {useGetRange} from "../range/hooks/useGetRange";
import {LoadingSpinner} from "../shared/components/loading-spinner/loading-spinner";

export const Exercise1 = () => {
  const [state, setState] = useState<{ min: number, max: number }>({min: 0, max: 0});
  const [range, setRange] = useState<RangeDto>({min: 1, max: 10, values: []});
  const [loading, setLoading] = useState<boolean>(true);
  const getRange: Promise<RangeDto> = useGetRange(RangeType.REGULAR);

  useEffect(() => {
    getRange.then((response: RangeDto) => {
      setRange(response);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Exercise 1</h1>
      {loading && <LoadingSpinner/>}
      {!loading && (
        <>
          <div className="exercise-container">
            <CustomRange data={range}
                         onChange={(value: { min: number, max: number }) => {
                           setState(value);
                         }}/>
          </div>
          <table>
            <tbody>
            <tr>
              <td>Min</td>
              <td data-testid="minResult">{state.min}</td>
            </tr>
            <tr>
              <td>Max</td>
              <td data-testid="maxResult">{state.max}</td>
            </tr>
            </tbody>
          </table>
          <Link to={'/exercise2'}>Exercise 2</Link>
        </>
      )}
    </div>
  )
}
