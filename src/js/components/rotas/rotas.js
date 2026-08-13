// src/js/components/rotas/rotas.js
// Capítulo 8 e 9 da Apostila - Definição central do array de rotas da aplicação
import dashboard from '../paginas/dashboard.js';
import tarefas from '../paginas/tarefas.js';
import categorias from '../paginas/categorias.js';
import calendario from '../paginas/calendario.js';
import perfil from '../paginas/perfil.js';
import login from '../paginas/login.js';

const roteador = [
    dashboard,
    tarefas,
    categorias,
    calendario,
    perfil,
    login
];

export default roteador;
