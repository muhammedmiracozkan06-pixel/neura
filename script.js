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
        alert("Giriş sırasında bir hata oluştu.");
    }
};

window.enterAsGuest = () => {
    if (!isVerified) return alert("Lütfen önce doğrulama yapın.");
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    addMsg(`Selam ${name}! Ben Neura ne sormak istersin? uyarı bazı modeller gemma gibi çalışmayabilir ve çok normaldir..`, "bot");
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

    const loadDiv = addMsg("Düşünüyorum...", "bot");
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
                    { role: "system", content: "türkçede akıcı ol hata yapma verilerin doğruluğunu kontrol et.ayrıca gerektiğinde duygusal veya mutlu ol dost gibi davran bol bol duruma göre emoji kullan." },
                    { role: "user", content: val }
                ]
            })
        });

        const data = await r.json();
        loadDiv.remove();

        if (data.choices && data.choices[0]) {
            addMsg(data.choices[0].message.content, "bot");
        } else {
            addMsg("Bir hata oluştu sayfayı yenilemeyi deneyin.", "bot");
        }
    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Bağlantı kesildi ", "bot");
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
