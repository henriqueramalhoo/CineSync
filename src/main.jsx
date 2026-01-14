import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TemaProvider } from './contextos/TemaContexto';
import { PesquisaProvider } from './contextos/PesquisaContexto';
import { PerfilProvider } from './contextos/PerfilContexto';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <BrowserRouter>
        <PerfilProvider>
          <PesquisaProvider>
            <App />
          </PesquisaProvider>
        </PerfilProvider>
      </BrowserRouter>
    </TemaProvider>
  </StrictMode>
);
