// app/theme.ts
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

export const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Open Sans', sans-serif` },
        body: { value: `'Open Sans', sans-serif` },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
