import {api,$} from "/common/utils.js";

async function load(){
  const posts=await api("/data/posts.json");
  const app=$("#app");
  app.innerHTML=posts.map(p=>`
    <div class='post' onclick="location.href='/post-detail/?id=${p.id}'">
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
    </div>
  `).join('');
}
load();
