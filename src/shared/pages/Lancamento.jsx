import DocumentoRateavel from "./DocumentoRateavel";
import { ccedil, iacute, oacute } from "../constants";
import DateUtil from "../utils/DateUtil";
import NumberUtil from "../utils/NumberUtil";

export default function Lancamento() {
    return <DocumentoRateavel
        doctype="lancamentoscontas"
        label={`Lan${ccedil}amento`}
        fields={[
            {label: 'Documento', name: 'documento', main: true},
            {label: 'Conta', name: 'conta', print: (cnt) => `${cnt.codigo} - ${cnt.numero}`},
            {label: 'Fluxo', name: 'fluxo', print: (f) => f == 'IN' ? 'Entrada' : `Sa${iacute}da`},
            {label: 'Estabelecimento', name: 'estabelecimento', print: (e) => `${e.codigo} - ${e.descricao}`},
            {label: `Data do lan${ccedil}amento`, name: 'data', print: DateUtil.formatDateFromString},
            {label: 'Valor', name: 'valor', print: NumberUtil.formatAsCurrency},
            {label: `Hist${oacute}rico`, name: 'historico'},
        ]}
    />;
}