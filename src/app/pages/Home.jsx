import { Link, useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "../../shared/components/Breadcrumbs";
import { useEffect } from "react";
import '../styles/Home.css';

export default function Home() {
    const { breadcrumbs, updateBreadcrumbs } = useBreadcrumbs();
    useEffect(() => {
        updateBreadcrumbs([]);
    }, [breadcrumbs?.length])
    const navigate = useNavigate();

    return (
        <div className="page">
            <h1>Home page</h1>
            <ul>
                <li><Link to="/docs-nao-rateados">Documentos n&atilde;o rateados</Link></li>
            </ul>
            <section id="processamentos">
                <header>
                    <h2>Processamentos</h2>
                    <p>Atualiza&ccedil;&atilde;o do &uacute;ltimo processamento realizado em dd/mm/YYYY</p>
                </header>
                <main>
                    <ul className="inline-list">
                        <li className="card">
                            <h3>Documentos rateados</h3>
                            <div className="card-main-info">120</div>
                            <div className="card-info">
                                <ul className="inline-list">
                                    <li><label>Nº de t&iacute;tulos:</label><span>10</span></li>
                                    <li><label>Nº de lan&ccedil;amentos:</label><span>110</span></li>
                                </ul>
                            </div>
                            <div className="card-toast"></div>
                        </li>
                    </ul>
                </main>
                <footer>
                    <button
                        className="action-btn secondary-btn"
                        onClick={() => navigate('/processamentos')}
                    >
                        Acessar Processamentos
                    </button>
                </footer>
            </section>
        </div>
    );
}