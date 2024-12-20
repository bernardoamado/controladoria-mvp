import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="page">
            <h2>Home page</h2>
            <ul>
                <li><Link to="/docs-nao-rateados">Documentos n&atilde;o rateados</Link></li>
            </ul>
        </div>
    );
}