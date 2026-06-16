// @ts-nocheck
export default {
  "mutate": [
    "/home/MTS/Proyectos_Personales/paginas_familia/src/app/productos/[slug]/page.tsx"
  ],
  "testRunner": "jest",
  "jest": {
    "projectType": "custom",
    "configFile": "jest.config.js",
    "enableFindRelatedTests": true
  },
  "plugins": [
    "@stryker-mutator/jest-runner"
  ],
  "reporters": [
    "clear-text"
  ],
  "coverageAnalysis": "perTest",
  "thresholds": {
    "high": 100,
    "low": 80,
    "break": 100
  },
  "warnings": {
    "unknownOptions": false
  }
};
