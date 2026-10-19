import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import App from './app/App.jsx';
import './app/styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>);
