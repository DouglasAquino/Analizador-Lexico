var tabela = document.querySelector("#tabela");
var tabela2 = document.querySelector("#tabela2");
var codigo = document.querySelector('.entrada').value;

var dados = {
    "palavra reservada":['while','do'],
    "operador":['<','=','+'],
    "terminador":';',
    "identificador":['i','j'],
    "tipos":["palavra reservada","operador","terminador","identificador"]
}

var fimDeLinha = {
    "chave":true,
    "token":";",
    "identificacao":"terminador",
    "tipo":"terminador",
    "tamanho":1,
    "posicao":"",
};

function atualizarCodigo(token){
    let sub = ""
    for(let x=0;x<token.length;x++){
        sub+="@"
    }
    return codigo.replace(token,sub);
}


function Identificar(token){
    saida={}
    saida["chave"]=false;
    if(token == ""){
        saida['token'] = "espaço vazio";
        saida['posicao'] = codigo.indexOf("  ");
    }else if(isNaN(token)){
        let existe = false;
        dados.tipos.forEach( tipo => {
            if(tipo != "terminador"){
                dados[tipo].forEach( item => {
                    if(item == token){
                        existe = true;
                        saida['token'] = token;
                        if(tipo == "identificador"){
                            saida['tipo']=tipo
                            saida['identificacao'] = tipo+" | "+(dados[tipo].indexOf(token)+1);
                        }else{
                            saida['identificacao'] = tipo;
                        }
                        saida['tamanho'] = token.length;
                        saida['posicao'] = "(0 : "+codigo.indexOf(token)+")";
                        //-----------------\\
                        codigo = atualizarCodigo(token);
                        saida["chave"] = true;
                    }
                });
            }else if(dados.terminador == token){
                existe = true;
                saida['tipo']=tipo;
                saida['identificacao']=tipo;
                saida['tamanho'] = token.length;
                saida['posicao'] = "(0|"+codigo.indexOf(token)+")";
                codigo = atualizarCodigo(token);
                saida["chave"]=true;
            }
        });
    }else if(!isNaN(token)){
        saida['token']=token;
        if(token.length > 1){
            repeticoes=[]
            token.split("").forEach( num => {
                let tem = false;
                repeticoes.forEach( t => {
                    if(num == t){
                        tem = true;
                    }
                })
                if(!tem){
                    repeticoes.push(num);
                }
            })
            saida['identificacao'] = "constante | "+repeticoes.length;
            saida['tamanho'] = token.length;
            saida['tipo']='constante';
            saida['posicao'] = "(0 : "+codigo.indexOf(token)+")";
            codigo = atualizarCodigo(token);
            saida["chave"]=true;
        }else{
            saida['tipo']="numero";
            saida['identificacao']="numero";
            saida['tamanho'] = token.length;
            saida['posicao'] = "(0 : "+codigo.indexOf(token)+")";
            codigo = atualizarCodigo(token);
            saida["chave"]=true;
        }
    }
    return saida;
}
function limpar(){
    while(tabela.childNodes[2]){
        tabela.removeChild(tabela.childNodes[2]);
    }
    while(tabela2.childNodes[2]){
        tabela2.removeChild(tabela2.childNodes[2]);
    }
}

function montarTokens(avaliacao){
    tabela.style['visibility'] = 'visible';
    //---------------------------------------------
    let tr = document.createElement('tr');
    tr.className="nova";
    let token = document.createElement('td');
    token.textContent = avaliacao.token;
    token.className="celula";
    let ident = document.createElement('td');
    ident.textContent = avaliacao.identificacao;
    ident.className="celula";
    let tam = document.createElement('td');
    tam.textContent = avaliacao.tamanho;
    tam.className="celula";
    let pos = document.createElement('td');
    pos.textContent = avaliacao.posicao;
    pos.className="celula";
    tr.appendChild(token);
    tr.appendChild(ident);
    tr.appendChild(tam);
    tr.appendChild(pos);
    tabela.appendChild(tr);
}

function scannear(){
    limpar();
    codigo = document.querySelector('.entrada').value;
    if(codigo[codigo.length-1] != dados.terminador){
        alert("ERRO: terminador "+dados.terminador+" não encontrado! L: 0 C: "+(codigo.length-1))
    }else{
        let erro = false;
        codigo = codigo.slice(0,-1);
        let lista = codigo.split(' ');
        let simbolos=[]
        let ult=0;
        lista.forEach(element => {
            let avaliacao = Identificar(element);
            if(avaliacao.chave){
                ult=avaliacao.posicao;
                montarTokens(avaliacao);
                if(avaliacao.tipo == "identificador" || avaliacao.tipo == "constante" || avaliacao.tipo == "numero"){
                    let tem = false;
                    simbolos.forEach( i => {
                        if(avaliacao.token == i){
                            tem = true;
                        }
                    })
                    if(!tem){
                        simbolos.push(avaliacao.token);
                    }
                }
            }else{
                if(element == ""){
                    alert("ERROR: TOKEN '"+avaliacao.token+"' Inválido! L: 0 - C: "+avaliacao.posicao);
                }else{
                    alert("ERROR: TOKEN '"+element+"' Inválido! L: 0 - C: "+codigo.indexOf(element));
                }
                erro=true;
            }
        });
        if(erro){
            apagar();
        }else{
            ult = "(0 : "+(parseInt(ult.slice(5,ult.length-1))+1)+")";
            fimDeLinha.posicao = ult;
            montarTokens(fimDeLinha)
            montarSimbolos(simbolos);
        }
    }
}


function montarSimbolos(listaSimbolos){
    listaSimbolos.forEach((item,id) => {
        tabela2.style['visibility'] = 'visible';
        let tr = document.createElement('tr');
        let indice = document.createElement('td');
        indice.className = "celula";
        indice.textContent=id+1;
        let simbolo = document.createElement('td');
        simbolo.className = "celula";
        simbolo.textContent = item;
        tr.appendChild(indice);
        tr.appendChild(simbolo);
        tabela2.appendChild(tr);
    });
}

function apagar(){
    tabela.style['visibility'] = 'hidden';
    tabela2.style['visibility'] = 'hidden';
    limpar();
}