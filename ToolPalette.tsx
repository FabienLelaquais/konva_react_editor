import React, { useCallback, useEffect, useState } from "react";
import { Paper, Tooltip, IconButton, Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import Tool from "./Tool";

interface ToolPaletteProps {
    tools: Record<string, Tool>;
    onSelectTool: (tool: Tool) => void;
    onClose: () => void;
}

const captionSx = { fontWeight: 500, lineHeight: 1.0 };

const ToolPalette: React.FC<ToolPaletteProps> = ({ tools, onSelectTool, onClose }) => {
    const POSITION_STORAGE = "toolPalettePos";
    const [selectedToolId, setSelectedToolId] = useState("");
    const [position, setPosition] = useState(() => {
        const stored = localStorage.getItem(POSITION_STORAGE);
        return stored ? JSON.parse(stored) : { x: 50, y: 50 };
    });

    useEffect(() => {
        const stored = localStorage.getItem(POSITION_STORAGE);
        if (stored) {
            setPosition(JSON.parse(stored));
        }
        const handleKeyDown = (ev: KeyboardEvent) => {
            console.log("ToolPalette - handleKey", ev);
            if (ev.key === "Escape" && !ev.repeat) {
                ev.preventDefault();
                closePalette();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(POSITION_STORAGE, JSON.stringify(position));
    }, [position]);

    const closePalette = useCallback(() => {
        console.log("closePalette");
        onClose();
    }, [onClose]);

    const selectTool = useCallback(
        (_, id: string): void => {
            setSelectedToolId(id);
            onSelectTool(tools[id]);
        },
        [onSelectTool]
    );

    const handleDragStop = useCallback((_, payload) => {
        setPosition({ x: payload.x, y: payload.y });
    }, []);

    return (
        <Draggable handle=".handle" defaultPosition={position} onStop={handleDragStop}>
            <Paper
                component="div"
                elevation={2}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
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
                        <Typography variant="caption" noWrap sx={captionSx}>
                            Tools
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={closePalette}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <ToggleButtonGroup exclusive value={selectedToolId} onChange={selectTool}>
                    {Object.entries(tools).map(([id, tool]) => (
                        <Tooltip title={tool.label} key={id}>
                            <ToggleButton value={id}>{tool.icon}</ToggleButton>
                        </Tooltip>
                    ))}
                </ToggleButtonGroup>
            </Paper>
        </Draggable>
    );
};

export default ToolPalette;
