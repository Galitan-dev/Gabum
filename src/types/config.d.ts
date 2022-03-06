export interface DefaultProjectSettings {
  private: boolean;
  type: string;
  language: string;
  license: string;
}

export interface Configuration {
  directory: string;
  defaultProjectSettings: DefaultProjectSettings;
}
