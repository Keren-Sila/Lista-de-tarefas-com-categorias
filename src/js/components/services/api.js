// src/js/components/services/api.js
// Capítulo 11 e 12 da Apostila: Camada de serviços para requisições HTTP via fetch
async function buscarServicos(url, dados = '', forma = '') {
    try {
        const formataURL = `${url}${dados}${forma}`;
        const response = await fetch(formataURL);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Erro na requisição API:", error);
        throw error;
    }
}

export default buscarServicos;
