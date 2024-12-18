import { useCallback, useEffect, useMemo, useState } from "react";
import './Filter.css';
import { ArrayUtil } from "../js/utils";

function FilterButton({ label, options, applyFilter }) {
    const [showModal, setShowModal] = useState(false);
    const [selection, setSelection] = useState([]);

    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    }
    const handleModalOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay'))
            closeModal();
    };
    const updateFilter = () => {
        if (applyFilter)
            applyFilter(selection);
    };

    return (
        <div className="filter-btn-container">
        <button onClick={openModal}>{label}</button>
        {showModal && (
            <div className="filter-modal">
                <div className="modal-overlay" onClick={handleModalOverlayClick}>
                    <div className="modal-content">
                    <FilterSelection 
                        options={options}
                        currentSelection={selection}
                        applySelection={(newSelection) => setSelection(newSelection)}
                    />
                    <button onClick={closeModal}>Fechar</button>
                    <button onClick={updateFilter}>Filtrar</button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}

function FilterSelection({
    options,
    currentSelection,
    applySelection
}) {
    const [selectedOptions, setSelectedOptions] = useState(currentSelection || []);

    const handleCheckboxChange = (event) => {
        const { checked, value } = event.target;
        if (checked) {
            setSelectedOptions([...selectedOptions, value]);
        } else {
            setSelectedOptions(selectedOptions.filter((option) => option !== value));
        }
        if (applySelection)
            applySelection(selectedOptions);
    };

    return (
        <ul className="filter-selection">
            {options.map((option, i) => (
            <li key={i}>
                <input
                    type="checkbox"
                    name={option.attr}
                    value={option.value}
                    checked={selectedOptions.includes(option.value)}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor={option.attr}>{option.label}</label>
            </li>
            ))}
        </ul>
    );
}

export default function Filter({ apply }) {
    const [activeType, setActiveType] = useState('T');
    const [filterText, setFilterText] = useState('');
    const [filterPlaceholder, setFilterPlaceholder] = useState('');
    const [availableFilters, setAvailableFilters] = useState([]);
    const [conditions, setConditions] = useState(null);
    const [wildcardFields, setWildcardFields] = useState([]);
    const buttonFilters = useMemo(
        () => availableFilters
            .filter(f => Array.isArray(f?.options) && f.options.length)
            .map(af => {
                return {
                    btnFilter: af,
                    appliedValues: conditions?.fields.filter(f => f?.name == af?.name)[0]?.values
                };
            }),
        [availableFilters]
    );
    const filters = {
        'T': [
            {attr: 'numero', label: 'Numero', wildcard: true, single: false},
        ],
        'L': [
            {attr: 'documento', label: 'Documento', wildcard: true, single: false},
        ]
    };
    const sharedFilters = [
        {
            attr: 'estabelecimento',
            label: 'Estabelecimento',
            wildcard: true,
            single: false,
            options: [
                { value: 1, label: 'Austin' },
                { value: 2, label: 'Boston' },
                { value: 3, label: 'Atlanta' },
                { value: 4, label: 'Edinburgh' },
                { value: 5, label: 'Dunedin' },
            ]
        },
        {
            attr: 'fluxo',
            label: 'Fluxo',
            wildcard: false,
            single: true,
            options: [
                { value: 'IN', label: 'Entrada' },
                { value: 'OUT', label: 'Saida'}
            ]
        },
    ];
    const clearConditions = () => {
        setConditions({
            wildcard: {
                fieldNames: [
                    //'estabelecimento', 'numero'
                ],
                text: '' // filterText
            },
            fields: [
                //{ name: 'estabelecimento', values: ['1', '2'] }
            ]
        });
    };
    const activateDocuments = (doctype) => {
        setActiveType(doctype)
        clearConditions();
        setAvailableFilters(filters[doctype].concat(sharedFilters));
    };
    const selectTitulos = () => activateDocuments('T');
    const selectLancamentos = () => activateDocuments('L');
    const clearWildcard = () => {
        return {
            wildcard: {
                fieldNames: wildcardFields?.map(f => f?.attr),
                text: ''
            },
            fields: conditions.fields
        };
    };
    const removeAppliedFilters = (names) => {
        setConditions({
            wildcard: conditions.wildcard,
            fields: conditions.fields.filter(f => names.includes(f?.name))
        });
    };
    const removeAppliedFilter = (name, values) => {
        setConditions({
            wildcard: conditions.wildcard,
            fields: conditions.fields.map(f => {
                if (f?.name != name)
                    return f;
                else
                    return {
                        name: f?.name,
                        values: f?.values.filter(val => !values.includes(val))
                    }
            })
        });
    };
    const applyFilterButton = (attr, values) => {
        setConditions({
            wildcard: conditions.wildcard,
            fields: [...conditions.fields.filter(f => f?.name != attr), {
                name: attr,
                values: values
            }]
        });
    };
    const applyFilterText = () => {
        if ((filterText || '').length >= 3)    
            setConditions({
                wildcard: {
                    fieldsNames: conditions.wildcard.fieldsNames,
                    text: filterText
                },
                fields: conditions.fields
            })
        else if (conditions?.wildcard.text.length >= 3)
            setConditions(clearWildcard());
    };
    useEffect(() => {
        selectTitulos();
    }, []);
    useEffect(() => {
        activateDocuments(activeType);
    }, [activeType]);
    useEffect(applyFilterText, [filterText]);
    useEffect(() => {
        if (apply && conditions)
            apply(conditions);
    }, [conditions]);
    useEffect(() => {
        setFilterPlaceholder(`Buscar por ${ArrayUtil.enumerateSentence(wildcardFields.map(f => f?.label))}`);
    }, [wildcardFields]);

    return (
<div className="nhids-filter">
<section className="filtering">
    <div className="centered">
        <div className="search-area">
        <span>
            <i className="fa-solid fa-search icon"></i>
        </span>
        <input name="search-value"
            type="text"
            placeholder={filterPlaceholder}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)} />
        </div>
        <div className="list-filters">
        <ul className="inline-list">
            { buttonFilters.map((f, i) => (
                <li key={i}>
                    <ul className="inline-list">
                        {f.appliedValues?.map((val, i) => (
                            <li><button>{val}</button></li>
                        ))}
                    </ul>
                    <FilterButton
                        className="clickable"
                        label={ f.btnFilter.label }
                        options={ f.btnFilter.options }
                        applyFilter={(sel) => applyFilterButton(f.btnFilter.attr, sel)}
                    />
                </li>
            )) }
        </ul>
        <button className="tertiary clickable">Limpar</button>
        </div>
    </div>
    <div className="flex-container justify-right">
        <div className="info-selector">
        <button id="by-titulo"
            className={`clickable ${(activeType == 'T') ? 'active' : ''}`}
            onClick={selectTitulos}
        >Por t&iacute;tulo</button>
        <button id="by-lancamento"
            className={`clickable ${activeType == 'L' ? 'active': ''}`}
            onClick={selectLancamentos}
        >Por lan&ccedil;amento</button>
        </div>
    </div>
    </section>
</div>
    );
}