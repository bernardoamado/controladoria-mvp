import { Link } from "react-router-dom";
import { useBreadcrumbs } from "../../shared/components/Breadcrumbs";
import { useEffect } from "react";

export default function Home() {
    const { breadcrumbs, updateBreadcrumbs } = useBreadcrumbs();
    useEffect(() => {
        updateBreadcrumbs([]);
    }, [breadcrumbs?.length])

    return (
        <div className="page">
            <h2>Home page</h2>
            <ul>
                <li><Link to="/docs-nao-rateados">Documentos n&atilde;o rateados</Link></li>
            </ul>
        </div>
    );
}