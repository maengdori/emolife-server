import {api,$} from "/common/utils.js";

async function load(){
  const params=new URLSearchParams(location.search);
  const id=params.get("id");
  const posts=await api("/data/posts.json");
  const p=posts.find(x=>x.id==id);
  $("#app").innerHTML=p?`<h2>${p.title}</h2><p>${p.summary}</p>`:"Not found";
}
load();
