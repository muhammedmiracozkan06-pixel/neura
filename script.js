const GK = "gsk_7GisY7RNoHkLInxH6e10WGdyb3FYd2uX5YmRzX6n3R5pM6q8n9";
const GEMINI_KEY = "AIzaSyCvikyJSVr1Bv2wPWdsG5OjCtMA3RWD-eQ";

// Siyah ekranı kaldıran ana fonksiyon
function closeOverlay(userName) {
    const overlay = document.getElementById("auth-overlay");
    const uTag = document.getElementById("u-tag");
    if (overlay) overlay.style.display = "none";
    if (uTag) uTag.innerText = ` | ${userName}`;
}

// Google Giriş Fonksiyonu
function onSignIn(response) {
    try {
        const data = JSON.parse(atob(response.credential.split('.')[1]));
        closeOverlay(data.given_name);
    } catch (e) {
        console.error("Giriş hatası:", e);
        closeOverlay("Kullanıcı");
    }
}

// Misafir Giriş Fonksiyonu
function enterAsGuest() {
    closeOverlay("Misafir");
}

// Konuşma Fonksiyonu
async function talk() {
    const promptInput = document.getElementById("q");
    const prompt = promptInput.value.trim();
    const model = document.getElementById("model-select").value;
    const chat = document.getElementById("chat");

    if (!prompt) return;

    chat.innerHTML += `<div class="msg user"><b>Siz:</b> ${prompt}</div>`;
    promptInput.value = "";

    try {
        let reply = "";

        if (model.includes("gemma")) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b-it:generateContent?key=${GEMINI_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await res.json();
            reply = data.candidates[0].content.parts[0].text;
        } else {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GK}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "system", content: "Yardımcı bir asistansın." }, { role: "user", content: prompt }]
                })
            });
            const data = await res.json();
            reply = data.choices[0].message.content;
        }

        chat.innerHTML += `<div class="msg ai"><b>Neura MAX:</b> ${reply}</div>`;
    } catch (e) {
        chat.innerHTML += `<div class="msg error">Hata: Mesaj gönderilemedi.</div>`;
        console.error(e);
    }
    chat.scrollTop = chat.scrollHeight;
}
