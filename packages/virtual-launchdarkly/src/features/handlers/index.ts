import { DIAGNOSTIC_BASE_URI, createDiagnosticApp } from './apps/diagnostic';
import { ALL_BASE_URI, createAllApp } from './apps/all';

const handlersFeature = () => ({
  diagnosticUri: DIAGNOSTIC_BASE_URI,
  diagnosticApp() {
    return createDiagnosticApp();
  },

  allUri: ALL_BASE_URI,
  allApp() {
    return createAllApp();
  },
});

type HandlersFeature = ReturnType<typeof handlersFeature>;

export const createHandlersFeature = (): HandlersFeature => {
  return handlersFeature();
};
