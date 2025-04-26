import '@ant-design/v5-patch-for-react-19';  // ⭐️ 兼容React 19
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AntdApp>
          <App />
        </AntdApp>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
