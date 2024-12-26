import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Rateios from "../components/Rateios";
import { atilde, ccedil } from "../constants";
import "../styles/DocumentoRateavel.css";
import { useMemo } from "react";
import { apiBaseUrl } from '../config';

export default function DocumentoRateavel({
    doctype,
    label,
    fields
}) {
    const { id } = useParams();
    const { data: docData, isLoading, error } = useFetch(`${apiBaseUrl}/${doctype}/${id}`);
    const { data: classfins, cfIsLoading, cfError} = useFetch(`${apiBaseUrl}/classificacoesfinanceiras`);
    const { data: centroscustos, ccIsLoading, ccError} = useFetch(`${apiBaseUrl}/centroscustos`);
    const { data: projetos, prIsLoading, prError} = useFetch(`${apiBaseUrl}/projetos`);
    const mainField = useMemo(
        () => fields.filter(f => f?.main)[0]?.name,
        fields
    );
    const rateios = [{
        label: `Classifica${ccedil}${atilde}o Financeira`,
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'classificacaofinanceira',
        options: classfins,
        data: docData?.rateios?.classificacoesfinanceiras,
        isLoading: cfIsLoading,
        error: cfError
    }, {
        label: 'Centro de Custo',
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'centrocusto',
        options: centroscustos,
        data: docData?.rateios?.centroscustos,
        isLoading: ccIsLoading,
        error: ccError
    }, {
        label: 'Projeto',
        codigo: 'codigo',
        descricao: 'nome',
        id: 'projeto',
        options: projetos,
        data: docData?.rateios?.projetos,
        isLoading: prIsLoading,
        error: prError
    }];
    return (
        <article className="page">
            <header className="doc-header">
                {docData && <span className="primary-data">{docData[mainField]}</span>}
                <div className="tips">
                    <ul className="inline-list">
                        <li className="tip primary-tip">{label}</li>
                        <li className="tip warning">A&ccedil;&atilde;o pendente</li>
                        <li className="tip text-warning">Adiantamento</li>
                    </ul>
                </div>
            </header>
            <main>
            { isLoading && <p>Carregando dados do {label}...</p>}
            { error && <p>Erro na requisi&ccedil;&atilde;o: <b>{error}</b></p>}
            { (!isLoading) && (!error) && <>
                <section className="doc-info">
                    <ul className="data-info inline-list">
                        {fields
                        .filter(f => !f.main)
                        .map((f, i) => (<li
                            key={i}
                            className="card-info"
                        >
                            <label className="upper-label">{f.label}</label>
                            <span className="card-data">{docData[f.name]}</span>
                        </li>))}
                    </ul>
                </section>
                <section className="rateios">
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
                                dados={r.data}
                                valorTotal={docData?.valor}
                            />}
                        </li>))}
                    </ul>
                </section>
            </> }
            </main>
        </article>
    );
}