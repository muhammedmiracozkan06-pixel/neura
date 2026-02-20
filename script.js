// 🔑 GÜVENLİ VE GÜNCEL ANAHTAR
const GK = "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";

let isVerified = false;
let isLoading = false;

/* CAPTCHA DOĞRULAMA */
window.unlock = (token) => {
    if (!token) return;
    isVerified = true;
    document.getElementById("captcha-box").classList.add("hidden");
    document.getElementById("login-options").classList.remove("hidden");
};

/* GOOGLE LOGIN SİSTEMİ */
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, "Google");
    } catch {
        alert("Kimlik doğrulama işlemi sırasında bir hata oluştu.");
    }
};

window.enterAsGuest = () => {
    if (!isVerified) return alert("Devam etmek için lütfen güvenlik doğrulamasını tamamlayınız.");
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    // Kurumsal ve profesyonel karşılama
    addMsg(`Sayın ${name}, Neura MAX sistemine hoş geldiniz. Size nasıl yardımcı olabilirim? Not: Seçilen modele bağlı olarak yanıt süreleri değişiklik gösterebilir.`, "bot");
}

/* CHAT FONKSİYONU */
async function talk() {
    if (isLoading) return;

    const qInput = document.getElementById("q");
    const modelSelect = document.getElementById("model-select");
    const val = qInput.value.trim();

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    const loadDiv = addMsg("Yanıt oluşturuluyor...", "bot");
    const selectedModel = modelSelect.value;

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GK}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    { 
                        role: "system", 
                        content: "Sen Neura MAX'sin. Wind Developer tarafından geliştirilmiş profesyonel bir yapay zeka asistanısın. Yanıtlarında akıcı, bilgilendirici ve kurumsal bir dil kullan. Gerektiğinde profesyonelliği bozmadan uygun emojilerle yanıtlarını zenginleştir." 
                    },
                    { role: "user", content: val }
                ]
            })
        });

        const data = await r.json();
        loadDiv.remove();

        if (data.choices && data.choices[0]) {
            addMsg(data.choices[0].message.content, "bot");
        } else {
            addMsg("Sistem şu anda yanıt veremiyor. Lütfen kısa süre sonra tekrar deneyiniz.", "bot");
        }
    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Bağlantı hatası: Sunucu ile iletişim kurulamadı.", "bot");
    }

    isLoading = false;
}

function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.textContent = txt;
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

// Enter tuşu desteği
document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
