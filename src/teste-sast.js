function exibirMensagem(nome) {
    document.getElementById("mensagem").innerHTML = nome;
}

exibirMensagem("<img src=x onerror=alert('XSS')>");
