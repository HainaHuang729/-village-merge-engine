export interface EnginePlugin {
  id: string;
  install(): void;
  uninstall?(): void;
}
