const m3u =
"https://raw.githubusercontent.com/shamimpipon/Shamim-live-tv/main/Channel.m3u";

fetch(m3u)
.then(res => res.text())
.then(data => {

const lines = data.split("\n");

const container =
document.getElementById("channels");

for(let i = 0; i < lines.length; i++){

if(lines[i].startsWith("#EXTINF")){

const info = lines[i];

const logo =
info.match(/tvg-logo="(.*?)"/)?.[1] || "";

const name =
info.split(",")[1] || "No Name";

const url =
(lines[i+1] || "").trim();

container.innerHTML += `

<div class="card">

<button class="edit"
onclick="editChannel('${url}','${name}','${logo}')">
EDIT </button>

<img src="${logo}">

<div class="name">
${name}
</div>

</div>

`;

}

}

});

let currentOldUrl = "";

/* OPEN POPUP */

function editChannel(url,name="",logo=""){

currentOldUrl = url;

document.getElementById("popup").style.display="flex";

document.getElementById("channelName").value=name;

document.getElementById("channelUrl").value=url;

document.getElementById("channelLogo").value=logo;

}

/* CLOSE POPUP */

function closePopup(){

document.getElementById("popup").style.display="none";

}

/* COPY LINK */

function copyLink(){

navigator.clipboard.writeText(
document.getElementById("channelUrl").value
);

alert("Link Copied");

}

/* COPY LOGO */

function copyLogo(){

navigator.clipboard.writeText(
document.getElementById("channelLogo").value
);

alert("Logo Copied");

}

/* SAVE */

function saveChannel(){

const newUrl =
document.getElementById("channelUrl").value;

updateGithub(currentOldUrl,newUrl);

}

/* UPDATE GITHUB */

async function updateGithub(oldUrl,newUrl){

const token = "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";

const api =
"https://api.github.com/repos/shamimpipon/Shamim-live-tv/contents/Channel.m3u";

try{

const response = await fetch(api,{
headers:{
Authorization:`Bearer ${token}`,
Accept:"application/vnd.github+json"
}
});

const data = await response.json();

let content = atob(data.content);

content = content.replace(oldUrl,newUrl);

const updated = btoa(unescape(encodeURIComponent(content)));

const upload = await fetch(api,{
method:"PUT",
headers:{
Authorization:`Bearer ${token}`,
Accept:"application/vnd.github+json",
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Channel Updated",
content:updated,
sha:data.sha
})
});

if(upload.ok){

alert("Update Success");

location.reload();

}else{

alert("GitHub Update Failed");

console.log(await upload.text());

}

}catch(error){

alert("Update Failed");

console.log(error);

}

}
