export default function Apport({
    label
}) {
    const virtualApports = [];
    const options = [];
    const addVirtualApport = (tp) => {};
    const removeVirtualApport = (index) => {};

    const handleSelectChange = (index, event) => {};
    const calculatePercent = (index) => {};
    const calculateValue = (index) => {};
    const getTotalValue = () => {};
    const getTotalPercent = () => {};

    return (
        <div className="apports-container">    
            <header className="apports-action justify-right">
                <button
                    className="tertiary-btn clickable"
                    onClick={addVirtualApport('CF')}
                >
                    Adicionar distribui&ccedil;&atilde;o
                </button>
            </header>
            <table className="apports-table" v-if="virtualApports">
                <thead>
                    <th><label>{label}</label></th>
                    <th>Valor</th>
                    <th>%</th>
                    <th></th>
                </thead>
                <tbody>{virtualApports.map((ap, i) => (
                    <tr  key={i}>
                        <td className="select-data">
                            <select onChange={(e) => handleSelectChange(i, e)}>
                                <option disabled value="">Escolha</option>
                                {options.map(op => <option
                                    key={op.id}
                                    value={op.id}
                                >
                                    { op.codigo } - { op.descricao }
                                </option>)}
                            </select>
                        </td>
                        <td className="numeric-value">
                            <input type="number" step="0.01"
                                onChange={calculatePercent(i)}
                                value={ap.valor} />
                        </td>
                        <td className="percent-value">
                            <input type="number" step="0.01" size="5" max="999.99" min="-999.99"
                                onChange={calculateValue(i)}
                                value={ap.percentual} />
                        </td>
                        <td>
                            <button
                                className="delete-apport tertiary-btn danger"
                                onClick={removeVirtualApport(i)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </td>
                    </tr>
                ))}</tbody>
                <tfoot>
                    <td className="text-value">Total</td>
                    <td className="numeric-value">{ getTotalValue() }</td>
                    <td className="percent-value">{ getTotalPercent() }</td>
                    <td></td>
                </tfoot>
            </table>                   
        </div>
    );
}