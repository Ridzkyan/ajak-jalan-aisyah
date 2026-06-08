const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const backBtn = document.getElementById("backBtn");
const actions = document.getElementById("actions");
const proposal = document.getElementById("proposal");
const accepted = document.getElementById("accepted");
const noHint = document.getElementById("noHint");

const teasingMessages = [
  "Tombol Tidak lagi malu-malu.",
  "Eh, dia kabur. Pilih Iya aja ya.",
  "Tidaknya susah ditangkap nih.",
  "Kayaknya hatinya tetap condong ke Iya.",
  "Aisyah cantik, tombol ini memang anti ditolak."
];

let noMoves = 0;
let toastTimer;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function showNoHint() {
  window.clearTimeout(toastTimer);
  noHint.textContent = teasingMessages[noMoves % teasingMessages.length];
  noHint.classList.add("show");
  toastTimer = window.setTimeout(() => {
    noHint.classList.remove("show");
  }, 1200);
}

function floatNoButton() {
  if (noBtn.classList.contains("is-floating")) {
    return;
  }

  const rect = noBtn.getBoundingClientRect();
  noBtn.style.width = `${rect.width}px`;
  noBtn.style.height = `${rect.height}px`;
  noBtn.classList.add("is-floating");
  document.body.appendChild(noBtn);
}

function moveNoButton(event) {
  if (noBtn.hidden || noBtn.disabled || proposal.hidden || !accepted.hidden) {
    return;
  }

  event?.preventDefault();
  event?.stopPropagation();

  floatNoButton();

  const margin = 14;
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;
  const maxX = Math.max(margin, window.innerWidth - buttonWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - buttonHeight - margin);
  const eventX = event?.clientX ?? window.innerWidth / 2;
  const eventY = event?.clientY ?? window.innerHeight / 2;

  let x = margin;
  let y = margin;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    x = randomBetween(margin, maxX);
    y = randomBetween(margin, maxY);

    const farEnough =
      Math.abs(x - eventX) > buttonWidth + 28 ||
      Math.abs(y - eventY) > buttonHeight + 28;

    if (farEnough) {
      break;
    }
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = `rotate(${randomBetween(-9, 9).toFixed(1)}deg)`;

  showNoHint();
  noMoves += 1;
}

function makeHeartPop() {
  const heart = document.createElement("span");
  heart.className = "heart-pop";
  heart.textContent = "\u2665";
  heart.style.setProperty("--x", `${randomBetween(12, 88)}vw`);
  heart.style.setProperty("--y", `${randomBetween(28, 78)}vh`);
  document.body.appendChild(heart);

  window.setTimeout(() => {
    heart.remove();
  }, 1200);
}

function resetNoButton() {
  noBtn.hidden = false;
  noBtn.disabled = false;
  noBtn.removeAttribute("aria-hidden");
  noBtn.classList.remove("is-gone");
  noBtn.classList.remove("is-floating");
  noBtn.removeAttribute("style");
  actions.appendChild(noBtn);
}

function acceptInvitation() {
  proposal.hidden = true;
  accepted.hidden = false;
  noBtn.classList.add("is-gone");
  noBtn.hidden = true;
  noBtn.disabled = true;
  noBtn.setAttribute("aria-hidden", "true");
  noBtn.classList.remove("is-floating");
  noBtn.removeAttribute("style");
  actions.appendChild(noBtn);
  noHint.classList.remove("show");

  for (let i = 0; i < 28; i += 1) {
    window.setTimeout(makeHeartPop, i * 42);
  }
}

function returnToProposal() {
  accepted.hidden = true;
  proposal.hidden = false;
  noHint.classList.remove("show");
  resetNoButton();
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("focus", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: false });

yesBtn.addEventListener("click", acceptInvitation);
backBtn.addEventListener("click", returnToProposal);

window.addEventListener("resize", () => {
  if (
    noBtn.classList.contains("is-floating") &&
    !noBtn.hidden &&
    !proposal.hidden
  ) {
    moveNoButton();
  }
});
