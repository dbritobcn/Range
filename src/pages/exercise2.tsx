import React, {useState} from "react";
import {Link} from "react-router-dom";
import {CustomRange, RangeType} from "../range/presentation/range";

export const Exercise2 = () => {
  const [state, setState] = useState<{ min: number, max: number }>({min: 0, max: 0});

  return (
    <>
      <h1>Exercise 2</h1>
      <div className="exercise-container">
        <CustomRange type={RangeType.FIXED}
                     onChange={(value) => {
                       setState(value);
                     }}/>
      </div>
      <table>
        <tbody>
        <tr>
          <td>Min</td>
          <td>{state.min}</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>{state.max}</td>
        </tr>
        </tbody>
      </table>
      <Link to={'/exercise1'}>Exercise 1</Link>
    </>
  )
}
