import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que o Next rastreie dependencias fora de frontend/ (node_modules na raiz)
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
