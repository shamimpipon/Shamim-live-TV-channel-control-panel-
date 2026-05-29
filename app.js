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

const owner = "shamimpipon";

const repo = "Shamim-live-tv";

const path = "Channel.m3u";

const api =
`https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

try{

/* GET FILE */

const response = await fetch(api,{
method:"GET",
headers:{
Authorization:`token ${token}`,
Accept:"application/vnd.github.v3+json"
}
});

const data = await response.json();

console.log(data);

if(!data.content){

alert("File Load Failed");

return;

}

let content = atob(data.content);

content = content.replace(oldUrl,newUrl);

/* UPDATE FILE */

const upload = await fetch(api,{
method:"PUT",
headers:{
Authorization:`token ${token}`,
Accept:"application/vnd.github.v3+json",
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Channel Updated",
content:btoa(content),
sha:data.sha
})
});

const result = await upload.json();

console.log(result);

if(result.commit){

alert("Update Success");

location.reload();

}else{

alert("Update Failed");

console.log(result);

}

}catch(error){

console.log(error);

alert("Error");

}

}
