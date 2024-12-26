import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '../../../shared/components/Grid';
import Filter from '../../../shared/components/Filter';
import useFetch from '../../../shared/hooks/useFetch';
import NhxUtil from '../../../shared/utils/NhxUtil';
import ObjectUtil from '../../../shared/utils/ObjectUtil';
import {
    atilde,
    ccedil,
    iacute,
    uacute
} from '../../../shared/constants';
import { useBreadcrumbs } from '../../../shared/components/Breadcrumbs';

export default function DocumentosNaoRateados() {
    // ------------------ CONSTANTS -------------------- //
    const apiBaseUrl = 'http://localhost:3001'
    const columnsTitulos = [
        { id: "numero", header: [{ text: `N${uacute}mero` }] },
        {
            id: "emissao",
            header: [{ text: `Data de emiss${atilde}o` }],
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
            header: [{ text: `Situa${ccedil}${atilde}o` }],
            template: (cell, row, col) => {
                return `<span class="tip warning">A${ccedil}${atilde}o Pendente</span>`;
            },
            htmlEnable: true
        },
    ];
    const columnsLancamentos = [
        { id: "documento", header: [{ text: "Documento" }] },
        { id: 'fluxo', header: [{ text: 'Fluxo' }]},
        {
            id: "data",
            header: [{ text: `Data do lan${ccedil}amento` }],
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
        {
            id: 'status',
            header: [{ text: `Situa${ccedil}${atilde}o` }],
            template: (cell, row, col) => {
                return `<span class="tip warning">A${ccedil}${atilde}o Pendente</span>`;
            },
            htmlEnable: true
        }
    ];
    const sharedFilters = [
        {
            attr: 'estabelecimento',
            label: 'Estabelecimento',
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
            options: [
                { value: 'IN', label: 'Entrada' },
                { value: 'OUT', label: 'Saida'}
            ]
        },
    ];
    const filterConfig = [
        {
            id: 'titulos',
            label: `T${iacute}tulo`,
            fields: [
                {attr: 'numero', label: `N${uacute}mero`, wildcard: true},
                ...sharedFilters
            ]
        },
        {
            id: 'lancamentoscontas',
            label: `Lan${ccedil}amento`,
            fields: [
                {attr: 'documento', label: 'Documento', wildcard: true},
                {attr: 'conta', label: 'Conta', wildcard: true},
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
        () => (doctype === 'lancamentoscontas') ? 'id': 'id',
        [doctype]
    );
    const { updateBreadcrumbs } = useBreadcrumbs();

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
    useEffect(() => updateBreadcrumbs([
        { label: `Documentos n${atilde}o rateados`, endpoint: '/docs-nao-rateados' }
    ]), []);

    // ------------------------------------------------- //

    const handleNavigate = (row, ...args) => {
        const newEndpoint = `/${doctype}/${row[pkField]}`;
        updateBreadcrumbs(crumbs => [
            ...crumbs,
            { label: 'Dados do documento', endpoint: newEndpoint }
        ]);
        navigate(newEndpoint);
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
                dblClick={handleNavigate}
            /> }
        </div>
    );
}