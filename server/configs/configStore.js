class ConfigStore {
    constructor() {
        this.config = {};
        this._isConfigured = false;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this._isConfigured = true;
    }

    getConfig() {
        return this.config;
    }

    isConfigured() {
        return this._isConfigured;
    }
}

export const configStore = new ConfigStore();
