import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Buffer } from "buffer";
window.Buffer = Buffer;


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);