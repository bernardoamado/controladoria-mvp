import { useEffect, useRef, useState } from "react";
import { Grid as DhxGrid } from "@dhx/trial-suite";
import ObjectUtil from "../utils/ObjectUtil";
import '../styles/Grid.css';

export default function Grid({
    config,
    data: gridData,
    pkey,
    dblClick,
    afterEdit
}) {
    const [grid, setGrid] = useState(null);
    const gNode = useRef(null);
    const pk = (obj) => (pkey) ? obj[pkey] : obj[Object.keys(obj)[0]];

    useEffect(() => {
        const newGrid = new DhxGrid(gNode.current, config);
        if (afterEdit)
            newGrid.events.on('afterEditEnd', (...args) => {
                afterEdit(...args);
                console.log('grid data', newGrid.data);
            });
        setGrid(newGrid);

        // Cleanup
        return () => { newGrid?.destructor(); };
    }, [config]);

    useEffect(() => {
        grid?.data.parse(ObjectUtil.copy(gridData));
        if (dblClick) {
            grid?.events.detach('cellDblClick');
            grid?.events.on('cellDblClick', (row, column, event) => {
                dblClick(gridData.filter(d => pk(d) === pk(row))[0]);
            });
        }
    }, [gridData, grid])

    return <div className="nhids-grid-container" ref={gNode}></div>;
}