import Konva from "konva";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stage as KStage, Layer, Line, Rect, Text, Circle, Path, RegularPolygon, Star, Transformer } from "react-konva";
import ToolPalette from "./ToolPalette";
import Tool from "./Tool";
// Register used tools
import "./SelectTool";
import "./EditPolyTool";
import { svgIconClasses } from "@mui/material";

const SHAPE_EVENT_TYPES = [
    "mouseover",
    "mousemove",
    "mouseout",
    "mouseenter",
    "mouseleave",
    "mousedown",
    "mouseup",
    "wheel",
    "contextmenu",
    "click",
    "dblclick",
    "touchstart",
    "touchmove",
    "touchend",
    "tap",
    "dbltap",
    "dragstart",
    "dragmove",
    "dragend",
];
const TRANSFORM_EVENT_TYPES = ["transformstart", "transform", "transformend"];

export interface StageAPI {
    getStage(): Konva.Stage | null;
    getCurrentTool(): Tool | null;
}
interface StageProps {}

const KnownShapeTypes: Set<string> = new Set([
    "Circle",
    "Layer",
    "Line",
    "Rect",
    "Text",
    "Path",
    "RegularPolygon",
    "Star",
]);

const DefaultShapes = [
    {
        konvaType: "Text",
        x: 10,
        y: 10,
        text: "",
        fontSize: 24,
    },
    {
        konvaType: "RegularPolygon",
        x: 300,
        y: 120,
        sides: 3,
        radius: 80,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
    },
    {
        konvaType: "Star",
        x: 200,
        y: 400,
        numPoints: 5,
        innerRadius: 40,
        outerRadius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        taipy: {
            rotateAngles: [0, 45, 90, 135, 180],
        },
    },
    {
        konvaType: "Path",
        x: 50,
        y: 50,
        scale: {
            x: 200,
            y: 200,
        },
        data: "M1.516,0.86A0.068,0.068 0,0,1 1.584,0.928A0.068,0.068 0,0,1 1.516,0.996A0.068,0.068 0,0,1 1.448,0.928A0.068,0.068 0,0,1 1.516,0.86M0.28,0.86L0.472,0.86A0.068,0.068 0,0,1 0.54,0.928A0.068,0.068 0,0,1 0.472,0.996L0.28,0.996A0.068,0.068 0,0,1 0.212,0.928A0.068,0.068 0,0,1 0.28,0.86M0.384,0.0L0.384,0.303L0.0,0.303L0.0,0.4695L0.05,0.482L0.0,0.4945L0.0,1.116A0.187,0.187 0,0,0 0.187,1.303L1.625,1.303A0.187,0.187 0,0,0 1.812,1.116L1.812,0.92L1.762,0.9075L1.812,0.895L1.812,0.741L1.301,0.741L1.239,0.803L1.239,0.96A0.125,0.125 0,0,1 1.114,1.085L0.698,1.085A0.125,0.125 0,0,1 0.573,0.96L0.573,0.0L0.384,0.0Z",
        fill: "lightgreen",
        stroke: "black",
        strokeWidth: 0.01,
    },
];

const InnerShape = (props: {
    shapeType: string;
    //children: Array<Record<string, any>>;
    shapeProps: Record<string, any>;
    eventHandler: (ev: Konva.KonvaEventObject<any>) => void;
    transformerHandler: (ev: Konva.KonvaEventObject<any>) => void;
}) => {
    const shapeRef = React.useRef<Konva.Node>(null);

    useEffect(() => {
        shapeRef.current?.on(SHAPE_EVENT_TYPES.join(" "), props.eventHandler);
    }, [props.eventHandler]);
    useEffect(() => {
        shapeRef.current?.on(TRANSFORM_EVENT_TYPES.join(" "), props.transformerHandler);
    }, [props.transformerHandler]);

    if (KnownShapeTypes.has(props.shapeType)) {
        return (
            <>
                {/* @ts-ignore */}
                <props.shapeType {...props.shapeProps} ref={shapeRef}></props.shapeType>
            </>
        );
    } else {
        return null;
    }
};

const Stage: React.FC<StageProps> = (_: StageProps) => {
    const stageRef = useRef<Konva.Stage>(null);
    const [toolPaletteVisible, setToolPaletteVisible] = useState(true);
    const [currentTool, setCurrentTool] = useState<Tool | null>(null);

    const stageAPI = useMemo(
        (): StageAPI => ({
            getStage: () => stageRef.current,
            getCurrentTool: () => currentTool,
        }),
        [currentTool]
    );

    useEffect(() => {
        if (stageRef.current) {
            const stage = stageRef.current;
            const container = stage.container();
            container.tabIndex = -1;
            container.focus();
            container.style.backgroundColor = "lightblue";
            container.addEventListener("keydown", testHandleKeyDown);
            container.addEventListener("pointerdown", testHandlePointerDown);
            container.addEventListener("pointermove", testHandlePointerMove);
            container.addEventListener("pointerup", testHandlePointerUp);

            const layer = new Konva.Layer();
            stage.add(layer);

            const UNUSEDadd = (layer, shape) => {
                layer.add(shape);
                shape.on(SHAPE_EVENT_TYPES.join(" "), handleShapeEvent);
            };
        }
    }, []);

    const handleToolSelect = useCallback(
        (tool: Tool) => {
            if (tool != currentTool) {
                if (currentTool) {
                    currentTool.onDeactivate(stageAPI);
                }
                setCurrentTool(tool);
                if (tool) {
                    tool.onActivate(stageAPI);
                }
            }
        },
        [currentTool]
    );

    const handleClick = useCallback(
        (e) => {
            if (currentTool) {
                currentTool?.onClick(e, stageAPI);
            } else {
                console.log("Stage - handleClick");
            }
        },
        [currentTool]
    );
    const handlePointerDown = useCallback((e) => currentTool?.onPointerDown(e, stageAPI), [currentTool]);
    const handlePointerMove = useCallback((e) => currentTool?.onPointerMove(e, stageAPI), [currentTool]);
    const handlePointerUp = useCallback((e) => currentTool?.onPointerUp(e, stageAPI), [currentTool]);
    const handleKeyDown = (ev) => {
        console.log("Stage - handleKeyDown");
        console.dir(ev);
    };
    const handleShapeEvent = useCallback(
        (ev: Konva.KonvaEventObject<any>) => {
            if (currentTool) {
                currentTool.onShapeEvent(ev, stageAPI);
            } else {
                if (ev.type != "mousemove") {
                    console.log("Stage - onShapeEvent [UNHANDLED]", ev);
                }
            }
        },
        [currentTool]
    );
    const handleTransformerEvent = useCallback((ev) => {
        console.log("Stage - handleTransformerEvent", ev);
        const shape = ev.target;
        const taipyAttrs = shape.getAttr("taipy");
        const rotationSnaps = taipyAttrs?.rotateAngles;
        if (rotationSnaps) {
            const currentRotation = shape.rotation();
            let closest = rotationSnaps[0];
            let minDiff = Math.abs(currentRotation - closest);
            for (let a of rotationSnaps) {
                const diff = Math.abs(currentRotation - a);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = a;
                }
            }
            shape.rotation(closest);
        }
    }, []);

    const testHandleKeyDown = useCallback((ev: globalThis.KeyboardEvent) => {
        console.log("testHandleKeyDown", ev);
        setToolPaletteVisible((visible) => {
            console.log(`toolPaletteVisible: ${visible}`);
            console.log("Executing setToolPaletteVisible(true)");
            ev.preventDefault();
            return ev.code == "Space" ? true : visible;
        });
    }, []);
    const testHandlePointerDown = (ev) => {
        console.log("testHandlePointerDown", ev);
    };
    const testHandlePointerMove = (ev) => {
        //console.log("testHandlePointerMove", ev);
    };
    const testHandlePointerUp = (ev) => {
        console.log("testHandlePointerUp", ev);
    };
    return (
        <>
            {toolPaletteVisible ? (
                <ToolPalette
                    tools={Tool.tools()}
                    onSelectTool={handleToolSelect}
                    onClose={() => {
                        console.log("Executing setToolPaletteVisible(false)");
                        setToolPaletteVisible(false);
                        if (stageRef.current) {
                            const container = stageRef.current.container();
                            container.tabIndex = -1;
                            container.focus();
                        }
                    }}
                />
            ) : null}
            <KStage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onMouseMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onKeyDown={handleKeyDown}
                draggable={false}
            >
                <Layer>
                    {DefaultShapes.map((shapeDesc) => {
                        const { konvaType, ...shapeProps } = shapeDesc;
                        return (
                            <InnerShape
                                shapeType={konvaType}
                                shapeProps={shapeProps}
                                eventHandler={handleShapeEvent}
                                transformerHandler={handleTransformerEvent}
                            />
                        );
                    })}
                </Layer>
                {/* layers */}
            </KStage>
        </>
    );
};

export default Stage;
