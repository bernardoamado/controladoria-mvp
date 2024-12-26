import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@dhx/trial-suite/codebase/suite.min.css";
import Home from './pages/Home';
import Titulo from '../shared/pages/Titulo';
import DocumentosNaoRateados from '../features/documentosNaoRateados/pages/DocumentosNaoRateados';
import Navbar from '../shared/components/Navbar';
import Nhids from './theme/Nhids';
import Lancamento from '../shared/pages/Lancamentos';

export default function App() {
    return (
<Nhids>
    <Router>
        <header>
            <Navbar />
        </header>
        <main>        
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/titulos/:id" element={<Titulo />} />
                <Route path='/lancamentos/:id' element={<Lancamento />} />
                <Route path="/docs-nao-rateados" element={<DocumentosNaoRateados />} />
            </Routes>
        </main>
    </Router>
</Nhids>
    );
}