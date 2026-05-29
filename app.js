const m3u = "https://raw.githubusercontent.com/shamimpipon/Shamim-live-tv/main/Channel.m3u";

// Base64 ডিকোডিং এর জন্য ফাংশন
function decodeBase64(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

fetch(m3u)
    .then(res => res.text())
    .then(data => {
        const lines = data.split("\n");
        const container = document.getElementById("channels");
        let htmlContent = ""; // পারফরম্যান্সের জন্য স্ট্রিং ব্যবহার করছি

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("#EXTINF")) {
                const info = lines[i];
                const logo = info.match(/tvg-logo="(.*?)"/)?.[1] || "";
                const name = info.split(",")[1] || "No Name";
                const url = (lines[i + 1] || "").trim();

                htmlContent += `
                <div class="card">
                    <button class="edit" onclick="editChannel('${url}','${name}','${logo}')">EDIT</button>
                    <img src="${logo}">
                    <div class="name">${name}</div>
                </div>`;
            }
        }
        container.innerHTML = htmlContent;
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        alert("প্রাথমিক লিস্ট লোড করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ চেক করুন।");
    });

let currentOldUrl = "";

function editChannel(url, name = "", logo = "") {
    currentOldUrl = url;
    document.getElementById("popup").style.display = "flex";
    document.getElementById("channelName").value = name;
    document.getElementById("channelUrl").value = url;
    document.getElementById("channelLogo").value = logo;
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function copyLink() {
    navigator.clipboard.writeText(document.getElementById("channelUrl").value);
    alert("Link Copied");
}

function copyLogo() {
    navigator.clipboard.writeText(document.getElementById("channelLogo").value);
    alert("Logo Copied");
}

function saveChannel() {
    const newUrl = document.getElementById("channelUrl").value;
    updateGithub(currentOldUrl, newUrl);
}

async function updateGithub(oldUrl, newUrl) {
    const token = "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"; // এখানে টোকেন দিন
    const owner = "shamimpipon";
    const repo = "Shamim-live-tv";
    const path = "Channel.m3u";
    const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        // ১. ফাইল রিড করা
        const response = await fetch(api, {
            method: "GET",
            headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
        });

        if (!response.ok) throw new Error("ফাইলটি GitHub থেকে লোড করা সম্ভব হয়নি।");

        const data = await response.json();
        let content = decodeBase64(data.content);
        
        // ২. ফাইল আপডেট করা
        content = content.replace(oldUrl, newUrl);

        // ৩. GitHub-এ পুশ করা
        const upload = await fetch(api, {
            method: "PUT",
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Channel Updated via Panel",
                content: btoa(unescape(encodeURIComponent(content))),
                sha: data.sha
            })
        });

        const result = await upload.json();
        if (result.commit) {
            alert("Update Success!");
            location.reload();
        } else {
            alert("Update Failed: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

