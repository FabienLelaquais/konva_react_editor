import Konva from "konva";
import React from "react";
import Tool from "./Tool";
import Checkbox from "@mui/material/Checkbox";
import { Polyline } from "@mui/icons-material";
import { EditorAPI } from "./Editor";

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
    onPointerDown(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log("EditPolyTool-onPointerDown");
    }
    onPointerMove(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log("EditPolyTool-onPointerMove");
    }
    onPointerUp(ev: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI) {
        console.log("EditPolyTool-onPointerUp");
    }

    getSettings() {
        return <Checkbox title="Something" />;
    }
}
Tool.register(EditPolyTool.ID, EditPolyTool);

export default EditPolyTool;
