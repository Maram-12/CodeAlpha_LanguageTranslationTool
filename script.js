// DOM Elements
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const translateBtn = document.getElementById('translateBtn');
const alertBox = document.getElementById('alert');

// Show alert message
function showAlert(message, isError = false) {
    alertBox.textContent = message;
    alertBox.className = isError ? 'alert error' : 'alert';
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}

// Copy text function
copyBtn.addEventListener('click', async () => {
    const outputText = document.getElementById('outputText');
    const text = outputText.value.trim();
    
    if (!text) {
        showAlert('Nothing to copy!', true);
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showAlert('Copied to clipboard!');
    } catch (err) {
        // Fallback for browsers without clipboard API
        outputText.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showAlert('Copied to clipboard!');
            } else {
                throw new Error('Copy failed');
            }
        } catch (err) {
            showAlert('Failed to copy text', true);
        }
    }
});

// Text-to-speech function
speakBtn.addEventListener('click', () => {
    const outputText = document.getElementById('outputText');
    const text = outputText.value.trim();
    const targetLang = document.getElementById('targetLang').value;

    if (!text) {
        showAlert('Nothing to speak!', true);
        return;
    }

    if (!targetLang) {
        showAlert('Please select target language', true);
        return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    
    utterance.onerror = (event) => {
        showAlert('Speech synthesis failed', true);
        console.error('SpeechSynthesis error:', event);
    };
    
    speechSynthesis.speak(utterance);
});

// Translate function
translateBtn.addEventListener('click', async () => {
    const input = document.getElementById('inputText').value.trim();
    const target = document.getElementById('targetLang').value;
    const source = document.getElementById('sourceLang').value;
    const output = document.getElementById('outputText');

    // Validation
    if (!input) {
        showAlert('Please enter some text', true);
        return;
    }
    if (!source || !target) {
        showAlert('Please select both languages', true);
        return;
    }
    if (source === target) {
        showAlert('Source and target languages must be different', true);
        return;
    }

    try {
        output.value = 'Translating...';
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${source}|${target}`
        );
        
        const data = await response.json();
        
        if (data.responseData) {
            output.value = data.responseData.translatedText;
        } else {
            throw new Error(data.responseDetails || 'Translation failed');
        }
    } catch (error) {
        output.value = '';
        showAlert(error.message, true);
        console.error('Translation error:', error);
    }
});