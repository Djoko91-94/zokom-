// 1. Définition du taux de conversion (ex: 1 Euro = 160 Yens)
const RATE_EUR_TO_JPY = 160;

// 2. Récupération des éléments du HTML dans le fichier JS
const amountInput = document.getElementById('amount');
const directionSelect = document.getElementById('direction');
const convertBtn = document.getElementById('convertBtn');
const resultText = document.getElementById('resultText');

// 3. Fonction qui réalise le calcul
function convertCurrency() {
    // Récupérer la valeur saisie et la transformer en nombre
    const amount = parseFloat(amountInput.value);
    const direction = directionSelect.value;

    // Vérifier si la valeur entrée est un nombre valide
    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = "Veuillez entrer un montant valide.";
        return;
    }

    let result = 0;

    // Calcul selon le sens sélectionné
    if (direction === 'jpyToEur') {
        // Yen vers Euro : on divise par le taux
        result = amount / RATE_EUR_TO_JPY;
        resultText.textContent = `Résultat : ${result.toFixed(2)} €`;
    } else {
        // Euro vers Yen : on multiplie par le taux
        result = amount * RATE_EUR_TO_JPY;
        resultText.textContent = `Résultat : ${Math.round(result)} ¥`;
    }
}

// 4. Écouter le clic sur le bouton "Convertir"
convertBtn.addEventListener('click', convertCurrency);

// 5. Exécuter un premier calcul au chargement de la page
convertCurrency();