import navbar from "./components/navbar/navbar.js";
import home from "./components/paginas/home.js"
import sobre from "./components/paginas/sobre.js"
import contato from "./components/paginas/contato.js";
import servico from "./components/paginas/servico.js";

const app = document.getElementById('app');
// app.textContent = '<h1>Olá Mundo!</h1>';

let rota = window.location.hash || '#inicio';
render()
window.addEventListener("hashchange" , ()=>{
rota = window.location.hash;
render()

})
function render(){
switch(rota){
    case '#inicio':
        app.innerHTML = home
    break;
    case '#sobre':
        app.innerHTML = sobre
    break;
    case '#contato':
        app.innerHTML = contato
    break;
    case '#servico':
        app.innerHTML = servico
    break;
    default:
        app.innerHTML = `<h1> Pagina não encontrada </h1>` ;
}
}