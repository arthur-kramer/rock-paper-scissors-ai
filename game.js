const URL = "https://teachablemachine.withgoogle.com/models/rViGBrD24/";

let model, webcam, maxPredictions;
let playerScore = 0, computerScore = 0;

// Inicializa modelo e webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

function decidirVencedor(player, computer){
    if(player === computer) return "Empate!";
    if(player === "Nada") return "Nenhuma jogada capturada. Tente novamente!"
    if(
        (player === "Pedra" && computer === "Tesoura") ||
        (player === "Papel" && computer === "Pedra") ||
        (player === "Tesoura" && computer === "Papel")
    ) return "Você ganhou!";
    return "Computador ganhou!";
}

function reiniciarJogo(){
    playerScore = 0;
    computerScore = 0;

    document.getElementById("player-move").innerText = "—";
    document.getElementById("computer-move").innerText = "—";
    document.getElementById("result").innerText = "";
    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("computer-score").innerText = computerScore;

}

// Função para jogar uma rodada
async function jogarRodada() {
    // Captura a previsão do modelo
    const prediction = await model.predict(webcam.canvas);
    // Pega a classe com maior probabilidade
    let maxProb = 0;
    let playerMove = "";
    prediction.forEach(p => {
        if(p.probability > maxProb){
            maxProb = p.probability;
            playerMove = p.className;
        }
    });

    // Jogada aleatória do computador
    const moves = ["Pedra", "Papel", "Tesoura"];
    const computerMove = moves[Math.floor(Math.random() * moves.length)];

    // Decide vencedor
    let resultado = decidirVencedor(playerMove, computerMove);

    // Atualiza HTML
    document.getElementById("player-move").innerText = playerMove;
    document.getElementById("computer-move").innerText = computerMove;
    const resultSpan = document.getElementById("result");
    resultSpan.innerText = resultado;

    resultSpan.classList.remove("result-win", "result-lose", "result-draw");

    // Atualiza placar
    if(resultado === "Você ganhou!") {
        playerScore++;
        resultSpan.classList.add("result-win");
    } else if(resultado === "Computador ganhou!") {
        computerScore++;
        resultSpan.classList.add("result-lose");
    } else {
        resultSpan.classList.add("result-draw");
    }

    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("computer-score").innerText = computerScore;
}

// Conecta os botões
document.getElementById("btn-iniciar").addEventListener("click", jogarRodada);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJogo);

// Inicializa tudo
init();