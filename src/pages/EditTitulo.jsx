import { useParams } from "react-router-dom";
import useFetch from "../js/useFetch";
import Rateio from "../components/Rateio";

export default function EditTitulo() {
    const { id } = useParams();
    const { data: titulo, isLoading, error } = useFetch(`http://localhost:3001/titulos/${id}`);
    const listClassFin = [
        {
            classificacaofinanceira: 1,
            codigo: 'CF.01',
            descricao: 'Class. Fin. 01'
        },
        {
            classificacaofinanceira: 2,
            codigo: 'CF.02',
            descricao: 'Class. Fin. 02'
        },
        {
            classificacaofinanceira: 3,
            codigo: 'CF.03',
            descricao: 'Class. Fin. 03'
        },
        {
            classificacaofinanceira: 4,
            codigo: 'CF.04',
            descricao: 'Class. Fin. 04'
        },
        {
            classificacaofinanceira: 5,
            codigo: 'CF.05',
            descricao: 'Class. Fin. 05'
        },
        {
            classificacaofinanceira: 6,
            codigo: 'CF.06',
            descricao: 'Class. Fin. 06'
        },
        {
            classificacaofinanceira: 7,
            codigo: 'CF.07',
            descricao: 'Class. Fin. 07'
        },
        {
            classificacaofinanceira: 8,
            codigo: 'CF.08',
            descricao: 'Class. Fin. 08'
        },
        {
            classificacaofinanceira: 9,
            codigo: 'CF.09',
            descricao: 'Class. Fin. 09'
        },
        {
            classificacaofinanceira: 10,
            codigo: 'CF.10',
            descricao: 'Class. Fin. 10'
        },
    ];
    return (
        <div className="page">
            <h2>Editar t&iacute;tulo</h2>
            { isLoading && <p>Carregando dados do titulo...</p>}
            { error && <p>Erro na requisicao: <b>error</b></p>}
            { (!isLoading) && (!error) && <ul>
                <li>Numero: {titulo.numero}</li>
                <li>Emissao: {titulo.emissao}</li>
                <li>
                    Class. Fin:
                    <Rateio
                        label="Classificacao Financeira"
                        campoCodigo="codigo"
                        campoDescricao="descricao"
                        campoId="classificacaofinanceira"
                        options={listClassFin}
                        dados={titulo.rateios?.classificacoesfinanceiras}
                    />
                </li>
            </ul> }
        </div>
    );
}