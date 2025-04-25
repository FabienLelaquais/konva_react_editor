import Konva from "konva";
import { StageAPI } from "./Stage";

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
    onActivate(_: StageAPI): void {
        console.log(`onActivate: ${this.label}`);
    }
    onDeactivate(_: StageAPI): void {
        console.log(`onDeactivate: ${this.label}`);
    }

    // Event handlers
    onClick(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI): void {
        console.log("Tool - onClick", ev);
    }
    onPointerDown(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI): void {
        console.log("Tool - onPointerDown", ev);
    }
    onPointerMove(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI): void {
        //console.log("Tool - onPointerMove", ev);
    }
    onPointerUp(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI): void {
        console.log("Tool - onPointerUp", ev);
    }
    onShapeEvent(ev: Konva.KonvaEventObject<PointerEvent>, ed: StageAPI): void {
        console.log("Tool - onShapeEvent", ev);
    }

    // Optional: for tools with settings
    getSettings(): React.ReactNode {
        return null;
    }
}

export default Tool;
