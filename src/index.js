import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { SDK_KEYS } from './App'
import reportWebVitals from './reportWebVitals';

window.App = {
  create(sdk= SDK_KEYS.SET) {
    this.destroy();
    ReactDOM.render(
      <React.StrictMode>
        <App sdk={sdk}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
  },
  destroy() {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  }
}
window.App.create();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
