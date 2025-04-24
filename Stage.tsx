import Konva from "konva";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stage as KStage, Layer } from "react-konva";
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
export interface StageAPI {
    getStage(): Konva.Stage | null;
    getCurrentTool(): Tool | null;
}
interface StageProps {}

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

            const add = (layer, shape) => {
                layer.add(shape);
                shape.on(SHAPE_EVENT_TYPES.join(" "), handleShapeEvent);
            };
            const text = new Konva.Text({
                x: 10,
                y: 10,
                text: "",
                fontSize: 24,
            });
            add(layer, text);
            const triangle = new Konva.RegularPolygon({
                x: 300,
                y: 120,
                sides: 3,
                radius: 80,
                fill: "#00D2FF",
                stroke: "black",
                strokeWidth: 4,
            });
            add(layer, triangle);
            const star = new Konva.Star({
                x: stage.width() / 4,
                y: 400,
                numPoints: 5,
                innerRadius: 40,
                outerRadius: 70,
                fill: "red",
                stroke: "black",
                strokeWidth: 4,
            });
            add(layer, star);
            const part = new Konva.Path({
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
            });
            add(layer, part);
            return () => {
                container.removeEventListener("keydown", testHandleKeyDown);
                container.removeEventListener("pointerdown", testHandlePointerDown);
                container.removeEventListener("pointermove", testHandlePointerMove);
                container.removeEventListener("pointerup", testHandlePointerUp);
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
                console.log("Stage - handleKeyDown");
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
                console.log("Stage - onShapeEvent [UNHANDLED]");
                console.dir(ev);
            }
        },
        [currentTool]
    );
    const testHandleKeyDown = useCallback((ev: globalThis.KeyboardEvent) => {
        console.log("testHandleKeyDown");
        console.dir(ev);
        setToolPaletteVisible((visible) => {
            console.log(`toolPaletteVisible: ${visible}`);
            console.log("Executing setToolPaletteVisible(true)");
            ev.preventDefault();
            return ev.code == "Space" ? true : visible;
        });
    }, []);
    const testHandlePointerDown = (ev) => {
        console.log("testHandlePointerDown");
        console.dir(ev);
    };
    const testHandlePointerMove = (ev) => {
        console.log("testHandlePointerMove");
        console.dir(ev);
    };
    const testHandlePointerUp = (ev) => {
        console.log("testHandlePointerUp");
        console.dir(ev);
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
                {/* layers */}
            </KStage>
        </>
    );
};

export default Stage;
