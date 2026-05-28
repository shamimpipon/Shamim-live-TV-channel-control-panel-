const m3u =
"https://raw.githubusercontent.com/shamimpipon/Shamim-live-tv/main/Channel.m3u";

fetch(m3u)
.then(res=>res.text())
.then(data=>{

const lines=data.split("\n");
const container=document.getElementById("channels");

for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

const info=lines[i];

const logo =
info.match(/tvg-logo="(.*?)"/)?.[1];

const name =
info.split(",")[1];

container.innerHTML += `

<div class="card">

<button class="edit">
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
