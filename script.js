const GK = "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";
let isLoading = false;

// 1. Google Giriş Yanıtı
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        const name = payload.name || "Kullanıcı";
        const photo = payload.picture || "";
        enterApp(name, photo, "Google");
    } catch (e) {
        enterApp("Kullanıcı", "", "Google");
    }
};

// 2. Misafir Giriş Yanıtı
window.enterAsGuest = () => {
    enterApp("guest", "", "Guest");
};

// 3. Uygulamaya Giriş
function enterApp(name, photo, provider) {
    const overlay = document.getElementById("auth-overlay");
    const app = document.getElementById("main-app");
    const uTag = document.getElementById("u-tag");
    const pfpImg = document.getElementById("user-pfp");

    if (overlay) overlay.style.display = "none";
    if (app) app.style.display = "flex";

    if (provider === "Guest") {
        uTag.textContent = name;
        uTag.className = "guest-text";
        pfpImg.classList.add("hidden");
    } else {
        uTag.textContent = name;
        uTag.className = "";
        if (photo) {
            pfpImg.src = photo;
            pfpImg.classList.remove("hidden");
        }
    }
    
    addMsg("Sisteme giriş yapıldı. Hoş geldin " + name + "!", "bot");
}

// 4. Sohbet Fonksiyonu
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const model = document.getElementById("model-select").value;

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");
    const loadDiv = addMsg("Düşünüyor...", "bot");

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GK}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: "Sen yardımcı, nazik ve akıllı bir asistansın. Türkçe konuşuyorsun." },
                    { role: "user", content: val }
                ]
            })
        });

        const data = await r.json();
        loadDiv.remove();
        
        if (data.choices && data.choices[0]) {
            addMsg(data.choices[0].message.content, "bot");
        } else {
            addMsg("Hata: Yanıt alınamadı.", "bot");
        }
    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Bağlantı hatası!", "bot");
    }
    isLoading = false;
}

// 5. Mesaj Ekleme
function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

// Enter Tuşu
document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
