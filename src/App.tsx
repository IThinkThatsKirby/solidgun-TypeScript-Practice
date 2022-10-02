import { Component, createSignal, onMount } from 'solid-js'
import  { createStore } from 'solid-js/store'
import { SimpleTable } from "solid-simple-table"
import styles from './App.module.css';
import GUN from 'gun/gun';
import open from 'gun/lib/open'
import load from 'gun/lib/load.js';
open
load // this makes load actually import lol what.

// db = Database instance. refer to db.something when using the db
const db = GUN()
const wssURL = import.meta.env.VITE_WSSURL

let socket = new WebSocket(wssURL)
// websockets to gunDB => gunDB => Table
let dbTemplate = {
    name: 'kirby',
    wordCount: 0
}



// name, wordCount, message but not needed.
let arr = [{name: 'LOADING', wordCount: 0}]
// how I want my DB data to look.
const [tempName, setTempName] = createSignal('null')
const [tempWordCount, setTempWordCount] = createSignal(0)
const [onMessageData, setOnMessageData] = createSignal(dbTemplate)// we will also use this to trigger a table update. vv
const [resWordCount, setResWordCount] = createSignal(0)
const [wsMessage, setWsMessage] = createSignal('WAITING FOR SERVER')
const [foundNames, setFoundNames] = createStore(['kirby'])
const [tableStore, setTableStore] = createStore([{name: 'LOADING', wordCount: 0}])
type Props = {
  initialRows: typeof tableStore
}
// vv This here on message stores 
socket.onmessage = (event) => {
  let messageRes = event.data
  let messageResArray = messageRes.split(': ') // ['name','message']
  setTempName(messageResArray[0])//['name']
  //point to database location by 'key' Lets use the name as the key for now. 
  //We should use the key as a unique identifier for WHERE the data comes for scalability. <=DONE
  // also required to db.get('key') to find ALL the db listings we want to display. I'm really liking how this web3 decentralized system works. GRAPHS FTW !!
  db.get('webSocketMessages').get(tempName(), (ack) => {
    // MAYBE I should put this callback function somewhere else and just call it by name for better readability?
    setResWordCount(ack.put?.wordCount || 0)
    setWsMessage(messageResArray[1])
    setTempWordCount(messageResArray[1].split(' ').length)
    let addCount = resWordCount() + tempWordCount()
    setOnMessageData({ name: tempName(), wordCount: addCount })
    //put data in the DB WHERE .get(key) says, OR create. THEN we update tableData to the table so it stays current :D.
  }).put(onMessageData()).back().load((data:typeof arr) => {
    arr = Object.values(data)
    arr.sort((a,b)=>b.wordCount-a.wordCount)
    setTableStore(arr)
  })
}
export const MyTable: Component<Props> = (props: Props) => {
  const [getRows, setRows] = createSignal(props.initialRows)
  setRows(props.initialRows)
  return <SimpleTable rows={getRows()} />
}

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div>current incoming message:</div>
        <div>{tempName()}: +{tempWordCount()} words</div>
        <div class={styles.table}>
          <MyTable initialRows={tableStore} />
        </div>
      </header>
    </div>
  );
};

export default App;
