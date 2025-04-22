import Konva from "konva";
import { EditorAPI } from "./Editor";

class Tool {
    private static registry: Record<string, Tool> = {};
    static tools(): Record<string, Tool> {
        return Tool.registry;
    }
    static register(id: string, ctor: { new (): Tool }) {
        Tool.registry[id] = new ctor!();
    }
    static get(id: string): Tool {
        if (id in Tool.registry) {
            return Tool.registry[id];
        }
        throw new Error(`Tool id "${id}" not registered.`);
    }

    get id(): string {
        return "";
    }
    get label(): string {
        return "";
    }
    get icon(): React.ReactNode {
        return null;
    }

    // Lifecycle
    onActivate(_: EditorAPI): void {
        console.log(`Selected tool : ${this.label}`);
    }
    onDeactivate(_: EditorAPI): void {
        console.log(`Deselected tool : ${this.label}`);
    }

    // Event handlers
    onClick(e: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI): void {
        console.log("Tool - onClick");
    }
    onPointerDown(e: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI): void {
        console.log("Tool - onPointerDown");
    }
    onPointerMove(e: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI): void {
        console.log("Tool - onPointerMove");
    }
    onPointerUp(e: Konva.KonvaEventObject<PointerEvent>, ed: EditorAPI): void {
        console.log("Tool - onPointerUp");
    }

    // Optional: for tools with settings
    getSettings(): React.ReactNode {
        return null;
    }
}

export default Tool;
