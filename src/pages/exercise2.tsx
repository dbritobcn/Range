import React from "react";
import {Link} from "react-router-dom";
import {CustomRange, RangeType} from "../range/presentation/range";

export const Exercise2 = () => {
  return (
    <>
      <h1>Exercise 2</h1>
      <div className="exercise-container">
        <CustomRange type={RangeType.FIXED}
                     onChange={(e) => {
                       console.info('Value', e)
                     }} />
      </div>
      <Link to={'/exercise1'}>Exercise 1</Link>
    </>
  )
}
