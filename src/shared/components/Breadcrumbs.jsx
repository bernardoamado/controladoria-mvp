import React, { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Breadcrumbs.css';


// Create a BreadcrumbsContext
const BreadcrumbsContext = createContext();

// BreadcrumbsProvider component
function BreadcrumbsProvider({ children }) {
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const updateBreadcrumbs = (newBreadcrumbs) => {
        setBreadcrumbs(newBreadcrumbs);
    };

    return (
        <BreadcrumbsContext.Provider value={{ breadcrumbs, updateBreadcrumbs }}>
            {children}
        </BreadcrumbsContext.Provider>
    );
}

function useBreadcrumbs() {
    const context = useContext(BreadcrumbsContext);

    if (context === undefined)
        throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');

    return context;
};

function Breadcrumbs() {
    const { breadcrumbs } = useContext(BreadcrumbsContext);

    return (
        <nav aria-label="Breadcrumb"
            className={(breadcrumbs?.length > 1) ? 'breadcrumbs-nav' : 'hidden'}
        >
            <ol className="breadcrumbs inline-list">
                <li className="breadcrumb-item">
                    <Link to="/">Controladoria</Link>
                </li>
                {breadcrumbs?.map((crumb, i) => (
                    <li className="breadcrumb-item" key={i}>
                        <span className="breadcrumb-separator">
                            <i className="fa-solid fa-chevron-right"></i>
                        </span>
                        <Link to={crumb.endpoint}>
                            {crumb.label} 
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export {
    Breadcrumbs,
    BreadcrumbsProvider,
    useBreadcrumbs
};