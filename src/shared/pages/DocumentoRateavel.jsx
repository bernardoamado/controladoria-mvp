import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Rateios from "../components/Rateios";
import { atilde, ccedil } from "../constants";
import "../styles/DocumentoRateavel.css";
import { useMemo, useState } from "react";
import { apiBaseUrl } from '../config';

export default function DocumentoRateavel({
    doctype,
    label,
    fields
}) {
    const { id } = useParams();
    const docUrl = `${apiBaseUrl}/${doctype}/${id}`;
    const { data: docData, isLoading, error } = useFetch(docUrl);
    const { data: classfins, cfIsLoading, cfError} = useFetch(`${apiBaseUrl}/classificacoesfinanceiras`);
    const { data: centroscustos, ccIsLoading, ccError} = useFetch(`${apiBaseUrl}/centroscustos`);
    const { data: projetos, prIsLoading, prError} = useFetch(`${apiBaseUrl}/projetos`);
    const mainField = useMemo(
        () => fields.filter(f => f?.main)[0]?.name,
        fields
    );
    const [ changes, setChanges ] = useState({});
    const rateios = [{
        label: `Classifica${ccedil}${atilde}o Financeira`,
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'classificacaofinanceira',
        options: classfins,
        key: 'classificacoesfinanceiras',
        isLoading: cfIsLoading,
        error: cfError,
    }, {
        label: 'Centro de Custo',
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'centrocusto',
        options: centroscustos,
        key: 'centroscustos',
        isLoading: ccIsLoading,
        error: ccError,
    }, {
        label: 'Projeto',
        codigo: 'codigo',
        descricao: 'nome',
        id: 'projeto',
        options: projetos,
        key: 'projetos',
        isLoading: prIsLoading,
        error: prError,
    }];

    const updateDoc = () => {
        fetch(docUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rateios: rateios.map(r => r.data)
            })
        })
    };
    const btnEdit = <button className="action-btn primary-btn">Editar documento</button>;
    const btnChanges = [
        <button className="action-btn secondary-btn">Cancelar</button>,
        <button className="action-btn primary-btn">Salvar</button>
    ];
    const actionButtons = useMemo(() => {
        /*if (changes && Object.keys(changes).length)
            return btnChanges;
        else
            return [btnEdit];*/
        return []
    }, [changes]);
    return (
        <article className="page">
            <header className="doc-header">
                {docData && <span className="primary-data">{docData[mainField]}</span>}
                <div className="tips">
                    <ul className="inline-list">
                        <li className="tip primary">{label}</li>
                        <li className="tip warning">A&ccedil;&atilde;o pendente</li>
                        {docData?.adiantamento && <li className="tip text-warning">Adiantamento</li>}
                    </ul>
                </div>
                <div className="action-buttons">
                    <ul className="inline-list">
                        {actionButtons.map((btn, i) => <li key={i}>{btn}</li>)}
                    </ul>
                </div>
            </header>
            <main>
            { isLoading && <p>Carregando dados do {label}...</p>}
            { error && <p>Erro na requisi&ccedil;&atilde;o: <b>{error}</b></p>}
            { (!isLoading) && (!error) && <>
                <section className="doc-info">
                    <ul className="inline-list">
                        {fields
                        .filter(f => !f.main)
                        .map((f, i) => (<li
                            key={i}
                            className="card-info"
                        >
                            <label className="upper-label">{f.label}</label>
                            <span className="card-data">{(f.print || (x => x))(docData[f.name])}</span>
                        </li>))}
                    </ul>
                </section>
                <section className="rateios">
                    <header>
                        <h1>Distribui&ccedil;&atilde;o de rateios</h1><hr className="filler" />
                    </header>
                    <ul className="inline-list">
                        {rateios.map((r, i) => (<li key={i}>
                            { r.isLoading && <p>Carregando {r.label}</p> }
                            { r.error && <p>Erro na requisi&ccedil;&atilde;o de {r.label}: <b>{r.error}</b></p>}
                            { (!r.isLoading) && (!r.error) && <Rateios
                                label={r.label}
                                campoCodigo={r.codigo}
                                campoDescricao={r.descricao}
                                campoId={r.id}
                                options={r.options}
                                dados={(docData?.rateios || {})[r.key]}
                                valorTotal={docData?.valor}
                                setChanges={(ch) => setChanges(prev => ({...prev, [r.key]: ch}))}
                            />}
                        </li>))}
                    </ul>
                </section>
            </> }
            </main>
        </article>
    );
}