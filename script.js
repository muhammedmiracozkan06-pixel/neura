const GK = "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";
let currentModel = "oto";
let selectedFiles = [];

function setModel(m) {
    currentModel = m;
    document.querySelectorAll('.model-selectors button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + m).classList.add('active');
}

function autoGrow(el) {
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function handleFiles(input) {
    const files = Array.from(input.files).slice(0, 2);
    selectedFiles = [];
    document.getElementById('preview-area').innerHTML = "";
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedFiles.push(e.target.result);
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

    addMsg(val || "Görsel gönderildi.", "user");
    qInput.value = "";
    qInput.style.height = "auto";
    document.getElementById('preview-area').innerHTML = "";

    let modelId = "llama-3.3-70b-versatile"; // PRO
    if (currentModel === "hizli") modelId = "llama3-8b-8192";
    if (currentModel === "dusunen") modelId = "llama-3.2-11b-vision-preview";
    if (selectedFiles.length > 0) modelId = "llama-3.2-11b-vision-preview";
    if (currentModel === "oto") {
        const mods = ["llama3-8b-8192", "llama-3.3-70b-versatile"];
        modelId = mods[Math.floor(Math.random() * mods.length)];
    }

    const loadDiv = addMsg(currentModel === "dusunen" ? "Neura derinlemesine düşünüyor..." : "Düşünüyor...", "bot");

    try {
        const content = [];
        if (val) content.push({ type: "text", text: val });
        selectedFiles.forEach(b64 => {
            content.push({ type: "image_url", image_url: { url: b64 } });
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
        loadDiv.innerHTML = "Bir hata oluştu patron.";
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

window.enterAsGuest = () => {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    document.getElementById('sidebar-user-info').style.display = 'none'; // Misafirde gizle
    addMsg("Neura MAX-1'e misafir olarak hoş geldin!", "bot");
};

window.onSignIn = (resp) => {
    const payload = JSON.parse(atob(resp.credential.split('.')[1]));
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    const info = document.getElementById('sidebar-user-info');
    info.style.display = 'flex'; // Google ile girince göster
    document.getElementById('u-tag').textContent = payload.name;
    document.getElementById('u-mail').textContent = payload.email;
    document.getElementById('user-pfp').src = payload.picture;
};
