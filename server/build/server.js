// Impotação ultiliznado o Modules
import Express from "express";
// Função principal
const app = Express();
// Rota principal, com o parametro/metodo "get".
// O primeiro parametro, por exemplo, /ads é endereço que o usuario ira acessar, localhst3001/ads.
// O segundo parametro precisa ser uma função que sera executada quando o usuario acessar o endereço.
// request, serve para buscar as informaçoes que estão sendo requisitadas pelo usuraio.
// response, serve para devolver uma resposta para o usuario.
app.get('/ads', (request, response) => {
    return response.json([
        { id: 1, title: 'Anuncio 1' },
        { id: 2, title: 'Anuncio 2' },
        { id: 3, title: 'Anuncio 3' },
    ]);
});
app.listen(3001);
