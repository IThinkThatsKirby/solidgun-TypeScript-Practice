import { Component, createSignal, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import  Table  from './components/Table'
import logo from './logo.svg';
import styles from './App.module.css';
// import { io } from 'socket.io-client';
import Gun from 'gun';
const db = Gun()
const wssURL = import.meta.env.VITE_WSSURL
let wssRes
let messages = 'LOADING MESSAGES'
let socket = new WebSocket(wssURL)
// websockets to gunDB => gunDB => Table
export type Props = {
   // name, wordCount, message but not needed.
  name: string,
  wordCount: number
  
}




const App: Component = () => {
  let data = {
    name: 'kirby', 
    wordCount: 0
  }
  const [wsStore, setWsStore] = createStore(data)
  const [tempName, setTempName] = createSignal('null')
  const [tempWordCount, setWordCount] = createSignal(0)
  const [kirby, setKirby] = createSignal('LOADING')
  let wsName = wsStore.name
  socket.onmessage = function (event) {
    let tempData = { name:'kirby', wordCount:0}
    let messageRes = event.data
    let messageResArray = messageRes.split(': ')
    setTempName(messageResArray[0])
    setWordCount(messageResArray[1].split(' ').length)
    db.get(tempData.name).on(function (res) {
      let newNumber = tempWordCount()
      setKirby(res)
      tempData.wordCount = tempWordCount() + res.wordCount
      data = { name: tempName(), wordCount: tempData.wordCount }
      setWsStore(data)
      setKirby(wsStore.wordCount.toString())
    }).put(wsStore)

    // console.log(wsStore)
    // console.log(db.get(data.name))
  }
  
  
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div>wsStore: -${data.name}-</div>
        <div>{kirby}</div>
        <Table name={wsStore.name} wordCount={wsStore.wordCount} />
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solidasdfasdf
        </a>
      </header>
    </div>
  );
};

export default App;
