const GK = "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";
let isLoading = false;

/* GOOGLE LOGIN */
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, "Google");
    } catch {
        alert("Giriş yapılamadı.");
    }
};

/* MİSAFİR GİRİŞİ */
window.enterAsGuest = () => {
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    addMsg(`Selam ${name}, Neura MAX hazır. Sana nasıl yardımcı olabilirim?`, "bot");
}

/* CHAT FONKSİYONU */
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    const loadDiv = addMsg("Yanıt oluşturuluyor...", "bot");

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GK}`
            },
            body: JSON.stringify({
                model: document.getElementById("model-select").value,
                messages: [
                    { role: "system", content: "Sen Neura MAX'sin. Wind Developer tarafından geliştirilmiş profesyonel bir yapay zeka asistanısın." },
                    { role: "user", content: val }
                ]
            })
        });

        const data = await r.json();
        loadDiv.remove();
        if (data.choices && data.choices[0]) {
            addMsg(data.choices[0].message.content, "bot");
        }
    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Bağlantı hatası.", "bot");
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

document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
