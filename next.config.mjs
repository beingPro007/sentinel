import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// These are needed because `__dirname` is not available in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.alias["@"] = path.resolve(__dirname, "app");
        return config;
    },
};

export default nextConfig;
