const inputSection = document.getElementById("inputSection");
const result = document.getElementById("result");
const pValue = document.getElementById("pValue");
const qValue = document.getElementById("qValue");
const nValue = document.getElementById("nValue");
const phiValue = document.getElementById("phiValue");
const dValue = document.getElementById("dValue");
const eValue = document.getElementById("eValue");

const publicKey = document.getElementById("publicKey");
const privateKey = document.getElementById("privateKey");

let primeArray = [];
let gcdArray = [];

const rusAlpha =
  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

function isPrimeArray() {
  let result = [];
  for (let i = 0; i < 100; i++) {
    if (isPrime(i)) {
      result.push(i);
    }
  }
  return result;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function isGcdArray(phi) {
  let result = [];
  for (let d = phi - 1; d > 1; d--) {
    if (gcd(d, phi) === 1) {
      result.push(d);
    }
  }
  return result;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function modInverse(d, phi) {
  if (gcd(d, phi) !== 1) {
    return null;
  }

  for (let e = 1; e < phi; e++) {
    if ((d * e) % phi === 1) {
      return e;
    }
  }
  return null;
}

primeArray = isPrimeArray();

primeArray.forEach((prime) => {
  const option = document.createElement("option");
  option.value = prime;
  option.textContent = prime;
  pValue.appendChild(option);
});

primeArray.forEach((prime) => {
  const option = document.createElement("option");
  option.value = prime;
  option.textContent = prime;
  qValue.appendChild(option);
});

pValue.value = primeArray[0];
qValue.value = primeArray[1];

function pEquelQ() {
  const step = inputSection.querySelectorAll(".step");
  const warning = step[0].querySelector(".warning");

  if (pValue.value !== qValue.value) {
    warning.classList.add("visible");
    return false;
  }

  warning.classList.remove("visible");
  return true;
}

pEquelQ();

function getValueN() {
  return pValue.value * qValue.value;
}

function getValuePhi() {
  return (pValue.value - 1) * (qValue.value - 1);
}

function solveFirst() {
  if (pEquelQ()) return;
  nValue.value = getValueN();
  phiValue.value = getValuePhi();

  gcdArray = isGcdArray(phiValue.value);
  dValue.innerHTML = "";
  gcdArray.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    dValue.appendChild(option);
  });
  solveSecond();
}

function solveSecond() {
  if (pEquelQ()) return;
  eValue.value = modInverse(dValue.value, phiValue.value);
  publicKey.value = `${eValue.value}; ${nValue.value}`;
  privateKey.value = `${dValue.value}; ${nValue.value}`;
}

pValue.addEventListener("change", (e) => {
  solveFirst();
});

qValue.addEventListener("change", (e) => {
  solveFirst();
});

dValue.addEventListener("change", (e) => {
  solveSecond();
});
