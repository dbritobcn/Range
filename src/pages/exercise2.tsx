import React from "react";
import {Link} from "react-router-dom";
import {CustomRange} from "../range/presentation/range";

export const Exercise2 = () => {
  return (
    <>
      <h1>Exercise 2</h1>
      <div className="exercise-container">
        <CustomRange  min={0} max={10} onChange={(e) => console.info('Value', e)} />
      </div>
      <Link to={'/exercise1'}>Exercise 1</Link>
    </>
  )
}
