/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Laravel backend base URL, e.g. http://localhost:8000 or https://api.example.com */
  readonly VITE_API_BASE_URL?: string;
  /** Default business WhatsApp number in international format, e.g. 963941996885 */
  readonly VITE_WHATSAPP_NUMBER?: string;
  /** Public frontend URL for absolute links in WhatsApp messages, e.g. https://almelazmotors.com */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
