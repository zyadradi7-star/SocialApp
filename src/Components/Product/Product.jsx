import React, { memo, useCallback, useState } from "react";
import Child from "../Child";
// import Child, { MemoizedChild } from "../Child";

export default function Product() {
  const [counter, setCounter] = useState(0);

  const sayHello = useCallback(() => {
    console.log("say Hello");

    return "moshed  ";
  }, []);
  return (
    <>
      <h2>Product</h2>
      <h2>Counter : {counter}</h2>
      <button className="bg-amber-300" onClick={() => setCounter(Math.random)}>
        Change
      </button>
      <Child sayHello={sayHello} />
      {/* <MemoizedChild /> */}
    </>
  );
}
