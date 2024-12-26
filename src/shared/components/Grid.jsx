import { useEffect, useRef, useState } from "react";
import { Grid as DhxGrid } from "@dhx/trial-suite";
import ObjectUtil from "../utils/ObjectUtil";
import '../styles/Grid.css';

export default function Grid({
    config,
    data: gridData,
    dblClick,
    click,
    afterEdit
}) {
    const [grid, setGrid] = useState(null);
    const gNode = useRef(null);

    useEffect(() => {
        const newGrid = new DhxGrid(gNode.current, config);
        
        const editableCols = newGrid.config.columns
            .filter(col => col.editable)
            .map(col => col.id);
        if (editableCols && (editableCols.length))
            newGrid.events.on('cellClick', (row, col, event) => {
                if (editableCols.includes(col.id))
                    newGrid.editCell(row.id, col.id);
            });

        if (afterEdit)
            newGrid.events.on('afterEditEnd', afterEdit);
        if (click)
            newGrid.events.on('cellClick', click);
        if (dblClick)
            newGrid.events.on('cellDblClick', dblClick);
        setGrid(newGrid);

        // Cleanup
        return () => { newGrid?.destructor(); };
    }, [config]);

    useEffect(() => {
        if (gridData && grid)
            grid.data.parse(ObjectUtil.copy(gridData));
    }, [gridData, grid]);

    return <div className="nhids-grid-container" ref={gNode}></div>;
}