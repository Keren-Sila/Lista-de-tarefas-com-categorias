const rota = window.location.hash;
console.log(rota)
console.log(typeof rota)
console.log(typeof '#inicio')
console.log(rota === '#inicio')

// = é receba atribuição 
// == ou === comparação de valor
if(rota === '#inicio'){
    console.log("Pagina inicial")
}else if (rota === '#contato'){
    console.log("Pagina de contato")
}else{
    console.log("Pagina não encontrada")
}


const idade = 18; 
const sexo = "F"
if(idade >=18){
    console.log("Não pode entrar")
}else if(idade >= 30 && idade < 60){
    console.log("Pode entar, mas cuidado com a saúde")
}else if(idade <= 30 && sexo === "F"){
    console.log("Entrada Free")
}


const estudante = true;
// != diferente
// !== diferente valor e tipo
if(!estudante){
    console.log("Meia entrada")
}else{
    console.log("Entrada normal")
}