import Konva from "konva";
import React from "react";
import Tool from "./Tool";
import Checkbox from "@mui/material/Checkbox";
import { Polyline } from "@mui/icons-material";
import { StageAPI } from "./Stage";

export class EditPolyTool extends Tool {
    static readonly ID = "editPoly";

    get id(): string {
        return EditPolyTool.ID;
    }
    get label(): string {
        return "Edit shape";
    }
    get icon(): React.JSX.Element {
        return <Polyline />;
    }
    onPointerDown(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI) {
        console.log("EditPolyTool-onPointerDown", ev);
    }
    onPointerMove(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI) {
        //console.log("EditPolyTool-onPointerMove", ev);
    }
    onPointerUp(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI) {
        console.log("EditPolyTool-onPointerUp", ev);
    }

    getSettings() {
        return <Checkbox title="Something" />;
    }
}
Tool.register(EditPolyTool.ID, EditPolyTool);

export default EditPolyTool;
