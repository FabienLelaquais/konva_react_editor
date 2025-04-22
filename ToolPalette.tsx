import React, { useEffect, useState } from "react";
import { Paper, Tooltip, IconButton, Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import Tool from "./Tool";

interface ToolPaletteProps {
    tools: Record<string, Tool>;
    onSelectTool: (tool: Tool) => void;
    onClose: () => void;
}

const ToolPalette: React.FC<ToolPaletteProps> = ({ tools, onSelectTool, onClose }) => {
    const [selectedToolId, setSelectedToolId] = useState("");
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log("ToolPalette - handleKey");
            console.dir(e);
            if (e.key === "Escape" && !e.repeat) {
                e.preventDefault();
                closePalette();
            }
        };
        const handlePointerDown = (e: PointerEvent) => {
            console.log("ToolPalette - handlePointerDown");
            console.dir(e);
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("pointerdown", handlePointerDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    const closePalette = () => {
        console.log("closePalette");
        onClose();
    };
    const selectTool = (id: string): void => {
        setSelectedToolId(id);
        onSelectTool(tools[id]);
    };

    return (
        <Draggable handle=".handle">
            <Paper
                component="div"
                elevation={2}
                sx={{
                    position: "fixed",
                    top: 50,
                    left: 50,
                    zIndex: 1000,
                    padding: 2,
                    borderRadius: 2,
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    pointerEvents: "auto",
                }}
            >
                {/* Title Bar */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ height: 24, px: 1, mb: 1 }}
                >
                    <Box className="handle">
                        <Typography variant="caption" noWrap sx={{ fontWeight: 500, lineHeight: 1.0 }}>
                            Tools
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={closePalette}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <ToggleButtonGroup exclusive value={selectedToolId} onChange={(_, id) => selectTool(id)}>
                    <Tooltip title={tools["select"].label} key={"select"}>
                        <ToggleButton value={"select"}>{tools["select"].icon}</ToggleButton>
                    </Tooltip>
                    <Tooltip title={tools["editPoly"].label} key={"editPoly"}>
                        <ToggleButton value={"editPoly"}>{tools["editPoly"].icon}</ToggleButton>
                    </Tooltip>
                    {/**/}
                </ToggleButtonGroup>

                {/*<ToggleButtonGroup exclusive value={selectedToolId} onChange={(_, id) => selectTool(id)}>
                    {Object.entries(tools).map(([id, tool]) => {
                        <Tooltip title={tool.label} key={tool.id}>
                            <ToggleButton value={tool.id}>{tool.icon}</ToggleButton>
                        </Tooltip>
                    })}
                    </ToggleButtonGroup>
                    */}
            </Paper>
        </Draggable>
    );
};

export default ToolPalette;
