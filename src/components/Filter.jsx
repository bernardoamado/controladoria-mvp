import { useCallback, useEffect, useState } from "react";
import './Filter.css';
import { ArrayUtil } from "../js/utils";


function FilterSelection({
    options,
    currentSelection,
    applySelection
}) {
    const [selectedOptions, setSelectedOptions] = useState(currentSelection || []);

    const handleCheckboxChange = (event) => {
        const { checked, value } = event.target;
        if (checked)
            setSelectedOptions([...selectedOptions, value]);
        else
            setSelectedOptions(selectedOptions.filter((option) => option !== value));
    };

    useEffect(() => {
        if (applySelection)
            applySelection(selectedOptions);
    }, [selectedOptions]);

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

function FilterModal({
    title,
    currentFilterSelection,
    filterOptions,
    filterAction,
    closeAction,
    setSelectionCallback
}) {
    const handleModalOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay'))
            closeAction();
    };
    return (
        <div className="filter-modal">
            <div className="modal-overlay" onClick={handleModalOverlayClick}>
                <div className="modal-content">
                    <h1>{title}</h1>
                    <FilterSelection 
                        options={filterOptions}
                        currentSelection={currentFilterSelection}
                        applySelection={(newSelection) => setSelectionCallback(newSelection)}
                    />
                    <button onClick={closeAction}>Fechar</button>
                    <button onClick={filterAction}>Filtrar</button>
                </div>
            </div>
        </div>
    );
}

function FilterButton({
    label,
    options,
    applyFilter,
    currentSelection
}) {
    const [showModal, setShowModal] = useState(false);
    const [selection, setSelection] = useState([]);

    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    }
    const updateFilter = () => {
        if (applyFilter)
            applyFilter(selection);
        closeModal();
    };

    useEffect(() => {
        setSelection(currentSelection);
    }, [currentSelection]);

    return (
        <div className="filter-btn-container">
            <button onClick={openModal}>{label}</button>
            {showModal && <FilterModal
                title={label}
                currentFilterSelection={selection}
                filterOptions={options}
                closeAction={closeModal}
                filterAction={updateFilter}
                setSelectionCallback={setSelection}
            />}
        </div>
    );
}

function AppliedFiltersList({
    buttonFilter,
    appliedValues,
    filterOptions,
    removeAppliedFilterCallback
}) {
    return (
        <ul className="inline-list applied-filters">
            {appliedValues?.map((val, j) => (
                <li key={j} className="applied-filter"><span>
                    {filterOptions?.filter(op => op.value === val)[0]?.label}
                    <button onClick={() => removeAppliedFilterCallback(buttonFilter.attr, [val])}>
                        <i className="fa-solid fa-xmark icon"></i>
                    </button>
                </span></li>
            ))}
        </ul>
    );
}

function FiltersList({
    currentConditions,
    buttons,
    applyFilterButtonCallback,
    removeAppliedFilterCallback,
    clearAppliedFiltersCallback
}) {
    const getCurrentSelection = useCallback(
        (buttonFilter) => currentConditions?.fields
            .filter(f => f?.name === buttonFilter.attr)[0]?.values,
        [currentConditions]
    );
    return (
        <div className="filters-list-container">
            <ul className="inline-list">{ buttons.map((btnFilter, i) => (
                <li key={i} className="button-filters">
                    <AppliedFiltersList
                        buttonFilter={btnFilter}
                        appliedValues={getCurrentSelection(btnFilter)}
                        filterOptions={btnFilter.options}
                        removeAppliedFilterCallback={removeAppliedFilterCallback}
                    />
                    <FilterButton
                        className="clickable"
                        label={ btnFilter.label }
                        options={ btnFilter.options }
                        applyFilter={(sel) => applyFilterButtonCallback(btnFilter.attr, sel)}
                        currentSelection={getCurrentSelection(btnFilter)}
                    />
                </li>
            )) }</ul>
            <button
                className="tertiary clickable"
                onClick={clearAppliedFiltersCallback}
            >Limpar</button>
        </div>
    );
}

function InfoSelector({
    buttons,
    activeBtnId,
    activateCallback
}) {
    return (
        <div className="info-selector">
            {buttons?.map(btn => (
                <button
                    key={btn.id}
                    className={`clickable ${(activeBtnId === btn.id) ? 'active' : ''}`}
                    onClick={() => activateCallback(btn.id)}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
}

export default function Filter({
    apply,
    config
}) {
    const [activeInfo, setActiveInfo] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [filterPlaceholder, setFilterPlaceholder] = useState('');
    const [availableFilters, setAvailableFilters] = useState([]);
    const [conditions, setConditions] = useState(null);
    const [wildcardFields, setWildcardFields] = useState([]);
    const [buttonFilters, setButtonFilters] = useState([]);
    const [infoConfig, setInfoConfig] = useState(config);
    
    const updateConditions = ({
        infoId,
        wildcard,
        fields
    }) => {
        setConditions({
            infoId: infoId || activeInfo,
            wildcard: wildcard || conditions.wildcard,
            fields: fields || conditions.fields
        })
    };
    const clearConditions = () => {
        updateConditions({
            wildcard: {
                fieldNames: [],
                text: '' // filterText
            },
            fields: []
        });
    };
    const activateInfo = (id) => {
        setActiveInfo(id)
        clearConditions();
        if (Array.isArray(infoConfig))
            setAvailableFilters(infoConfig.filter(cfg => cfg.id === id)[0].fields);
    };
    const clearWildcard = () => updateConditions({
        wildcard: {
            fieldNames: wildcardFields?.map(f => f?.attr),
            text: ''
        }
    });
    const clearAppliedFilters = () => updateConditions({
        fields: []
    });
    const removeAppliedFilter = (name, values) => updateConditions({
        fields: conditions.fields.map(f => {
            if (f?.name !== name)
                return f;
            else
                return {
                    name: f?.name,
                    values: f?.values.filter(val => !values.includes(val))
                }
        })
    });
    const applyFilterButton = (attr, values) => {
        updateConditions({
            fields: [...conditions.fields.filter(f => f?.name !== attr), {
                name: attr,
                values: values
            }]
        });
    };
    const applyFilterText = () => {
        if ((filterText || '').length >= 3)    
            updateConditions({
                wildcard: {
                    fieldsNames: conditions.wildcard.fieldsNames,
                    text: filterText
                }
            })
        else if (conditions?.wildcard.text.length >= 3)
            clearWildcard();
    };

    useEffect(() => {
        if (infoConfig)
            activateInfo(infoConfig[0]?.id);
    }, [infoConfig]);
    useEffect(() => {
        setWildcardFields(availableFilters.filter(f => f?.wildcard));
        setButtonFilters(availableFilters.filter(f => Array.isArray(f?.options) && f.options.length));
        clearConditions();
    }, [availableFilters]);
    useEffect(() => {
        setFilterPlaceholder(`Buscar por ${ArrayUtil
            .enumerateSentence(wildcardFields.map(f => f?.label))
            .toLowerCase()}`);
    }, [wildcardFields]);
    useEffect(applyFilterText, [filterText]);
    useEffect(() => {
        if (apply && conditions)
            apply(conditions);
    }, [conditions]);

    return (
        <div className="nhids-filter">
            <section className="filtering">
                <div className="centered">
                    <div className="search-area">
                        <span>
                            <i className="fa-solid fa-search icon"></i>
                        </span>
                        <input
                            name="search-value"
                            type="text"
                            placeholder={filterPlaceholder}
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <FiltersList
                        currentConditions={conditions}
                        buttons={buttonFilters}
                        applyFilterButtonCallback={applyFilterButton}
                        removeAppliedFilterCallback={removeAppliedFilter}
                        clearAppliedFiltersCallback={clearAppliedFilters}
                    />
                </div>
                <div className="flex-container justify-right">
                    <InfoSelector
                        buttons={infoConfig}
                        activeBtnId={activeInfo}
                        activateCallback={(infoId) => activateInfo(infoId)}
                    />
                </div>
            </section>
        </div>
    );
}