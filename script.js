let isVerified = false;
let isLoading = false;

/* AUTH İŞLEMLERİ */
window.unlock = (token) => {
    if (!token) return;
    isVerified = true;
    document.getElementById("captcha-box").classList.add("hidden");
    document.getElementById("login-options").classList.remove("hidden");
};

window.onSignIn = (resp) => {
    try {
        if (!resp.credential) return;
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, "Google");
    } catch {
        alert("Giriş başarısız.");
    }
};

window.enterAsGuest = () => {
    if (!isVerified) return;
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    addMessage("Hoş geldin " + name + ". Size nasıl yardımcı olabilirim?", "bot");
}

/* ARAMA İŞLEMİ (DUCKDUCKGO) */
async function talk() {
    if (isLoading) return;

    const input = document.getElementById("q");
    const query = input.value.trim();
    if (!query) return;

    isLoading = true;
    input.value = "";
    addMessage(query, "user");

    const statusContainer = document.getElementById("status-container");
    const statusDiv = document.createElement("div");
    statusDiv.className = "searching";
    statusDiv.innerHTML = "Bilgi getiriliyor...";
    statusContainer.appendChild(statusDiv);

    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const response = await fetch(url);
        const data = await response.json();

        statusDiv.remove();

        if (data.AbstractText) {
            addMessage(data.AbstractText, "bot");
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            addMessage(data.RelatedTopics[0].Text, "bot");
        } else {
            addMessage("Üzgünüm, bu konu hakkında sonuç bulunamadı.", "bot");
        }
    } catch (error) {
        if (statusDiv) statusDiv.remove();
        addMessage("Bağlantı hatası oluştu.", "bot");
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

document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Enter") talk();
});
