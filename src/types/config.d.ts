declare interface DefaultProjectSettings {
    private: boolean;
    type: string;
    language: string;
    license: string;
}

declare interface Configuration {
    directory: string;
    defaultProjectSettings: DefaultProjectSettings;
}
