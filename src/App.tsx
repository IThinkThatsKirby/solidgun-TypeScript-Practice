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
  const [wsStore, setWsStore] = createSignal(data)
  const [tempName, setTempName] = createSignal('null')
  const [tempWordCount, setTempWordCount] = createSignal(0)
  const [kirby, setKirby] = createSignal('LOADING')
  const [onMessageData, setOnMessageData] = createSignal(data)
  const [resName, setResName] = createSignal('null')
  const [resWordCount, setResWordCount] = createSignal(0)
  let wsName = wsStore().name
  // vv This here on message stores 
  socket.onmessage = function (event) {
    let messageRes = event.data
    let messageResArray = messageRes.split(': ')
    setTempName(messageResArray[0])
    setTempWordCount(messageResArray[1].split(' ').length)
    setOnMessageData({ name: tempName(), wordCount: tempWordCount() })
    db.get(onMessageData.name).on(function (res) {
      setResName(res.name)
      setResWordCount(res.wordCount)
      data = { name: resName(), wordCount: tempWordCount() + resWordCount() }
      setWsStore(data)
      setKirby(wsStore().wordCount.toString())
    }).set(wsStore())
  }
  
  
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div>wsStore: -${wsStore().name}-</div>
        <div>{kirby}</div>
        <Table name={wsStore().name} wordCount={wsStore().wordCount} />
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
