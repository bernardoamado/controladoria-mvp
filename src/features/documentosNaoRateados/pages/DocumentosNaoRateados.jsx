import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '../../../shared/components/Grid';
import Filter from '../../../shared/components/Filter';
import useFetch from '../../../shared/hooks/useFetch';
import NhxUtil from '../../../shared/utils/NhxUtil';
import ObjectUtil from '../../../shared/utils/ObjectUtil';
import { atilde, ccedil } from '../../../shared/utils/SpecialChars';

export default function DocumentosNaoRateados() {
    // ------------------ CONSTANTS -------------------- //
    const apiBaseUrl = 'http://localhost:3001'
    const columnsTitulos = [
        { id: "numero", header: [{ text: "Numero" }] },
        {
            id: "emissao",
            header: [{ text: "Data de emissao" }],
            type: 'date',
            dateFormat: '%d/%m/%Y',
        },
        {
            id: "vencimento",
            header: [{ text: "Data de vencimento" }],
            type: 'date',
            dateFormat: '%d/%m/%Y',
        },
        { id: 'fluxo', header: [{ text: 'Fluxo' }]},
        {
            id: "valor",
            header: [{ text: "Valor" }],
            type: "number",
            numberMask: NhxUtil.currencyMask
        },
        { id: 'estabelecimento', header: [{ text: 'Estabelecimento' }] },
        {
            id: 'status',
            header: [{ text: 'Situacao' }],
            template: (cell, row, col) => {
                return `<span class="warning">A${ccedil}${atilde}o Pendente</span>`;
            },
            htmlEnable: true
        }
    ];
    const columnsLancamentos = [
        { id: "documento", header: [{ text: "Documento" }] },
        { id: 'fluxo', header: [{ text: 'Fluxo' }]},
        {
            id: "data",
            header: [{ text: "Data do lancamento" }],
            type: 'date',
            dateFormat: '%d/%m/%Y',
        },
        { id: "conta", header: [{ text: "Conta" }] },
        {
            id: "valor",
            header: [{ text: "Valor" }],
            type: "number",
            numberMask: NhxUtil.currencyMask
        },
        { id: 'estabelecimento', header: [{ text: 'Estabelecimento' }] },
    ];
    const sharedFilters = [
        {
            attr: 'estabelecimento',
            label: 'Estabelecimento',
            wildcard: true,
            single: false,
            options: [
                { value: '1', label: 'Austin' },
                { value: '2', label: 'Boston' },
                { value: '3', label: 'Atlanta' },
                { value: '4', label: 'Edinburgh' },
                { value: '5', label: 'Dunedin' },
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
    const filterConfig = [
        {
            id: 'titulos',
            label: 'Por titulo',
            fields: [
                {attr: 'numero', label: 'Numero', wildcard: true, single: false},
                ...sharedFilters
            ]
        },
        {
            id: 'lancamentoscontas',
            label: 'Por lancamento',
            fields: [
                {attr: 'documento', label: 'Documento', wildcard: true, single: false},
                ...sharedFilters
            ]
        }
    ];
    // ------------------------------------------------- //

    // ------------------ METHODS ---------------------- //
    const parseTitulo = (t) => ObjectUtil.parse(t, {
        'vencimento': 'date',
        'emissao': 'date',
        'estabelecimento': (e) => e.nome,
        'fluxo': (fx) => fx.alias,
    });
    const parseLancamento = (l) => ObjectUtil.parse(l, {
        'data': 'date',
        'estabelecimento': (e) => e.nome,
        'fluxo': (fx) => fx.alias,
    });
    const endpoint = ({
        infoId,
        wildcard,
        fields
    }) => {
        let edp = infoId;
        if (wildcard?.text.length || fields?.length)
            edp += '?'
        if (wildcard?.text.length) {
            edp += `q=${wildcard?.text}*`;
            if (fields?.length)
                edp += '&'
        }
        if (fields?.length)
            edp += fields
                .filter(f => f?.values?.length)
                .map(f => `${f.name}.id=${f.values[0]}`)
                .join('&');
        if (edp[edp.length - 1] === '?')
            edp = edp.slice(0, -1);
        return edp;
    };
    // ------------------------------------------------- //

    // -------------------- HOOKS ---------------------- //
    const [url, setUrl] = useState(null);
    const [doctype, setDoctype] = useState('');
    const [gridData, setGridData] = useState([]);
    const [filterConditions, setFilterConditions] = useState(null);
    const {data, isLoading, error} = useFetch(url);
    const navigate = useNavigate();
    const gridConfig = useMemo(() => ({
        autoWidth: true,
        columns: (doctype === 'lancamentoscontas') ? columnsLancamentos : columnsTitulos,
        tooltip: false,
        selection: "row",
        resizable: true,
    }), [doctype]);
    const pkField = useMemo(
        () => (doctype === 'lancamentoscontas') ? 'lancamentoconta': 'id',
        [doctype]
    );

    useEffect(() => {
        if (filterConditions?.infoId === 'titulos')
            setGridData(data.map(parseTitulo));
        else if (filterConditions?.infoId === 'lancamentoscontas')
            setGridData(data.map(parseLancamento));
    }, [data]);
    useEffect(() => {
        if (filterConditions?.infoId) {
            setDoctype(filterConditions.infoId);
            setUrl(`${apiBaseUrl}/${endpoint(filterConditions)}`);
        }
    }, [filterConditions?.infoId]);

    // ------------------------------------------------- //

    const gridDblClick = (row, col, event) => {
        if (gridData && gridData.length) {
            const doc = gridData.filter(d => d[pkField] === row[pkField])[0];
            if (doc)
                navigate(`/${doctype}/${doc[pkField]}`)
        }
    };
    
    return (
        <div className="page">
            <h2>Documentos n&atilde;o rateados</h2>
            <Filter
                apply={(conditions) => setFilterConditions(conditions)}
                config={filterConfig}
            />
            { isLoading && <p>Carregando documentos...</p> }
            { error && <p className='error'>Erro ao carregar os documentos: <b>{error}</b></p>}
            { (!isLoading) && (!error)
            && <Grid
                data={gridData}
                config={gridConfig}
                dblClick={gridDblClick}
            /> }
        </div>
    );
}