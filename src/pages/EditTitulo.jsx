import { useParams } from "react-router-dom";
import useFetch from "../js/useFetch";

export default function EditTitulo() {
    const { id } = useParams();
    const { data: titulo, isLoading, error } = useFetch(`http://localhost:3001/titulos/${id}`);
    return (
        <div className="page">
            <h2>Editar t&iacute;tulo</h2>
            { isLoading && <p>Carregando dados do titulo...</p>}
            { error && <p>Erro na requisicao: <b>error</b></p>}
            { (!isLoading) && (!error) && <ul>
                <li>Numero: {titulo.numero}</li>
                <li>Emissao: {titulo.emissao}</li>
            </ul> }
        </div>
    );
}