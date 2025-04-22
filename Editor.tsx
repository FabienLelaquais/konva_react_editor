import Konva from "konva";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import ToolPalette from "./ToolPalette";
import Tool from "./Tool";
// Register used tools
import "./SelectTool";
import "./EditPolyTool";

export interface EditorAPI {
    getStage(): Konva.Stage | null;
    getCurrentTool(): Tool | null;
}
interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const [toolPaletteVisible, setToolPaletteVisible] = useState(true);
    const [currentTool, setCurrentTool] = useState<Tool | null>(null);

    const editorAPI: EditorAPI = {
        getStage: () => stageRef.current,
        getCurrentTool: () => currentTool,
    };

    // TODO
    const editorAPI_unused = useMemo(
        (): EditorAPI => ({
            getStage: () => stageRef.current,
            getCurrentTool: () => currentTool,
        }),
        [
            /*currentTool*/
        ]
    );

    const handleToolSelect = (tool: Tool) => {
        if (tool != currentTool) {
            if (currentTool) {
                currentTool.onDeactivate(editorAPI);
            }
            console.log(`Editor.handleToolSelect(${tool.label})`);
            setCurrentTool(tool);
            if (tool) {
                tool.onActivate(editorAPI);
            }
        }
    };

    const handleClick = useCallback(
        (e) => {
            currentTool?.onClick(e, editorAPI);
        },
        [currentTool]
    );
    const handlePointerDown = useCallback((e) => currentTool?.onPointerDown(e, editorAPI), [currentTool]);
    const handlePointerMove = useCallback((e) => currentTool?.onPointerMove(e, editorAPI), [currentTool]);
    const handlePointerUp = useCallback((e) => currentTool?.onPointerUp(e, editorAPI), [currentTool]);
    const handleKeyDown = (e) => {
        console.log("Editor - handleKeyDown");
        console.dir(e);
    };

    useEffect(() => {
        if (stageRef.current) {
            const container = stageRef.current.container();
            container.tabIndex = 1;
            container.focus();
            container.style.backgroundColor = "lightblue";
        }
    }, []);

    return (
        <>
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onKeyDown={handleKeyDown}
                draggable={false}
            >
                {/* layers */}
                <Layer draggable={false} />
            </Stage>
            {toolPaletteVisible && (
                <ToolPalette
                    tools={Tool.tools()}
                    onSelectTool={handleToolSelect}
                    onClose={() => {
                        setToolPaletteVisible(false);
                        if (stageRef.current) {
                            const container = stageRef.current.container();
                            container.tabIndex = 1;
                            container.focus();
                        }
                    }}
                />
            )}
        </>
    );
};

export default Editor;
