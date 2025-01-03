import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Titulo from '../shared/pages/Titulo';
import DocumentosNaoRateados from '../features/documentosNaoRateados/pages/DocumentosNaoRateados';
import Lancamento from '../shared/pages/Lancamento';
import Regras from '../features/regras/pages/Regras';
import Processamentos from '../features/processamentos/pages/Processamentos';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/titulos/:id" element={<Titulo />} />
            <Route path='/lancamentoscontas/:id' element={<Lancamento />} />
            <Route path="/docs-nao-rateados" element={<DocumentosNaoRateados />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/processamentos" element={<Processamentos />} />
        </Routes>
    );
}