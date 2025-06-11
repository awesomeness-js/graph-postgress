export default pool;
declare let pool: any;
export function createPool(): any;
export function closePool(): Promise<void>;
export function resetPool(): void;
