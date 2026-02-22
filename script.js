const GK = "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";
let currentModel = "oto";
let selectedFiles = [];

// Model Seçimi
function setModel(m) {
    currentModel = m;
    document.querySelectorAll('.model-selectors button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + m).classList.add('active');
}

// Otomatik Büyüyen Textarea
function autoGrow(el) {
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

// Yan Panel Aç/Kapat
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Görsel Seçimi (Maks 2 tane)
function handleFiles(input) {
    const files = Array.from(input.files).slice(0, 2);
    selectedFiles = [];
    document.getElementById('preview-area').innerHTML = "";
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedFiles.push(e.target.result); // Base64
            const img = document.createElement('img');
            img.className = 'preview-img';
            img.src = e.target.result;
            document.getElementById('preview-area').appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

async function talk() {
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    if (!val && selectedFiles.length === 0) return;

    addMsg(val, "user");
    qInput.value = "";
    qInput.style.height = "auto";
    document.getElementById('preview-area').innerHTML = "";

    // Model Kararı
    let modelId = "llama-3.3-70b-versatile"; // Pro (Varsayılan)
    if (currentModel === "hizli") modelId = "llama3-8b-8192";
    if (currentModel === "dusunen") modelId = "llama-3.2-11b-vision-preview";
    if (selectedFiles.length > 0) modelId = "llama-3.2-11b-vision-preview"; // Görsel varsa Vision modeline geç
    if (currentModel === "oto") {
        const models = ["llama3-8b-8192", "llama-3.3-70b-versatile"];
        modelId = models[Math.floor(Math.random() * models.length)];
    }

    const loadDiv = addMsg(currentModel === "dusunen" ? "Derinlemesine düşünülüyor..." : "Düşünüyor...", "bot");

    try {
        const content = [{ type: "text", text: val }];
        selectedFiles.forEach(base64 => {
            content.push({ type: "image_url", image_url: { url: base64 } });
        });

        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GK}` },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: "user", content: content }]
            })
        });

        const data = await r.json();
        loadDiv.remove();
        addMsg(data.choices[0].message.content, "bot");
    } catch (e) {
        loadDiv.innerHTML = "Bir hata oluştu.";
    }
    selectedFiles = [];
}

function addMsg(t, c) {
    const d = document.createElement("div");
    d.className = `msg ${c}`;
    d.innerHTML = t.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

// Misafir Girişi Fix
window.enterAsGuest = () => {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('u-tag').textContent = "Misafir Kullanıcı";
    document.getElementById('u-mail').textContent = "misafir@neura.ai";
};

window.onSignIn = (resp) => {
    const payload = JSON.parse(atob(resp.credential.split('.')[1]));
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('u-tag').textContent = payload.name;
    document.getElementById('u-mail').textContent = payload.email;
    document.getElementById('user-pfp').src = payload.picture;
};
