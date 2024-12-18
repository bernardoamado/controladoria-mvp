import { useEffect, useState } from 'react';
import Grid from '../components/Grid';
import Filter from '../components/Filter';
import useFetch from '../js/useFetch';
import { NhxUtil, ObjectUtil } from '../js/utils';

export default function DocumentosNaoRateados() {
    const parseTitulo = (t) => ObjectUtil.parse(t, {
        'vencimento': 'date',
        'emissao': 'date',
    });
    const { data: fetchedTitulos, isLoading, error } = useFetch('http://localhost:3001/titulos');
    const [titulos, setTitulos] = useState([]);

    useEffect(() => {
        if (fetchedTitulos)
            setTitulos(fetchedTitulos.map(parseTitulo));
    }, [fetchedTitulos]);

    const gridConfig = {
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
        //editable: true,
    };
    
    return (
        <div className="page">
            <h2>Documentos n&atilde;o rateados</h2>
            
                <Filter apply={(conditions) => console.log('Vai aplicar o filtro: ', conditions)} />
                { isLoading && <p>Carregando documentos...</p> }
                { error && <p className='error'>Erro ao carregar os documentos: <b>{error}</b></p>}
                { (!isLoading) && (!error)
                && <Grid
                    gridData={ObjectUtil.copy(titulos)}
                    config={gridConfig}
                    pkey="id"
                    dblClick={(t) => alert(`titulo: ${t.numero}`)}
                /> }
            
        </div>
    );
}