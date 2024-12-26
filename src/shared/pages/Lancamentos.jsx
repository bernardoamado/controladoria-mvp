import DocumentoRateavel from "./DocumentoRateavel";
import { ccedil, oacute } from "../constants";

export default function Lancamento() {
    return <DocumentoRateavel
        doctype="lancamentoscontas"
        label="Lancamento"
        fields={[
            {label: 'Documento', name: 'documento', main: true},
            {label: 'Conta', name: 'conta'},
            {label: 'Fluxo', name: 'fluxo'},
            {label: 'Estabelecimento', name: 'estabelecimento'},
            {label: `Data do lan${ccedil}amento`, name: 'data'},
            {label: 'Valor', name: 'valor'},
            {label: `Hist${oacute}rico`, name: 'historico'},
        ]}
    />;
}