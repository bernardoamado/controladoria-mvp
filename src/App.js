import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@dhx/trial-suite/codebase/suite.min.css";
import Home from './pages/Home';
import EditTitulo from './pages/EditTitulo';
import EditLancamento from './pages/EditLancamento';
import DocumentosNaoRateados from './pages/DocumentosNaoRateados';
import Navbar from './components/Navbar';
import Nhids from './components/Nhids';

export default function App() {
    return (
<div>
    <Nhids />
    <header>
        <Navbar />
    </header>
    <main>
        <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/titulos/:id" element={<EditTitulo />} />
            <Route path="/lancamentos/:id" element={<EditLancamento />} />
            <Route path="/docs-nao-rateados" element={<DocumentosNaoRateados />} />
        </Routes>
        </Router>
    </main>
</div>
    );
}