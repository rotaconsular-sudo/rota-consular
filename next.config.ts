import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Extratos bancários e comprovantes em PDF/foto passam fácil do limite
      // padrão de 1MB.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
