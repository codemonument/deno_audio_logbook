
import { kvsMemoryStorage } from "@kvs/memorystorage";

/**
 * A in-memory key-value storage for deno to cache postcss-transformed css files 
 * Needed, bc. these files can't be written to /static, bc. deno deploy does not support writing files to it's file system 
 * (it's read-only from the github repo)
 */

export const cssCache = await kvsMemoryStorage({
    name: "css-cache",
    version: 1
});

