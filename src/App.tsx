import type { Component } from 'solid-js';
import  Table  from './components/Table'
import logo from './logo.svg';
import styles from './App.module.css';

export type Props = {
  data: string
}


const App: Component = () => {
  const kirby = '2323'
  
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Table data={kirby} />
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
