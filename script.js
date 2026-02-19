let isRobotVerified = false;
let isLoading = false;

// 1. ADIM: Captcha Başarılı Olunca
window.onCaptchaSuccess = function(token) {
    isRobotVerified = true;
    document.getElementById("captcha-container").classList.add("hidden");
    document.getElementById("login-container").classList.remove("hidden");
};

// 2. ADIM: Google Giriş Başarılı Olunca
window.handleCredentialResponse = function(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("user-display").textContent = `| ${payload.name}`;
    
    // Varsa eski API Key'i yükle
    const savedKey = localStorage.getItem("neura_key");
    if(savedKey) document.getElementById("api-key").value = savedKey;
    
    addMessage(`Hoş geldin ${payload.name}! Neura Max hizmetinizde.`, "bot");
};

// 3. ADIM: Arama/Sohbet Fonksiyonu (OpenRouter)
async function talk() {
    if (isLoading) return;

    const input = document.getElementById("q");
    const apiKey = document.getElementById("api-key").value.trim();
    const model = document.getElementById("model-select").value;
    const query = input.value.trim();

    if (!query) return;
    if (!apiKey) {
        addMessage("Lütfen API anahtarını girin!", "bot");
        return;
    }

    localStorage.setItem("neura_key", apiKey);
    isLoading = true;
    input.value = "";
    addMessage(query, "user");
    
    const status = document.getElementById("status");
    status.innerHTML = `<div class="status-text">${model} işleniyor...</div>`;

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: query }]
            })
        });

        const data = await res.json();
        status.innerHTML = "";

        if (data.choices) {
            addMessage(data.choices[0].message.content, "bot");
        } else {
            addMessage("Hata: " + (data.error?.message || "Servis yanıt vermedi."), "bot");
        }
    } catch (e) {
        status.innerHTML = "";
        addMessage("Bağlantı hatası!", "bot");
    }
    isLoading = false;
}

function addMessage(text, side) {
    const div = document.createElement("div");
    div.className = `msg ${side}`;
    div.textContent = text;
    const chat = document.getElementById("chat");
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.getElementById("q").addEventListener("keydown", (e) => { if(e.key === "Enter") talk(); });
