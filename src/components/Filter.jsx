import { useState } from "react";


export default function Filter({ apply }) {
    const [activeType, setActiveType] = useState('T');
    const [filterText, setFilterText] = useState(null);
    const [filterPlaceholder, setFilterPlaceholder] = useState('');
    const [availableFilters, setAvailableFilters] = useState([]);
    const filters = {
        'T': [
            {attr: 'numero', label: 'Numero'},
            {attr: 'estabelecimento', label: 'Estabelecimento'}
        ],
        'L': [
            {attr: 'documento', label: 'Documento'},
            {attr: 'estabelecimento', label: 'Estabelecimento'}
        ]
    };
    const activateDocuments = (doctype) => {
        setActiveType(doctype)
        setAvailableFilters(filters[doctype]);
    };
    const selectTitulos = (e) => activateDocuments('T');
    const selectLancamentos = (e) => activateDocuments('L');
    const doFilter = (e) => {
        apply(filterText);
    };

    return (
<div className="nhids-filter">
<section className="filtering">
    <div className="centered">
        <div className="search-area">
        <button className="clickable">
            <i className="fa-solid fa-search icon"></i>
        </button>
        <input name="search-value"
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)} />
        </div>
        <div className="list-filters">
        <ul className="inline-list">
            { availableFilters.map(dataFilter => (<li>
                <button className="clickable" >{ dataFilter.label }</button>
            </li>)) }
        </ul>
        <button className="tertiary clickable">Limpar</button>
        </div>
    </div>
    <div className="flex-container justify-right">
        <div className="info-selector">
        <button id="by-titulo"
            className={`clickable ${titulosIsActive ? 'active' : ''}`}
            onClick={selectTitulos}
        >Por t&iacute;tulo</button>
        <button id="by-lancamento"
            className={`clickable ${lancamentosIsActive ? 'active': ''}`}
            onClick={selectLancamentos}
        >Por lan&ccedil;amento</button>
        </div>
    </div>
    </section>
</div>
    );
}