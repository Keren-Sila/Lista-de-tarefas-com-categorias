// src/js/components/services/apiCache.js
// Capítulo 12 da Apostila: Decorator / Proxy para cache de chamadas HTTP
import buscarServicos from "./api.js";
import { LocalStorage } from "./storageStrategy.js";

const storage = LocalStorage;

async function buscarComCache(url, dados = '', forma = '') {
    const formataURL = `${url}${dados}${forma}`;
    if (storage.has(formataURL)) {
        console.time(`[CACHE] Tempo para: ${dados || 'recurso'}`);
        const resultadoEmCache = storage.get(formataURL);
        console.timeEnd(`[CACHE] Tempo para: ${dados || 'recurso'}`);
        return resultadoEmCache;
    }

    console.time(`[SERVIDOR] Tempo para: ${dados || 'recurso'}`);
    try {
        const resultadoServidor = await buscarServicos(url, dados, forma);
        storage.set(formataURL, resultadoServidor);
        console.timeEnd(`[SERVIDOR] Tempo para: ${dados || 'recurso'}`);
        return resultadoServidor;
    } catch (error) {
        console.timeEnd(`[SERVIDOR] Tempo para: ${dados || 'recurso'}`);
        console.error("Erro na busca com cache:", error);
        throw error;
    }
}

export default buscarComCache;
