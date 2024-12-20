import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '../components/Grid';
import Filter from '../components/Filter';
import useFetch from '../js/useFetch';
import { NhxUtil, ObjectUtil } from '../js/utils';

export default function DocumentosNaoRateados() {
    const [ url, setUrl ] = useState(null);
    const [doctype, setDoctype] = useState('');
    const [gridData, setGridData] = useState([]);
    const [gridConfig, setGridConfig] = useState(null);
    const [filterConditions, setFilterConditions] = useState(null);
    const { data, isLoading, error } = useFetch(url);
    const navigate = useNavigate();
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
    const apiBaseUrl = 'http://localhost:3001'
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
    }, [filterConditions]);

    useEffect(() => {
        if (doctype)
            setGridConfig((doctype === 'titulos')
                ? gridConfigTitulos
                : gridConfigLancamentos);
    }, [doctype]);

    const gridConfigTitulos = {
        autoWidth: true,
        columns: [
            { id: "numero", header: [{ text: "Numero" }] },
            { id: 'fluxo', header: [{ text: 'Fluxo' }]},
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
            {
                id: "valor",
                header: [{ text: "Valor" }],
                type: "number",
                numberMask: NhxUtil.currencyMask
            },
            { id: 'estabelecimento', header: [{ text: 'Estabelecimento' }] },
        ],
        tooltip: false,
        //css: "grid",
        //multiselection: true,
        selection: "row",
        resizable: true,
        //editable: true,
    };
    const gridConfigLancamentos = {
        autoWidth: true,
        columns: [
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
        ],
        tooltip: false,
        selection: "row",
        resizable: true,
    };
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
                pkey="id"
                dblClick={(d) => navigate(`/${doctype}/${d.id}`)}
            /> }
        </div>
    );
}