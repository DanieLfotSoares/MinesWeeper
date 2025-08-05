import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import Cell from './Cell'; 
import './Game.css'; 

const levels = {
    basic: { width: 9, height: 9, bombs: 10, cellSize: 40 },
    intermediate: { width: 16, height: 16, bombs: 40, cellSize: 35 },
    advanced: { width: 30, height: 16, bombs: 99, cellSize: 25 }
};

// Classe que representa cada célula no tabuleiro
class CellClass {
    constructor(x, y) { // Construtor que define a posição da célula e suas propriedades iniciais
        this.x = x; // Coordenada x da célula
        this.y = y; // Coordenada y da célula
        this.bomb = false;      // Se a célula ter uma bomba
        this.flagged = 'none'; // Estado de bandeira da célula ('none', 'flag', 'question')
        this.open = false;      // Se a celula esta aberta
        this.bombsAround = 0; // Numero de bombas ao redor da celula
    }

    // Método que retorna as células ao redor da célula atual
    cellAround(field) {
        const cells = []; // Array para armazenar as células ao redor
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (const [dy, dx] of directions) {
            const newY = this.y + dy;
            const newX = this.x + dx;
            
            // Verificar se as coordenadas estão dentro dos limites
            if (newY >= 0 && newY < field.length && 
                newX >= 0 && newX < field[0].length) {
                cells.push(field[newY][newX]);
            }
        }
        
        return cells; // Retorna as células ao redor
    }
}

// Função para inicializar o tabuleiro de jogo
const init = (width, height, bombs) => {
    const field = []; // Array para armazenar as linhas do tabuleiro
    
    // Criar o tabuleiro vazio
    for (let y = 0; y < height; y++) { // Loop para criar as linhas do tabuleiro
        const row = []; // Array para armazenar as células de uma linha
        for (let x = 0; x < width; x++) {
            row.push(new CellClass(x, y)); // Cria uma célula e adiciona à linha
        }
        field.push(row); // Adiciona a linha ao tabuleiro
    }
    
    // Colocar as bombas
    let bombsPlaced = 0;
    while (bombsPlaced < bombs) {
        const x = Math.floor(Math.random() * width); // Gera uma coordenada x aleatória
        const y = Math.floor(Math.random() * height); // Gera uma coordenada y aleatória
        
        // Verificar se a posição é válida e não tem bomba
        if (field[y] && field[y][x] && !field[y][x].bomb) {
            field[y][x].bomb = true; // Coloca uma bomba na célula
            bombsPlaced++;
        }
    }
    
    // Calcular números ao redor das bombas
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = field[y][x];
            if (!cell.bomb) {
                const neighboringCells = cell.cellAround(field);
                cell.bombsAround = neighboringCells.filter(c => c && c.bomb).length;
            }
        }
    }
    
    return field; // Retorna o tabuleiro inicializado
}

// Componente principal do jogo
const Game = () => {
    const [level, setLevel] = useState('basic'); // Estado para armazenar o nível atual do jogo
    const [gameStarted, setGameStarted] = useState(false); // Estado para armazenar se o jogo começou
    const [field, setField] = useState(init(levels[level].width, levels[level].height, levels[level].bombs)); // Estado para armazenar o tabuleiro de jogo
    const [flags, setFlags] = useState(0); // Estado para armazenar o número de bandeiras colocadas
    const [timeElapsed, setTimeElapsed] = useState(0); // Estado para armazenar o tempo decorrido

    const { width, height, bombs, cellSize } = levels[level]; // Desestrutura as configurações do nível atual

    const intervalRef = useRef(null); // Referência para armazenar o intervalo do temporizador

    // Função para reiniciar o jogo
    const resetGame = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current); // Limpa o intervalo do temporizador se existir
        const { width, height, bombs } = levels[level]; // Desestrutura as configurações do nível atual
        setField(init(width, height, bombs)); // Inicializa o tabuleiro
        setFlags(0); // Reseta o número de bandeiras
        setTimeElapsed(0); // Reseta o tempo decorrido
        setGameStarted(false); // Define que o jogo não começou
    }, [level]);

    // Função para iniciar ou reiniciar o jogo
    const startGame = () => {
        if (intervalRef.current) clearInterval(intervalRef.current); // Limpa o intervalo do temporizador se existir

        if (gameStarted) { // Se o jogo já começou
            resetGame(); // Reinicia o jogo
        } else { // Se o jogo não começou
            const { width, height, bombs } = levels[level]; // Desestrutura as configurações do nível atual
            setField(init(width, height, bombs)); // Inicializa o tabuleiro
            setFlags(0); // Reseta o número de bandeiras
            setGameStarted(true); // Define que o jogo começou
            intervalRef.current = setInterval(() => { // Inicia o temporizador
                setTimeElapsed(prevTime => prevTime + 1); // Incrementa o tempo decorrido a cada segundo
            }, 1000);
        }
    };

    // Efeito para redefinir o jogo quando o nível muda
    useEffect(() => {
        resetGame(); // Reinicia o jogo
    }, [resetGame]);

    // Efeito para limpar o intervalo do temporizador quando o componente é desmontado
    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Limpa o intervalo do temporizador
    }, []);

    // Função para mudar o nível do jogo
    const handleChangeLevel = (e) => {
        setLevel(e.target.value); // Define o novo nível
        resetGame(); // Reinicia o jogo
    };

    // Função para aplicar uma função a cada célula do tabuleiro
    const eachCell = (fn) => {
        for (let y = 0; y < height; y++) { // Loop para percorrer as linhas do tabuleiro
            for (let x = 0; x < width; x++) {
                const cell = field[y][x];
                if (cell) {
                    fn(cell);
                }
            }
        }
    };

    // Função para abrir todas as células do tabuleiro
    const openAll = () => {
        eachCell(cell => cell.open = true); // Abre todas as células
        setField([...field]); // Atualiza o estado do tabuleiro
    };

    // Função para verificar se o jogo foi vencido
    const gameWon = () => {
        let found = 0; // Contador de bombas encontradas
        eachCell(cell => { if (cell.bomb && cell.flagged === 'flag') found++; }); // Conta as bombas que foram marcadas com bandeiras
        return bombs === found; // Retorna se o número de bombas encontradas é igual ao número total de bombas
    };

    // Função para finalizar o jogo
    const finishGame = (text) => {
        // Revela todas as células ao finalizar o jogo
        field.forEach(row => row.forEach(cell => {
            cell.open = true;
        }));
        openAll();
        clearInterval(intervalRef.current);
        const timeTaken = timeElapsed;
        setTimeout(() => {
            alert(text.replace('{}', timeTaken)); // Use `timeTaken` to display the correct time
            resetGame();
            setGameStarted(false);
        }, 50);
    };
    
    const handleClick = (x, y) => {
        if (!gameStarted) return;
        const cell = field[y] && field[y][x];
        if (!cell || cell.open || cell.flagged !== 'none') return;
        cell.open = true;
        if (cell.bomb) {
            finishGame(`Acertaste numa Bomba, perdeste o Jogo!! \nTempo: ${timeElapsed} segundos!`); // Correctly include timeElapsed
        } else if (cell.bombsAround === 0) {
            cell.cellAround(field).forEach(c => {
                if (!c.open && !c.bomb) {
                    handleClick(c.x, c.y);
                }
            });
        }
        setField([...field]);
        if (gameWon()) finishGame(`Ganhaste!! Parabéns!! \nTempo: ${timeElapsed} segundos!`);
    };
    
    const handleRightClick = (x, y, e) => {
        e.preventDefault();
        if (!gameStarted) return;
        const cell = field[y][x];
        if (!cell.open) {
            if (cell.flagged === 'none') {
                if (flags < bombs) {
                    cell.flagged = 'flag';
                    setFlags(flags + 1);
                }
            } else if (cell.flagged === 'flag') {
                cell.flagged = 'question';
                setFlags(flags - 1);
            } else {
                cell.flagged = 'none';
            }
            setField([...field]);
            if (gameWon()) finishGame(`Ganhaste!! Parabéns!! \n Tempo: ${timeElapsed} segundos!`);
        }
    };

    return (
        <div className="game-container">
            <div className="control-panel">
                <select value={level} onChange={handleChangeLevel} disabled={gameStarted}>
                    <option value="basic">🔰 Básico (9×9)</option>
                    <option value="intermediate">⚡ Intermédio (16×16)</option>
                    <option value="advanced">🔥 Avançado (30×16)</option>
                </select>
                <button onClick={startGame}>
                    {gameStarted ? '🔄 Reiniciar Jogo' : '🎮 Começar Jogo'}
                </button>
                <div className="info-display">
                    <div className="flag-counter">🚩 {flags}/{bombs}</div>
                    <div className="timer">⏱️ {timeElapsed}s</div>
                </div>
            </div>
            <div 
                className="game" 
                style={{ 
                    gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${height}, ${cellSize}px)`
                }}                
            >
                {field.map((row, y) =>
                    <div className="row" key={y}>
                        {row.map((cell, x) =>
                            <Cell
                                key={x}
                                cell={cell}
                                onClick={() => handleClick(x, y)}
                                onRightClick={(e) => handleRightClick(x, y, e)}
                                cellSize={cellSize}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
