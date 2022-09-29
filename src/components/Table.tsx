import { Component } from "solid-js";
import { Props } from "../App";




const Table: Component<Props> = (props) => {
  console.log(props.data)
  return <div>{props.data}</div>;
};

export default Table