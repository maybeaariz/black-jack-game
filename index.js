let player = {
  name: "Aariz",
  chips: 200
}

const BET = 10

let cards = []
let sum = 0
let dealerCards = []
let dealerSum = 0
let hasBlackjack = false
let isAlive = false
let roundActive = false
let dealerTurn = false

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let dealerSumEl = document.getElementById("dealer-sum-el")
let cardsEl = document.getElementById("cards-el")
let dealerCardsEl = document.getElementById("dealer-cards-el")
let playerEl = document.getElementById("player-el")
let startBtn = document.getElementById("start-btn")
let hitBtn = document.getElementById("hit-btn")
let standBtn = document.getElementById("stand-btn")

renderChips()

function renderChips(){
  playerEl.innerHTML = '<span class="chip"></span> ' + player.name + ": $" + player.chips
}

function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1
  if (randomNumber > 10) {
    return 10
  } else if (randomNumber === 1) {
    return 11
  } else {
    return randomNumber
  }
}

function rankLabel(value){
  return value === 11 ? "A" : String(value)
}

function cardHTML(value, hidden){
  if (hidden) {
    return '<div class="card back"></div>'
  }
  let isRed = (value % 2 === 0) // purely visual alternation, no suits
  let cls = "card" + (isRed ? " red" : "")
  let label = rankLabel(value)
  return '<div class="' + cls + '">' +
           '<span class="rank top-left">' + label + '</span>' +
           '<div class="pip"></div>' +
           '<span class="rank bottom-right">' + label + '</span>' +
         '</div>'
}

function startGame() {
  if (roundActive) return

  roundActive = true
  isAlive = true
  hasBlackjack = false
  dealerTurn = false

  startBtn.disabled = true
  hitBtn.disabled = false
  standBtn.disabled = false

  let firstCard = getRandomCard()
  let secondCard = getRandomCard()
  cards = [firstCard, secondCard]
  sum = firstCard + secondCard

  let dealerFirst = getRandomCard()
  let dealerSecond = getRandomCard()
  dealerCards = [dealerFirst, dealerSecond]
  dealerSum = dealerFirst + dealerSecond

  renderGame()

  if (sum === 21) {
    hasBlackjack = true
    isAlive = false
    endRound()
  }
}

function renderGame(showDealerHidden) {
  cardsEl.innerHTML = cards.map(c => cardHTML(c, false)).join("")
  sumEl.textContent = "Your sum: " + sum

  dealerCardsEl.innerHTML = dealerCards.map((c, i) => {
    let hide = (!showDealerHidden && dealerTurn === false && roundActive && i === 1 && !isRoundOver())
    return cardHTML(c, hide)
  }).join("")

  if (showDealerHidden || isRoundOver()) {
    dealerSumEl.textContent = "Dealer sum: " + dealerSum
  } else {
    dealerSumEl.textContent = "Dealer sum: " + dealerCards[0] + " + ?"
  }

  if (sum < 21 && isAlive) {
    messageEl.textContent = "Do you want to draw a new card, or stand?"
  } else if (sum === 21) {
    messageEl.textContent = "You've got Blackjack!"
  } else if (sum > 21) {
    messageEl.textContent = "You're bust!"
  }
}

function isRoundOver(){
  return !roundActive
}

function newCard() {
  if (!isAlive || hasBlackjack) return

  let card = getRandomCard()
  sum += card
  cards.push(card)

  if (sum >= 21) {
    isAlive = false
    if (sum === 21) hasBlackjack = true
    renderGame()
    endRound()
  } else {
    renderGame()
  }
}

function stand() {
  if (!isAlive && !roundActive) return
  isAlive = false
  hitBtn.disabled = true
  standBtn.disabled = true
  dealerTurn = true
  messageEl.textContent = "You stand. Dealer is drawing..."
  renderGame(true)
  setTimeout(dealerPlay, 900)
}

function dealerPlay(){
  if (sum > 21) {
    // player already bust, no need for dealer to draw
    endRound()
    return
  }

  if (dealerSum < 17) {
    let card = getRandomCard()
    dealerSum += card
    dealerCards.push(card)
    renderGame(true)
    setTimeout(dealerPlay, 900)
  } else {
    endRound()
  }
}

function endRound(){
  roundActive = false
  dealerTurn = true
  hitBtn.disabled = true
  standBtn.disabled = true
  renderGame(true)

  let outcome = ""
  if (sum > 21) {
    outcome = "You're bust! Dealer wins."
    player.chips -= BET
  } else if (dealerSum > 21) {
    outcome = "Dealer busts! You win $" + BET + "."
    player.chips += BET
  } else if (hasBlackjack && dealerSum !== 21) {
    outcome = "Blackjack! You win $" + BET + "."
    player.chips += BET
  } else if (sum === dealerSum) {
    outcome = "Push! It's a tie."
  } else if (sum > dealerSum) {
    outcome = "You win $" + BET + "!"
    player.chips += BET
  } else {
    outcome = "Dealer wins this round."
    player.chips -= BET
  }

  messageEl.textContent = outcome
  renderChips()
  startBtn.disabled = false
}










