import Grid from "./Grid";
import { NhxUtil } from "../js/utils";

export default function Rateio({
    label,
    campoId,
    campoCodigo,
    campoDescricao,
    options,
    dados
}) {
    const gridConfig = {
        autoWidth: true,
        columns: [
            {
                id: campoId,
                header: [{ text: label }],
                type: 'string',
                editorType: 'combobox',
                options: options.map(op => {
                    return {
                        id: op[campoId],
                        value: `${op[campoCodigo]} - ${op[campoDescricao]}`
                    };
                }),
                template: (cell, row, col) => {
                    console.log('cell: ', cell);
                    console.log('row', row);
                    console.log('column', col);
                    const myp = options.filter(op => op[campoId] == row[campoId])[0];
                    //return 'nada';
                    if (myp)
                        return `${myp[campoCodigo]} - ${myp[campoDescricao]}`;
                },
                editable: true,
            },
            {
                id: "valor",
                header: [{ text: "Valor" }],
                type: "number",
                editable: true,
                numberMask: NhxUtil.currencyMask
            },
            {
                id: 'percent',
                header: [{ text: '%' }],
                type: 'number',
                editable: true
            },
            {
                id: 'actions',
                header: [{ text: '' }]
            }
        ],
        tooltip: false,
        //selection: "row",
        resizable: true,
    };
    return <Grid
        config={gridConfig}
        data={dados}
        pkey={campoId}
    />;
}