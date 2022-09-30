import { Component, createSignal, onMount } from 'solid-js'
  import { createStore } from 'solid-js/store'
import  Table  from './components/Table'
import logo from './logo.svg';
import styles from './App.module.css';
import { io } from 'socket.io-client';
import Gun from 'gun';
const db = Gun()
const wssURL = import.meta.env.VITE_WSSURL
let wssRes
let messages = 'LOADING MESSAGES'
let socket = new WebSocket(wssURL)
// websockets to gunDB => gunDB => Table
export type Props = {
  data: { // name, wordCount, message but not needed.
  name: string
  wordCount: number
  }
}
let data = { name: 'kirby',wordCount:0}
const [wsStore, setWsStore] = createStore(data)
const [kirby, setKirby] = createSignal('LOADING')



const App: Component = () => {
  socket.onmessage = function (event) {
    let res = event.data
    let resArray = []
    resArray = res.split(': ')
    let name = resArray[0]
    let wordCount = resArray[1].split(' ').length
    data = { name, wordCount }
    
    db.get(name).map().once(function(res){
wordCount = wordCount + res.wordCount}).set(data)
    
    setWsStore(data)
    setKirby(resArray[1].length)
    // console.log(wsStore)
    // console.log(db.get(name))
  }

  
  
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div>wsStore: -{wsStore.name}- wsStore</div>
        <div>{kirby}</div>
        <Table data={wsStore} />
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
