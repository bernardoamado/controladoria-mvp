import { useEffect, useMemo, useState } from "react";
import Grid from "./Grid";
import NhxUtil from "../utils/NhxUtil";
import '../styles/Rateios.css';
import NumberUtil from "../utils/NumberUtil";

export default function Rateios({
    label,
    campoId,
    campoCodigo,
    campoDescricao,
    options,
    dados,
    valorTotal,
}) {
    const mapId = (arr) => (arr || [{
        [campoId]: '',
        valor: 0
    }]).map((d, i) => ({...d, _id: i}));

    const [rateios, setRateios] = useState(mapId(dados));
    const [gridConfig, setGridConfig] = useState(null);
    const addRateio = () => setRateios(prev => [
        ...prev,
        {
            _id: prev.length,
            [campoId]: '',
            valor: 0
        }
    ]);
    const removeRateio = (id) => setRateios(
        prev => mapId(prev.filter(r => r._id !== id))
    );

    const afterEdit = (value, row, col) => {
        console.log('afterEdit', 'value', value, 'row', row, 'col', col);
        switch (col.id) {
            case 'percent':
                if (value)
                    row['valor'] = valorTotal * value / 100;
                break;
        }
    };
    const selectTemplate = (cell, row, col) => {
        const option = options?.filter(op => op[campoId] === row[campoId])[0];
        const buttons = [
            '<button class="combo-btn transparent-btn"><i class="fa-solid fa-caret-down"></i></button>',
            //'<button class="combo-btn"><i class="fa-solid fa-tree"></i></button>',
        ];
        const txt = (option)
            ? `${option[campoCodigo]} - ${option[campoDescricao]}`
            : 'Selecione';
        return '<div class="combo-content"><ul class="inline-list"><li>'
            + [txt, ...buttons].join('</li><li>')
            + '</li></ul></div>';
    };
    const multiRateioConfig = useMemo(() => ({
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
                template: selectTemplate,
                tooltipTemplate: (value, row, col) => value,
                htmlEnable: true,
                editable: true,
                minWidth: 200,
                tooltip: true,
                mark: () => 'clickable combo'
            },
            {
                id: "valor",
                header: [{ text: "Valor", align: 'center' }],
                type: "number",
                editable: true,
                numberMask: NhxUtil.currencyMask,
                minWidth: 100,
                mark: () => 'clickable'
            },
            {
                id: 'percent',
                header: [{ text: '%', align: 'center' }],
                type: 'number',
                template: (cell, row, col) => NumberUtil.formatAsPercent(row.valor / valorTotal),
                numberMask: NhxUtil.percentMask,
                editable: true,
                mark: () => 'clickable'
            },
            {
                id: 'actions',
                header: [{ text: '' }],
                maxWidth: 40,
                align: 'center',
                template: (cell, row, col) => ''
                    + '<button class="delete-apport tertiary-btn danger btn__remove">'
                    +   '<i class="fa-solid fa-xmark"></i>'
                    + '</button>',
                htmlEnable: true
            }
        ],
        eventHandlers: {
            onclick: {
                btn__remove: (event, data) => removeRateio(data.row._id)
            }
        },
        tooltip: false,
        resizable: true,
    }), [options?.length]);
    const singleRateioConfig = useMemo(() => ({
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
                template: selectTemplate,
                tooltipTemplate: (value, row, col) => value,
                tooltip: true,
                htmlEnable: true,
                editable: true,
                minWidth: 200,
                mark: () => 'clickable'
            }
        ],
        tooltip: false,
        resizable: true,
    }), [options?.length]);

    useEffect(() => {
        if (options)
            setGridConfig(
                ((rateios?.length || 0) > 1) ? multiRateioConfig: singleRateioConfig
            );
    }, [rateios?.length, options]);

    return (
        <div className={`container-apports ${((rateios || []).length > 1) ? 'multi' : 'single'}`}>
            <header className="apports-action justify-right">
                <button className="tertiary-btn clickable"
                    onClick={addRateio}>Adicionar distribui&ccedil;&atilde;o</button>
            </header>
            <Grid
                config={gridConfig}
                data={rateios}
                afterEdit={afterEdit}
            />
        </div>
    );
}