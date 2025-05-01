const g_form = document.querySelector('form')

// monitora o input de quantidade de números para sortear para emitir mensagem de erro segundo necessidade
const g_formQtdeNumeros = document.getElementById('qtd-sortear')
// monitora o input de inicio do intervalo para sorteio para emitir mensagem de erro segundo validações
const g_formInputGerarIni = document.getElementById('ini-gerar')
// monitora o input de fim do intervalo para sorteio para emitir mensagem de erro segundo validações
const g_formInputGerarFim = document.getElementById('fim-gerar')

var g_contador = 0;
var g_arraySorteados = []

g_form.addEventListener('click', (event) => {
    event.preventDefault()
    const botao = event.target.closest('button')

    if (!botao) return

    toggleBotaoSortear(botao)
})

g_formQtdeNumeros.addEventListener('input', (event) => {
    event.preventDefault()
    const tempErro = document.querySelector('.error')

    const hasCharacterRegex = /\D+/g

    g_formQtdeNumeros.value = g_formQtdeNumeros.value.replace(hasCharacterRegex, "")
    if (g_formQtdeNumeros.value > 10) {
        tempErro.textContent = "Permite sortear no máximo 10 números."
        ativaErro()
    }
})

g_formInputGerarIni.addEventListener('input', (event) => {
    event.preventDefault()
    const tempErro = document.querySelector('.error')

    const hasCharacterRegex = /\D+/g

    g_formInputGerarIni.value = g_formInputGerarIni.value.replace(hasCharacterRegex, "")

    if (g_formInputGerarIni.value < 1) {
        tempErro.textContent = "Início do intervalo deve ser maior que (0 - Zero)."
        ativaErro()
    }

    if (g_formInputGerarIni.value > 999) {
        tempErro.textContent = "Início do intervalo deve ser menor que (1000 - Mil)."
        ativaErro()
    }
})

g_formInputGerarFim.addEventListener('input', (event) => {
    event.preventDefault()
    if (!g_formInputGerarFim) return

    const tempErro = document.querySelector('.error')

    const hasCharacterRegex = /\D+/g

    g_formInputGerarFim.value = g_formInputGerarFim.value.replace(hasCharacterRegex, "")

    const temp_qte = Number(document.getElementById('qtd-sortear').value)
    if (!temp_qte) return
    const temp_ini = Number(document.getElementById('ini-gerar').value)
    if (!temp_ini) return

    if (Number(g_formInputGerarFim.value) <= temp_qte + temp_ini) {
        tempErro.textContent = "Com estes valores não tem espaço para sorteio."
        ativaErro()
    }
})

function toggleBotaoSortear(botao) {
    if (botao.innerText == 'SORTEAR') {
        const qtdeNumeros = document.getElementById('qtd-sortear').value || 0;
        if (qtdeNumeros <= 0) {
            console.log('deve informar a quantidade de números que deseja sortear')
            return
        }
        g_contador++;

        // INI Sorteio
        const tempQtde = Number(document.getElementById('qtd-sortear').value)
        const tempIni = Number(document.getElementById('ini-gerar').value)
        const tempFim = Number(document.getElementById('fim-gerar').value)

        g_arraySorteados = sorteia(tempQtde, tempIni, tempFim)
        // FIM Sorteio

        removeElementosSortear(botao)
        criaElementosSortearNovamente(tempQtde)
    }
    else if (botao.innerText == 'SORTEAR NOVAMENTE') {
        registraSorteados()

        removeElementosSorteados(botao)

        criaElementosSortear()
    }
}

function registraSorteados() {
    console.log('registraSorteados')
}

function removeElementosSorteados(parButtonClicked) {
    const tempDivSorteados = document.querySelector('.sorteados')
    tempDivSorteados.remove()

    if (parButtonClicked) {
        parButtonClicked.remove()
    }
}

function criaElementosSortear() {
    atualizaTextoIntro()
    const tempDivInputs = retornaInputsSortear()
    const tempSlider = retornaSlider()
    const tempBotao = retornaButton()
    g_form.append(tempDivInputs, tempSlider, tempBotao)


}

function removeElementosSortear(parButtonClicked) {
    const g_mainInput = document.getElementsByClassName('inputs')
    if (g_mainInput[0]) {
        g_mainInput[0].remove()
    }

    const g_mainCkb = document.getElementsByClassName('bgcolor-wrapper')
    if (g_mainCkb[0]) {
        g_mainCkb[0].remove()
    }

    if (parButtonClicked) {
        parButtonClicked.remove()
    }
}

function criaElementosSortearNovamente(parQtde) {
    // INI Texto intro
    {
        const formTextoIntro = document.querySelector('.intro')
        formTextoIntro.classList.remove('intro')
        formTextoIntro.classList.add('resultado-intro')
        formTextoIntro.children[0].textContent = 'Resultado do sorteio'
        formTextoIntro.children[1].textContent = String(g_contador) + 'º resultado'
    }
    // FIM Texto intro
    // INI Labels Números Sorteados
    criaLabelsNumerosSorteados(parQtde)
    // FIM Labels Números Sorteados
    // INI Botão
    {
        const tempButton = document.createElement('button')
        tempButton.setAttribute('type', 'submit')
        tempButton.setAttribute('id', 'btn-sortear')
        tempButton.textContent = 'sortear novamente'
        const tempImg = document.createElement('img')
        tempImg.setAttribute('src', './assets/icons/runagain.svg')
        tempImg.setAttribute('alt', 'sortear novamente')

        tempButton.append(tempImg)

        g_form.append(tempButton)
    }
    // FIM Botão

}

function criaLabelsNumerosSorteados(parQtdeNumeros) {
    const tempDivSorteados = document.createElement('div')
    tempDivSorteados.classList.add('sorteados')

    for (let i = 0; i < parQtdeNumeros; i++) {

        setTimeout(() => {

            var tempWrapper = document.createElement('div')
            tempWrapper.classList.add('label-wrapper')
            tempWrapper.classList.add('inicial')
            tempWrapper.classList.add('animar')

            var tempLabel = document.createElement('label')
            tempLabel.classList.add('num-sorteado')
            tempLabel.classList.add('inicial')
            tempLabel.classList.add('animar')
            tempLabel.setAttribute('id', 'num_sorteado_' + String(i + 1))

            tempLabel.textContent = g_arraySorteados[i]
            tempWrapper.append(tempLabel)
            tempDivSorteados.append(tempWrapper)

        }, (i+1) * 1500);

    }
    g_form.append(tempDivSorteados)
}

function atualizaTextoIntro() {
    const formTextoIntro = document.querySelector('.resultado-intro')
    formTextoIntro.classList.remove('resultado-intro')
    formTextoIntro.classList.add('intro')
    formTextoIntro.children[0].textContent = 'quero sortear:'
    formTextoIntro.children[1].textContent = 'Defina o intervalo e a quantidade de números, clique em "Sortear" e veja os resultados na tela. É rápido e fácil!'
}

function retornaInputsSortear() {
    // input group (class=inputs)
    const tempInputGroup = document.createElement('div')
    tempInputGroup.classList.add('inputs')

    const tempInputSortearQtde = createInput('qtd-sortear', 'números', '2')
    const tempInputGerarIni = createInput('ini-gerar', 'de', '1')
    const tempInputGerarFim = createInput('fim-gerar', 'até', '100')
    tempInputGroup.append(tempInputSortearQtde, tempInputGerarIni, tempInputGerarFim)

    return (tempInputGroup)
}

function createInput(parInputId, parInputLabel, parInputPlaceholder) {
    const tempInputContainer = document.createElement('div')
    tempInputContainer.classList.add('input-wrapper')

    const tempLabel = document.createElement('label')
    tempLabel.setAttribute('for', parInputId)
    tempLabel.textContent = parInputLabel

    const tempInput = document.createElement('input')
    tempInput.setAttribute('type', 'text')
    tempInput.setAttribute('id', parInputId)
    tempInput.setAttribute('name', parInputId)
    tempInput.setAttribute('placeholder', parInputPlaceholder)

    tempInputContainer.append(tempLabel, tempInput)

    return (tempInputContainer)
}

function retornaSlider() {
    const tempCkbContainer = document.createElement('div')
    tempCkbContainer.classList.add('bgcolor-wrapper')

    const tempCkbLabel = document.createElement('div')
    tempCkbLabel.classList.add('check-label')

    const tempCkbWrapper = document.createElement('div')
    tempCkbWrapper.classList.add('checkbox-wrapper')

    const tempInput = document.createElement('input')
    tempInput.setAttribute('type', 'checkbox')
    tempInput.setAttribute('id', 'nao-repetir')
    tempInput.setAttribute('name', 'nao-repetir')
    tempInput.setAttribute('checked', '')

    const tempSlider = document.createElement('span')
    tempSlider.classList.add('checkbox-slider')

    tempCkbWrapper.append(tempInput, tempSlider)

    const tempLabel = document.createElement('label')
    tempLabel.setAttribute('for', 'nao-repetir')
    tempLabel.textContent = 'Não repetir número'

    tempCkbLabel.append(tempCkbWrapper, tempLabel)
    tempCkbContainer.append(tempCkbLabel)

    return (tempCkbContainer)
}

function retornaButton() {
    // button
    const tempButton = document.createElement('button')
    tempButton.setAttribute('type', 'submit')
    tempButton.textContent = 'sortear'

    const tempButtonImg = document.createElement('img')
    tempButtonImg.setAttribute('src', './assets/icons/seta.svg')

    tempButton.append(tempButtonImg)

    return (tempButton)
}

function ativaErro() {
    // INI Teste ERRO
    const tempErro = document.querySelector('.error')
    tempErro.classList.remove('hide')
    tempErro.classList.add('show')
    setTimeout(() => {
        tempErro.classList.remove('show')
        tempErro.classList.add('hide')
    }, 1000);
    // FIM Teste ERRO
}

function ativaGiro() {

    for (let i = 0; i < parQtdeNumeros; i++) {
        var tempWrapper = document.createElement('div')
        tempWrapper.classList.add('label-wrapper')
        tempWrapper.classList.add('inicial')

        var tempLabel = document.createElement('label')
        tempLabel.classList.add('num-sorteado')
        tempLabel.classList.add('inicial')
        tempLabel.setAttribute('id', 'num_sorteado_' + String(i + 1))

        if (i + 1 == parQtdeNumeros) {
            tempLabel.textContent = 345
            tempLabel.classList.add('pre-giro')
            tempLabel.classList.add('animar')
        }

        tempWrapper.append(tempLabel)
        tempDivSorteados.append(tempWrapper)
    }
}

function sorteia(parQtde, parIni, parFim) {
    var arrRetorno = []

    for (let i = 0; i < parQtde; i++) {
        const tempNum = sortearInteiro(parIni, parFim, arrRetorno)

        arrRetorno.push(tempNum)
    }

    return arrRetorno

}

function _inteiroAleatorio(parIni, parFim) {
    return Math.floor(Math.random() * (parFim - parIni + 1)) + parIni
}

function sortearInteiro(parIni, parFim, parSorteados, parPodeRepetir) {

    let tempNumero
    do {
        tempNumero = _inteiroAleatorio(parIni, parFim)
    } while (_restricao(parSorteados, tempNumero, !parPodeRepetir))

    return tempNumero
}

function _restricao(pArr, pNum, pUnico) {
    if (!pUnico) {
        return false
    }
    if (pArr.includes(pNum)) {
        return true
    }
    return false
}