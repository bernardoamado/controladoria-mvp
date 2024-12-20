import { useState } from "react";
import Grid from "./Grid";
import NhxUtil from "../utils/NhxUtil";
import '../styles/Rateios.css';

export default function Rateios({
    label,
    campoId,
    campoCodigo,
    campoDescricao,
    options,
    dados,
    valorTotal
}) {
    const [rateios, setRateios] = useState(dados.map((d, i) => ({
        ...d,
        _id: i
    })));
    const addRateio = () => setRateios(prev => [...rateios, {
        _id: prev.length,
        [campoId]: '',
        valor: 0
    }]);
    const removeRateio = (id) => setRateios(
        rateios
            .filter(r => r._id !== id)
            .map((r, i) => ({...r, _id: i}))
    );
    const afterEdit = (value, row, col) => {
        switch (col.id) {
            case 'percent':
                if (value)
                    row['valor'] = valorTotal * value / 100;
                break;
        }
    };
    const gridConfig = {
        autoWidth: true,
        columns: [
            {
                id: campoId,
                header: [{ text: label, align: 'center' }],
                type: 'string',
                editorType: 'combobox',
                options: options?.map(op => {
                    return {
                        id: op[campoId],
                        value: `${op[campoCodigo]} - ${op[campoDescricao]}`
                    };
                }),
                template: (cell, row, col) => {
                    const option = options?.filter(op => op[campoId] === row[campoId])[0];
                    if (option)
                        return `${option[campoCodigo]} - ${option[campoDescricao]}`;
                    else
                        return 'Selecione';
                },
                editable: true,
                minWidth: 200,
            },
            {
                id: "valor",
                header: [{ text: "Valor", align: 'center' }],
                type: "number",
                editable: true,
                numberMask: NhxUtil.currencyMask,
                minWidth: 100
            },
            {
                id: 'percent',
                header: [{ text: '%', align: 'center' }],
                type: 'number',
                template: (cell, row, col) => {
                    return new Intl.NumberFormat('default', { 
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(row.valor / valorTotal);
                },
                numberMask: NhxUtil.percentMask,
                editable: true,
            },
            {
                id: 'actions',
                header: [{ text: '' }],
                maxWidth: 40,
                align: 'center',
                template: (cell, row, col) => {
                    return '<button class="delete-apport tertiary-btn danger btn__remove">'
                        + '<i class="fa-solid fa-xmark"></i>'
                        + '</button>';
                },
                htmlEnable: true
            }
        ],
        eventHandlers: {
            onclick: {
                btn__remove: function(event, data) {
                    removeRateio(data.row._id);
                }
            }
        },
        tooltip: false,
        resizable: true,
    };

    return (
        <div className="container-apports">
            <header className="apports-action justify-right">
                <button className="tertiary-btn clickable"
                    onClick={addRateio}>Adicionar distribui&ccedil;&atilde;o</button>
            </header>
            <Grid
                config={gridConfig}
                data={rateios}
                pkey={'_id'}
                afterEdit={afterEdit}
            />
        </div>
    );
}