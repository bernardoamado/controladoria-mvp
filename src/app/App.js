import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import "@dhx/trial-suite/codebase/suite.min.css";

import Navbar from '../shared/components/Navbar';
import Nhids from './theme/Nhids';
import { Breadcrumbs, BreadcrumbsProvider } from '../shared/components/Breadcrumbs';
import AppRoutes from './routes';

export default function App() {
    return (
        <Nhids>
        <BreadcrumbsProvider>
            <BrowserRouter>
                <header className="app-header">
                    <Navbar />
                    <Breadcrumbs />
                </header>
                <main className="app-main">
                    <AppRoutes />
                </main>
            </BrowserRouter>
        </BreadcrumbsProvider>
        </Nhids>
    );
}