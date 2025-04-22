import Konva from "konva";
import React from "react";

import Checkbox from "@mui/material/Checkbox";
import Tool from "./Tool";
import { HighlightAlt } from "@mui/icons-material";
import { EditorAPI } from "./Editor";

class SelectTool extends Tool {
    static readonly ID = "select";

    get id(): string {
        return SelectTool.ID;
    }
    get label(): string {
        return "Select";
    }
    get icon(): React.JSX.Element {
        return <HighlightAlt />;
    }

    onClick(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log(`SelectTool - onClick (${ev.evt.x},${ev.evt.y})`);
    }
    onPointerDown(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log(`SelectTool - onPointerDown (${ev.evt.x},${ev.evt.y})`);
        ev.cancelBubble = true;
        ev.evt.preventDefault();
    }
    onPointerMove(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log(`SelectTool - onPointerMove (${ev.evt.x},${ev.evt.y})`);
        ev.cancelBubble = true;
    }
    onPointerUp(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log(`SelectTool - onPointerUp (${ev.evt.x},${ev.evt.y})`);
        ev.cancelBubble = true;
    }

    getSettings() {
        return <Checkbox title="Snap to grid" />;
    }
}
Tool.register(SelectTool.ID, SelectTool);

export default SelectTool;
