const GK = "gsk_7GisY7RNoHkLInxH6e10WGdyb3FYd2uX5YmRzX6n3R5pM6q8n9"; // Groq Key
const GEMINI_KEY = "AIzaSyCvikyJSVr1Bv2wPWdsG5OjCtMA3RWD-eQ"; // Gemini Key

// --- GİRİŞ SİSTEMİ ---
function onSignIn(response) {
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    document.getElementById("u-tag").innerText = ` | ${data.given_name}`;
    document.getElementById("auth-overlay").style.display = "none";
}

function enterAsGuest() {
    document.getElementById("u-tag").innerText = " | Misafir";
    document.getElementById("auth-overlay").style.display = "none";
}

// --- KONUŞMA SİSTEMİ ---
async function talk() {
    const prompt = document.getElementById("q").value;
    const model = document.getElementById("model-select").value;
    const chat = document.getElementById("chat");

    if (!prompt) return;

    // Kullanıcı mesajını ekrana bas
    chat.innerHTML += `<div class="msg user"><b>Siz:</b> ${prompt}</div>`;
    document.getElementById("q").value = "";

    try {
        let reply = "";

        if (model.includes("gemma")) {
            // Google Gemini API İsteği
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b-it:generateContent?key=${GEMINI_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            reply = data.candidates[0].content.parts[0].text;
        } else {
            // Groq (Llama) API İsteği
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GK}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "Yardımcı bir asistansın." },
                        { role: "user", content: prompt }
                    ]
                })
            });
            const data = await response.json();
            reply = data.choices[0].message.content;
        }

        chat.innerHTML += `<div class="msg ai"><b>Neura MAX:</b> ${reply}</div>`;

    } catch (e) {
        console.error(e);
        chat.innerHTML += `<div class="msg error">Hata: Bağlantı kurulamadı veya API anahtarı hatalı.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
}
