const m3u =
"https://raw.githubusercontent.com/shamimpipon/Shamim-live-tv/main/Channel.m3u";

fetch(m3u)
.then(res => res.text())
.then(data => {

const lines = data.split("\n");
const container = document.getElementById("channels");

for(let i = 0; i < lines.length; i++){

if(lines[i].startsWith("#EXTINF")){

const info = lines[i];

const logo =
info.match(/tvg-logo="(.*?)"/)?.[1];

const name =
info.split(",")[1];

const url = lines[i+1];

container.innerHTML += `

<div class="card">

<button class="edit"
onclick="editChannel('${url}','${name}','${logo}')">
Edit
</button>
<img src="${logo}">

<div class="name">
${name}
</div>

</div>

`;

}

}

});

function editChannel(oldUrl){

const newUrl =
prompt("Enter New URL", oldUrl);

if(newUrl){

alert(newUrl);

}

}

async function updateGithub(oldUrl,newUrl){

const token = "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";

const api =
"https://api.github.com/repos/shamimpipon/Shamim-live-tv/contents/Channel.m3u";

try{

const response = await fetch(api,{
headers:{
Authorization:`token ${token}`
}
});

const data = await response.json();

let content = atob(data.content);

content = content.replace(oldUrl,newUrl);

const updated = btoa(content);

await fetch(api,{
method:"PUT",
headers:{
Authorization:`token ${token}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Channel URL Updated",
content:updated,
sha:data.sha
})
});

alert("Channel Updated Successfully");

location.reload();

}catch(error){

alert("Update Failed");

console.log(error);

}

}
let currentOldUrl = "";

function editChannel(url,name="",logo=""){

currentOldUrl = url;

document.getElementById("popup").style.display="flex";

document.getElementById("channelName").value=name;

document.getElementById("channelUrl").value=url;

document.getElementById("channelLogo").value=logo;

}

function closePopup(){

document.getElementById("popup").style.display="none";

}

function copyLink(){

navigator.clipboard.writeText(
document.getElementById("channelUrl").value
);

alert("Link Copied");

}

function copyLogo(){

navigator.clipboard.writeText(
document.getElementById("channelLogo").value
);

alert("Logo Copied");

}

function saveChannel(){

const newUrl =
document.getElementById("channelUrl").value;

updateGithub(currentOldUrl,newUrl);

}

