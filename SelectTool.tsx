import Konva from "konva";
import React from "react";

import Checkbox from "@mui/material/Checkbox";
import Tool from "./Tool";
import { HighlightAlt } from "@mui/icons-material";
import { StageAPI } from "./Stage";

interface SelectToolProps {
    layerId?: string;
    selectionColor?: string;
}

class SelectTool extends Tool {
    static readonly ID = "select";
    layerId: string = "select-layer";
    layer: Konva.Layer | null = null;
    transformer: Konva.Transformer | null = null;
    selectionRectangle: Konva.Rect | null = null;
    selectionColor: string = "rgba(0,0,255,0.3)";
    startSelX: number;
    startSelY: number;
    shapeIn: Konva.Shape | null = null;

    constructor(props?: SelectToolProps) {
        super();
        if (props?.layerId) {
            this.layerId = props?.layerId;
        }
        if (props?.selectionColor) {
            this.selectionColor = props?.selectionColor;
        }
    }

    get id(): string {
        return SelectTool.ID;
    }
    get label(): string {
        return "Select";
    }
    get icon(): React.JSX.Element {
        return <HighlightAlt />;
    }
    onActivate(api: StageAPI): void {
        console.log(`SelectTool-onActivate`);
        const stage = api.getStage();
        if (!stage) {
            return;
        }
        const layer = stage.findOne("#" + this.layerId) as Konva.Layer;
        if (!layer) {
            this.layer = new Konva.Layer();
            this.layer.id(this.layerId);
            stage.add(this.layer);
            this.transformer = new Konva.Transformer();
            this.layer.add(this.transformer);
            this.selectionRectangle = new Konva.Rect({
                fill: this.selectionColor,
                visible: false,
            });
            this.layer.add(this.selectionRectangle);
        }
        this.startSelX = 0;
        this.startSelY = 0;
        this.shapeIn = null;
        this.transformer?.nodes([]);
    }
    onClick(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI) {
        console.log("SelectTool - onClick", ev);
    }
    onPointerDown(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI) {
        console.log("SelectTool - onPointerDown", ev);
        const stage = api.getStage();
        if (!stage) {
            return;
        }
        this.startSelX = stage?.getPointerPosition()?.x || 0;
        this.startSelY = stage?.getPointerPosition()?.y || 0;
        this.selectionRectangle?.setAttrs({
            x: this.startSelX,
            y: this.startSelY,
            width: 0,
            height: 0,
            visible: true,
        });
        ev.cancelBubble = true;
        ev.evt.preventDefault();
    }
    onPointerMove(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI) {
        //console.log(`SelectTool - onPointerMove (${ev.evt.x},${ev.evt.y})`);
        const stage = api.getStage();
        if (!stage) {
            return;
        }
        if (!this.selectionRectangle?.visible()) {
            return;
        }
        const x = stage?.getPointerPosition()?.x || 0;
        const y = stage?.getPointerPosition()?.y || 0;
        this.selectionRectangle.setAttrs({
            x: Math.min(this.startSelX, x),
            y: Math.min(this.startSelY, y),
            width: Math.abs(x - this.startSelX),
            height: Math.abs(y - this.startSelY),
        });
        ev.cancelBubble = true;
    }
    onPointerUp(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI) {
        console.log("SelectTool - onPointerUp", ev);
        const stage = api.getStage();
        if (!stage) {
            return;
        }
        if (!this.selectionRectangle?.visible()) {
            return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
            this.selectionRectangle?.visible(false);
        });
        var selectionBox = this.selectionRectangle?.getClientRect();
        if (selectionBox.width < 5 || selectionBox.height < 5) {
            console.log("selectionBox small:", this.shapeIn);
            if (this.shapeIn) {
                console.log("selectedShape:", this.shapeIn);
                this.transformer?.nodes([this.shapeIn]);
                const taipyAttrs = this.shapeIn.getAttr("taipy");
                console.log("  taipyAttrs:", taipyAttrs);
                const rotationSnaps = taipyAttrs?.rotateAngles;
                this.transformer?.rotationSnaps(rotationSnaps || []);
                ev.cancelBubble = true;
            } else {
                this.transformer?.nodes([]);
            }
        } else {
            const allLayers: Konva.Layer[] = stage.find((node) => {
                return node.getType() === "Layer" && node.id() != this.layerId;
            });
            const allShapes = allLayers.flatMap((l) => l.getChildren());
            // (shape) => Konva.Util.haveIntersection(box, shape.getClientRect());
            const selectedShapes = allShapes?.filter((shape) => {
                const shapeRect = shape.getClientRect();
                return (
                    shapeRect.x >= selectionBox.x &&
                    shapeRect.y >= selectionBox.y &&
                    shapeRect.x + shapeRect.width <= selectionBox.x + selectionBox.width &&
                    shapeRect.y + shapeRect.height <= selectionBox.y + selectionBox.height
                );
            });
            console.log("selectedShapes: ", selectedShapes);
            this.transformer?.nodes(selectedShapes);
            ev.cancelBubble = true;
        }
    }
    onShapeEvent(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI): void {
        if (ev.type != "mousemove") {
            console.log("SelectTool - onShapeEvent", ev);
        }
        if (ev.type in ["click"]) {
            this.transformer?.nodes([ev.target]);
            ev.cancelBubble = true;
        } else if (ev.type == "mouseenter" && ev.target instanceof Konva.Shape) {
            this.shapeIn = ev.target;
        } else if (ev.type == "mouseleave" && ev.target instanceof Konva.Shape) {
            this.shapeIn = null;
        }
    }
    onShapeTransformer(ev: Konva.KonvaEventObject<PointerEvent>, api: StageAPI): void {
        if (ev.type != "mousemove") {
            console.log("SelectTool - onShapeEvent", ev);
        }
        if (ev.type in ["click"]) {
            this.transformer?.nodes([ev.target]);
            ev.cancelBubble = true;
        } else if (ev.type == "mouseenter" && ev.target instanceof Konva.Shape) {
            this.shapeIn = ev.target;
        } else if (ev.type == "mouseleave" && ev.target instanceof Konva.Shape) {
            this.shapeIn = null;
        }
    }
    getSettings() {
        return <Checkbox title="Snap to grid" />;
    }
}
Tool.register(SelectTool.ID, SelectTool);

export default SelectTool;
