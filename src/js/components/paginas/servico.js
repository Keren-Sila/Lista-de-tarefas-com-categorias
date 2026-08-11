let servico = "";
const detalhes = [
    {
        titulo: 'serviço 1',
        descricao: 'xxxxxx xxxxxx xxxxxxxxxx',
        imagem: 'src/img/corinthias.jpg'
    },
    {
        titulo: 'serviço 2',
        descricao: 'xxxxxx xxxxxx xxxxxxxxxx',
        imagem: 'src/img/depay.webp'
    },
    {
        titulo: 'servoço 3',
        descricao: 'xxxxxx xxxxxx xxxxxxxxxx',
        imagem: 'image.jpg'
    },
    {
        titulo: 'serviço 4',
        descricao: 'xxxxxx xxxxxx xxxxxxxxxx',
        imagem: 'image.jpg'
    },
    {
        titulo: 'serviço 5',
        descricao: 'xxxxxx xxxxxx xxxxxxxxxx',
        imagem: 'image.jpg'
    }
]
servico += `<div class="bem-grid-auto">`
for(let i=0; i < detalhes.length; i++){
servico += `
        <div class="bem-card">
            <img class="bem-card__image" src="${detalhes[i].imagem}" alt="Image description">
            <div class="bem-card__body">
                <h3 class="bem-card__title">${detalhes[i].titulo}</h3>
                <p>${detalhes[i].descricao}</p>
            </div>
        </div>

`
}
servico += `</div>`

export default servico;