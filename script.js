const GK = "gsk_7GisY7RNoHkLInxH6e10WGdyb3FYd2uX5YmRzX6n3R5pM6q8n9";

function closeOverlay(userName) {
    const overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.style.display = "none";
    document.getElementById("u-tag").innerText = ` | ${userName}`;
}

function onSignIn(response) {
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    closeOverlay(data.given_name);
}

function enterAsGuest() {
    closeOverlay("Misafir");
}

async function talk() {
    const promptInput = document.getElementById("q");
    const prompt = promptInput.value.trim();
    const model = document.getElementById("model-select").value;
    const chat = document.getElementById("chat");

    if (!prompt) return;

    chat.innerHTML += `<div class="msg user"><b>Siz:</b> ${prompt}</div>`;
    promptInput.value = "";

    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        const data = await res.json();
        const reply = data.choices[0].message.content;
        chat.innerHTML += `<div class="msg ai"><b>Neura MAX:</b> ${reply}</div>`;
    } catch (e) {
        chat.innerHTML += `<div class="msg error">Hata: Mesaj gönderilemedi.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
}
