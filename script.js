let isLoading = false;

// Google Giriş Başarılı Olunca Çalışacak Fonksiyon
window.handleCredentialResponse = function(response) {
    // Google'dan gelen veriyi çöz
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    // Arayüzü Değiştir
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("user-display").textContent = `| ${payload.name}`;
    
    // Kayıtlı API anahtarı varsa getir
    const savedKey = localStorage.getItem("neura_key");
    if(savedKey) document.getElementById("api-key").value = savedKey;
    
    addMessage(`Hoş geldin ${payload.name}! Bugün sana nasıl yardımcı olabilirim?`, "bot");
};

async function talk() {
    if (isLoading) return;

    const input = document.getElementById("q");
    const apiKey = document.getElementById("api-key").value.trim();
    const model = document.getElementById("model-select").value;
    const query = input.value.trim();

    if (!query) return;
    if (!apiKey) {
        addMessage("Lütfen üstteki kutuya OpenRouter API anahtarını girin!", "bot");
        return;
    }

    localStorage.setItem("neura_key", apiKey);
    isLoading = true;
    input.value = "";
    addMessage(query, "user");
    
    const status = document.getElementById("status");
    status.innerHTML = `<div class="status-text">${model} yanıt hazırlıyor...</div>`;

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
            addMessage("Hata: " + (data.error?.message || "Bir sorun oluştu."), "bot");
        }
    } catch (e) {
        status.innerHTML = "";
        addMessage("Bağlantı kurulamadı!", "bot");
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
