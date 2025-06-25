async function translateText() {
  const input = document.getElementById("inputText").value;
  const target = document.getElementById("targetLang").value;
  const output = document.getElementById("outputText");

  if (!input.trim()) {
    output.value = "Please enter some text.";
    return;
  }

  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: input,
      source: "auto",
      target: target,
      format: "text",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    output.value = data.translatedText;
  } else {
    output.value = "Translation failed!";
  }
}

function copyText() {
  const output = document.getElementById("outputText");
  navigator.clipboard.writeText(output.value).then(() => {
    alert("Copied!");
  });
}

function speakText() {
  const text = document.getElementById("outputText").value;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
