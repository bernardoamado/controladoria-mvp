import { useEffect, useRef, useState } from "react";
import { Grid as DhxGrid } from "@dhx/trial-suite";
import './Grid.css';
import { ObjectUtil } from "../js/utils";

export default function Grid({
    config,
    gridData,
    pkey,
    dblClick
}) {
    const [grid, setGrid] = useState(null);
    const gNode = useRef(null);
    const pk = (obj) => (pkey) ? obj[pkey] : obj[Object.keys(obj)[0]];

    useEffect(() => {
        const newGrid = new DhxGrid(gNode.current, config);
        setGrid(newGrid);

        // Cleanup
        return () => { newGrid?.destructor(); };
    }, []);

    useEffect(() => {
        grid?.data.parse(ObjectUtil.copy(gridData));
        if (dblClick) {
            grid?.events.detach('cellDblClick');
            grid?.events.on('cellDblClick', (row, column, event) => {
                dblClick(gridData.filter(d => pk(d) === pk(row))[0]);
            });
        }
    }, [gridData])

    return <div className="nhids-grid-container" ref={gNode}></div>;
}