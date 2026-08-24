import React, { memo } from "react";

export default memo(function Child() {
  console.log("child.....");

  return <div>Child</div>;
});
// export const MemoizedChild = memo(Child);
