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
  let currentPlayer = 1;

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
      cardElement.innerHTML = `
        <div>${card.name.ko}</div>
        <div>HP: ${card.hp}</div>
        <div>LV: ${card.level}</div>
      `;
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
    // 카드 배틀 영역 배치
    if (playerHand === player1Hand && currentPlayer === 1) {
      player1BattleArea.appendChild(cardElement);
      checkSkill(cardElement, player2BattleArea);
    } else if (playerHand === player2Hand && currentPlayer === 2) {
      player2BattleArea.appendChild(cardElement);
      checkSkill(cardElement, player1BattleArea);
    }
    endTurn();
  }

  function checkSkill(cardElement, opponentBattleArea) {
    // 스킬 발동 조건 확인 및 스킬 발동
    const card = cards.find(c => c.serial === cardElement.dataset.serial);
    if (card && card.hasSkill && card.skill.condition.includes("appear")) {
      applySkill(card, opponentBattleArea);
    }
  }

  function applySkill(card, opponentBattleArea) {
    // 스킬 효과 적용 (예: 대미지)
    if (card.skill.effect.damage) {
      const opponentCards = opponentBattleArea.getElementsByClassName("card");
      if (opponentCards.length > 0) {
        const targetCard = opponentCards[0]; // 예시로 첫 번째 카드를 타겟으로 함
        const newHp = targetCard.dataset.hp - card.skill.effect.damage;
        targetCard.dataset.hp = newHp;
        targetCard.innerHTML = `
          <div>${targetCard.innerHTML.split('<div>')[0]}</div>
          <div>HP: ${newHp}</div>
          <div>LV: ${targetCard.dataset.level}</div>
        `;
        if (newHp <= 0) {
          opponentBattleArea.removeChild(targetCard);
        }
      }
    }
  }

  function endTurn() {
    // 턴 종료 및 다음 플레이어로 전환
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    // 다음 플레이어에게 턴을 넘기기 위한 로직 추가
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
});

