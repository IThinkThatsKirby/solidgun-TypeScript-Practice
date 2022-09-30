import { Component, createEffect } from "solid-js";
import { Props } from "../App";




const Table: Component<Props> = (props) => {
  // const [ready, set] = createEffect(props)
  console.log(props.data.name)
  return <div>{props.data.name}</div>;
};

export default Table