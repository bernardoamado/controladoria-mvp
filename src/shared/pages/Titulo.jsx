import DocumentoRateavel from "./DocumentoRateavel";
import { atilde, ecirc, iacute, uacute } from "../constants";
import DateUtil from "../utils/DateUtil";
import NumberUtil from "../utils/NumberUtil";

export default function Titulo() {
    return <DocumentoRateavel
        doctype="titulos"
        label={`T${iacute}tulo`}
        fields={[
            {label: `N${uacute}mero`, name: 'numero', main: true},
            {label: 'Fluxo', name: 'fluxo', print: (f) => f == 'IN' ? 'Entrada' : `Sa${iacute}da`},
            {label: `Data de emiss${atilde}o`, name: 'emissao', print: DateUtil.formatDateFromString},
            {label: `Data de vencimento`, name: 'vencimento', print: DateUtil.formatDateFromString},
            {label: `Data de compet${ecirc}ncia`, name: 'competencia', print: DateUtil.formatDateFromString},
            {label: 'Valor', name: 'valor', print: NumberUtil.formatAsCurrency},
            {label: 'Estabelecimento', name: 'estabelecimento', print: (e) => `${e.codigo} - ${e.descricao}`},
        ]}
    />;
}