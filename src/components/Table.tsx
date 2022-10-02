import { Component, createEffect, createSignal } from "solid-js";
import { Props } from "../App";
import Gun from 'gun';
// db = Database instance. refer to db.something when using the db
const db = Gun()


const [update, setUpdate] = createSignal('ks')
const Table: Component<Props> = (props) => {
  createEffect(setUpdate(props.Oliver.wordCount))

  return <div>{update}</div>; 
};

export default Table