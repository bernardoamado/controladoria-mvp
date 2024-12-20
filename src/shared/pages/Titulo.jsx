import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Rateios from "../components/Rateios";
import { atilde, ccedil } from "../utils/SpecialChars";
import "../styles/DocumentoRateavel.css";

export default function Titulo() {
    const { id } = useParams();
    const { data: titulo, isLoading, error } = useFetch(`http://localhost:3001/titulos/${id}`);
    const { data: classfins, cfIsLoading, cfError} = useFetch('http://localhost:3001/classificacoesfinanceiras');
    const { data: centroscustos, ccIsLoading, ccError} = useFetch('http://localhost:3001/centroscustos');
    const { data: projetos, prIsLoading, prError} = useFetch('http://localhost:3001/projetos');
    const rateios = [{
        label: `Classifica${ccedil}${atilde}o Financeira`,
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'classificacaofinanceira',
        options: classfins,
        data: titulo?.rateios?.classificacoesfinanceiras,
        isLoading: cfIsLoading,
        error: cfError
    }, {
        label: 'Centro de Custo',
        codigo: 'codigo',
        descricao: 'descricao',
        id: 'centrocusto',
        options: centroscustos,
        data: titulo?.rateios?.centroscustos,
        isLoading: ccIsLoading,
        error: ccError
    }, {
        label: 'Projeto',
        codigo: 'codigo',
        descricao: 'nome',
        id: 'projeto',
        options: projetos,
        data: titulo?.rateios?.projetos,
        isLoading: prIsLoading,
        error: prError
    },];
    return (
        <div className="page">
            <h2>Editar t&iacute;tulo</h2>
            { isLoading && <p>Carregando dados do t&iacute;tulo...</p>}
            { error && <p>Erro na requisi&ccedil;&atilde;o: <b>{error}</b></p>}
            { (!isLoading) && (!error) && <div><ul>
                <li>N&uacute;mero: {titulo.numero}</li>
                <li>Emiss&atilde;o: {titulo.emissao}</li>
                
            </ul>
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
                            valorTotal={titulo?.valor}
                        />}
                    </li>))}
                </ul>
            </section>
            </div> }
        </div>
    );
}