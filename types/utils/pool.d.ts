declare namespace _default {
    export { createPool };
    export { closePool };
    export { resetPool };
}
export default _default;
export function createPool(): any;
export function closePool(targetPool?: any): Promise<void>;
export function resetPool(): void;
