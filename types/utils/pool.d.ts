declare namespace _default {
    export { createPool };
    export { closePool };
    export { resetPool };
}
export default _default;
export function createPool(): any;
export function closePool(): Promise<void>;
export function resetPool(): void;
