export default function deleteKVs(keys: any, { batchSize }?: {
    batchSize?: number | undefined;
}): Promise<boolean>;
