document.addEventListener("DOMContentLoaded", function () {
  const player1Deck = document.getElementById("player1-deck");
  const player1Hand = document.getElementById("player1-hand");
  const player1BattleArea = document.getElementById("player1-battle-area");
  const player1SupportArea = document.getElementById("player1-support-area");

  const player2Deck = document.getElementById("player2-deck");
  const player2Hand = document.getElementById("player2-hand");
  const player2BattleArea = document.getElementById("player2-battle-area");
  const player2SupportArea = document.getElementById("player2-support-area");

  let cards = [];

  // 카드 데이터 불러오기
  fetch('cards.json')
    .then(response => response.json())
    .then(data => {
      cards = data;
      initializeGame();
    });

  function initializeGame() {
    shuffle(cards);
    drawInitialHand(player1Hand);
    drawInitialHand(player2Hand);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function drawInitialHand(playerHand) {
    for (let i = 0; i < 5; i++) {
      drawCard(playerHand);
    }
  }

  function drawCard(playerHand) {
    if (cards.length > 0) {
      const card = cards.pop();
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.textContent = `${card.name.ko} (HP: ${card.hp}, LV: ${card.level})`;
      cardElement.dataset.hp = card.hp;
      cardElement.dataset.level = card.level;
      cardElement.dataset.serial = card.serial;
      playerHand.appendChild(cardElement);

      // 카드 클릭 이벤트 핸들러 추가
      cardElement.onclick = function () {
        playCard(cardElement, playerHand);
      };
    }
  }

  function playCard(cardElement, playerHand) {
    // 카드 플레이 로직 구현
    if (playerHand === player1Hand) {
      player1BattleArea.appendChild(cardElement);
    } else {
      player2BattleArea.appendChild(cardElement);
    }
  }

  function attack(attacker, defender) {
    const attackPower = parseInt(attacker.dataset.level, 10);
    const defenderHp = parseInt(defender.dataset.hp, 10) - attackPower;
    defender.dataset.hp = defenderHp;
    defender.textContent = `${defender.textContent.split(' ')[0]} (HP: ${defenderHp}, LV: ${defender.dataset.level})`;

    if (defenderHp <= 0) {
      defender.parentNode.removeChild(defender);
    }
  }

  // 예제 카드 드로우 버튼
  const drawButton1 = document.createElement("button");
  drawButton1.textContent = "Draw Card";
  drawButton1.onclick = function () {
    drawCard(player1Hand);
  };
  player1Deck.appendChild(drawButton1);

  const drawButton2 = document.createElement("button");
  drawButton2.textContent = "Draw Card";
  drawButton2.onclick = function () {
    drawCard(player2Hand);
  };
  player2Deck.appendChild(drawButton2);

  // 공격 버튼 추가
  const attackButton1 = document.createElement("button");
  attackButton1.textContent = "Player 1 Attack";
  attackButton1.onclick = function () {
    const attacker = player1BattleArea.querySelector('.card');
    const defender = player2BattleArea.querySelector('.card');
    if (attacker && defender) {
      attack(attacker, defender);
    }
  };
  player1BattleArea.appendChild(attackButton1);

  const attackButton2 = document.createElement("button");
  attackButton2.textContent = "Player 2 Attack";
  attackButton2.onclick = function () {
    const attacker = player2BattleArea.querySelector('.card');
    const defender = player1BattleArea.querySelector('.card');
    if (attacker && defender) {
      attack(attacker, defender);
    }
  };
  player2BattleArea.appendChild(attackButton2);
});

  player2Deck.appendChild(drawButton2);
});
