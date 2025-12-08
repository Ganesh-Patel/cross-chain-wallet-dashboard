/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_ETH_API_KEY?: string;
  readonly VITE_ALCHEMY_POLYGON_API_KEY?: string;
  readonly VITE_ALCHEMY_ARBITRUM_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

