const GK = "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";
let isLoading = false;

window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.given_name, "Google");
    } catch (e) {
        enterApp("Kullanici", "Google");
    }
};

window.enterAsGuest = () => {
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    addMsg("Merhaba " + name + ". Ben Neura MAX. Sana nasil yardimci olabilirim?", "bot");
}

async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const model = document.getElementById("model-select").value;

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");
    const loadDiv = addMsg("Düsünüyor...", "bot");

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
                    { role: "system", content: "Türkçede akici ol ve yardimci davran." },
                    { role: "user", content: val }
                ]
            })
        });

        const data = await r.json();
        loadDiv.remove();
        addMsg(data.choices[0].message.content, "bot");
    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Baglanti hatasi olustu.", "bot");
    }
    isLoading = false;
}

function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
