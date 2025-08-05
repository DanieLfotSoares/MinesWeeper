# 🧨 Jogo das Minas - Linguagens Script

Este projeto foi desenvolvido no âmbito da unidade curricular de **Linguagens Script** do curso de **Licenciatura em Engenharia Informática** no **ISEC - Instituto Superior de Engenharia de Coimbra**.

O objetivo era aplicar os conhecimentos adquiridos em **React JS**, **JavaScript**, **HTML** e **CSS** para construir uma aplicação interativa e funcional.

## 🎮 Sobre o Projeto

O "Jogo das Minas" (versão Minesweeper) permite ao utilizador jogar com diferentes níveis de dificuldade, marcando células com bandeiras, abrindo espaços livres e evitando bombas escondidas no tabuleiro.

### 🔧 Funcionalidades principais

- 🟦 **Cells Component**:  
  Gera cada célula do jogo, controlando a exibição de bombas, números, espaços vazios e flags (com clique direito).
  
- 🧠 **Game Component**:  
  Controla o estado global do jogo, incluindo:
  - Criação do tabuleiro
  - Lógica de abertura de células e verificação de vitória/derrota
  - Mudança de dificuldade (Básico, Intermédio, Avançado)
  - Contador de tempo
  - Verificação de vitória/derrota com mensagens visuais

### 📊 Níveis de Dificuldade

- **Básico**: 9x9 com 10 minas  
- **Intermédio**: 16x16 com 40 minas  
- **Avançado**: 30x16 com 99 minas  

### 🧠 Lógica do Jogo

- Vitória: Quando todas as células sem bomba forem abertas ou todas as minas forem corretamente sinalizadas com bandeiras.
- Derrota: Quando o utilizador clica numa célula com bomba.

## 🚀 Desafios Técnicos

Durante o desenvolvimento enfrentámos alguns desafios, nomeadamente:
- Reiniciar corretamente o temporizador após fim do jogo
- Implementar a lógica de abertura automática de células vizinhas sem bomba
- Calcular corretamente o número de minas adjacentes a uma célula aberta

## 👥 Equipa de Desenvolvimento

- **Daniel Soares** - 2023144661

## ✅ Estado do Projeto

Projeto concluído com sucesso. Todas as funcionalidades previstas foram implementadas e testadas. Não foram encontradas limitações críticas.

---

> Projeto realizado no âmbito da UC de Linguagens Script – DEIS @ ISEC - IPC, ano letivo 2023/2024.
