/// <reference types="vite/client" />

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
} 