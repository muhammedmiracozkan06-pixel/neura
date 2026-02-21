let isLoading = false;
const GK = "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";

/* GİRİŞ FONKSİYONLARI */
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.given_name, "Google");
    } catch {
        alert("Giriş hatası!");
    }
};

window.enterAsGuest = () => {
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    add("Merhaba " + name + " 👋 Ben Neura MAX. Bugün senin için ne yapabilirim?", "bot");
}

/* CHAT FONKSİYONU */
async function talk() {
    if (isLoading) return;
    const input = document.getElementById("q");
    const txt = input.value.trim();
    const model = document.getElementById("model-select").value;
    if (!txt) return;

    isLoading = true;
    input.value = "";
    add(txt, "user");
    const loadingMsg = add("Düşünüyor...", "bot");

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + GK
            },
            body: JSON.stringify({
                model: model,
                messages: [{role: "user", content: txt}]
            })
        });
        const d = await r.json();
        loadingMsg.remove();
        add(d.choices[0].message.content, "bot");
    } catch {
        loadingMsg.remove();
        add("❗ Bağlantı hatası.", "bot");
    }
    isLoading = false;
}

function add(t, c) {
    const div = document.createElement("div");
    div.className = "msg " + c;
    div.innerHTML = t.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
}

document.getElementById("q").addEventListener("keydown", e => { if(e.key === "Enter") talk(); });
