import DocumentoRateavel from "./DocumentoRateavel";
import { iacute, uacute } from "../constants";

export default function Titulo() {
    return <DocumentoRateavel
        doctype="titulos"
        label={`T${iacute}tulo`}
        fields={[
            {label: `N${uacute}mero`, name: 'numero', main: true},
            {label: 'Valor', name: 'valor'},
        ]}
    />;
}