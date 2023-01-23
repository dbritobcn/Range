import React from "react";
import {Link} from "react-router-dom";
import {CustomRange} from "../range/presentation/range";

export const Exercise2 = () => {
  return (
    <>
      <h1>Exercise 2</h1>
      <CustomRange />
      <Link to={'/exercise1'}>Exercise 1</Link>
    </>
  )
}
