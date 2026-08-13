// src/js/components/services/storageStrategy.js
// Padrão Strategy para armazenamentos intercambiáveis (Capítulo 12 da Apostila)

const Memoria = {
    _cache: new Map(),
    has(key) {
        return this._cache.has(key);
    },
    get(key) {
        return this._cache.get(key);
    },
    set(key, value) {
        this._cache.set(key, value);
    }
};

const LocalStorage = {
    has(key) {
        return localStorage.getItem(key) !== null;
    },
    get(key) {
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return data;
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export { Memoria, LocalStorage };
