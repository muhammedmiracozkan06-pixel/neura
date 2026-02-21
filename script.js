const GK = "gsk_7GisY7RNoHkLInxH6e10WGdyb3FYd2uX5YmRzX6n3R5pM6q8n9";

function enterApp() {
    document.getElementById("auth-overlay").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("auth-overlay").style.display = "none";
    }, 500);
    document.getElementById("u-tag").innerText = " | Misafir";
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const chat = document.getElementById("chat-container");
    const model = document.getElementById("model-select").value;
    const text = input.value.trim();

    if (!text) return;

    // Kullanıcı mesajı
    chat.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GK}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: text }]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // AI mesajı
        chat.innerHTML += `<div class="msg ai"><b>Neura MAX:</b><br>${reply}</div>`;
    } catch (error) {
        chat.innerHTML += `<div class="msg ai" style="color: red;">Hata: Bağlantı kesildi.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
}

// Enter tuşu ile gönderme
document.getElementById("user-input")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
