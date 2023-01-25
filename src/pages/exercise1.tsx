import React from "react";
import {Link} from "react-router-dom";
import {CustomRange} from "../range/presentation/range";

export const Exercise1 = () => {
  return (
    <>
      <h1>Exercise 1</h1>
      <div className="exercise-container">
        <CustomRange onChange={(e) => console.info('Value', e)} />
      </div>
      <Link to={'/exercise2'}>Exercise 2</Link>
    </>
  )
}
