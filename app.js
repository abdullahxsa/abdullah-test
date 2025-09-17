const KEY = "trips_v1";
function load(){ try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]} }
function save(x){ localStorage.setItem(KEY, JSON.stringify(x)); }
const el = id=>document.getElementById(id);
const rowsEl=el("rows"),sumIncomeEl=el("sumIncome"),sumCostsEl=el("sumCosts"),sumProfitEl=el("sumProfit"),countNoteEl=el("countNote");
const dateEl=el("date"),incomeEl=el("income"),gasEl=el("gas"),platformEl=el("platform"),otherEl=el("other"),ridesEl=el("rides"),hoursEl=el("hours");
const groupByEl=el("groupBy"),fromEl=el("fromDate"),toEl=el("toDate");
let data=load();
const toISO=d=>new Date(d).toISOString().slice(0,10); const todayISO=()=>toISO(new Date());
function compute(e){ const income=+e.income||0; const platformFee=income*((+e.platform||0)/100); const costs=(+e.gas||0)+(+e.other||0)+platformFee; return {income,costs,profit:income-costs}; }
function addEntry(ev){ ev&&ev.preventDefault(); const item={ id:crypto.randomUUID(), date:dateEl.value||todayISO(), income:+incomeEl.value||0, gas:+gasEl.value||0, platform:+platformEl.value||0, other:+otherEl.value||0, rides:+ridesEl.value||0, hours:+hoursEl.value||0 }; data.push(item); save(data); clearForm(); render(); }
function removeEntry(id){ data=data.filter(x=>x.id!==id); save(data); render(); }
function addDemo(){ const t=new Date(); const rnd=(a,b)=>Math.round(a+Math.random()*(b-a)); for(let i=0;i<8;i++){ const d=new Date(t); d.setDate(d.getDate()-i); data.push({ id:crypto.randomUUID(), date:toISO(d), income:rnd(180,320), gas:rnd(20,55), platform:25, other:rnd(0,20), rides:rnd(8,18), hours:+(Math.random()*6+3).toFixed(1) }); } save(data); render(); }
function clearForm(){ incomeEl.value=gasEl.value=platformEl.value=otherEl.value=ridesEl.value=hoursEl.value=""; dateEl.value=todayISO(); }
function inRange(d,f,to){ const x=toISO(d); return (!f||x>=f)&&(!to||x<=to); }
function applyFilters(list){ const mode=groupByEl.value; const from=fromEl.value||null; const to=toEl.value||null; if(mode==="range")return list.filter(x=>inRange(x.date,from,to)); if(mode==="all")return list;
  const now=new Date(); let s=null,e=null;
  if(mode==="day"){ s=toISO(now); e=toISO(now);}
  else if(mode==="week"){ const n=new Date(now); const day=(n.getDay()+6)%7; const st=new Date(n); st.setDate(n.getDate()-day); const en=new Date(st); en.setDate(st.getDate()+6); s=toISO(st); e=toISO(en);}
  else if(mode==="month"){ const st=new Date(now.getFullYear(),now.getMonth(),1); const en=new Date(now.getFullYear(),now.getMonth()+1,0); s=toISO(st); e=toISO(en);}
  else if(mode==="year"){ const st=new Date(now.getFullYear(),0,1); const en=new Date(now.getFullYear(),11,31); s=toISO(st); e=toISO(en);}
  return list.filter(x=>inRange(x.date,s,e));
}
function exportCSV(list){ const headers=["date","income","gas","platform","other","profit","rides","hours"]; const lines=[headers.join(",")];
  list.forEach(x=>{ const {profit}=compute(x); lines.push([x.date,x.income,x.gas,x.platform,x.other,profit.toFixed(2),x.rides,x.hours].join(",")); });
  const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8;"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="trips.csv"; a.click(); URL.revokeObjectURL(a.href);
}
function render(){ const list=applyFilters([...data].sort((a,b)=>b.date.localeCompare(a.date))); rowsEl.innerHTML=""; let ti=0,tc=0,tp=0;
  list.forEach(x=>{ const {income,costs,profit}=compute(x); ti+=income; tc+=costs; tp+=profit;
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${x.date}</td><td>${income.toFixed(2)}</td><td>${(+x.gas||0).toFixed(2)}</td><td>${(+x.platform||0).toFixed(1)}%</td><td>${(+x.other||0).toFixed(2)}</td><td class="${profit>=0?"ok":"bad"}">${profit.toFixed(2)}</td><td>${x.rides||0}</td><td>${x.hours||0}</td><td><button class="btn warn" data-id="${x.id}">حذف</button></td>`;
    rowsEl.appendChild(tr);
  });
  sumIncomeEl.textContent=ti.toFixed(2); sumCostsEl.textContent=tc.toFixed(2); sumProfitEl.textContent=tp.toFixed(2); countNoteEl.textContent=`${list.length} سجل`;
  rowsEl.querySelectorAll("button[data-id]").forEach(b=>b.addEventListener("click",()=>removeEntry(b.dataset.id)));
}
document.getElementById("addBtn").addEventListener("click",addEntry);
document.getElementById("demoBtn").addEventListener("click",addDemo);
document.getElementById("clearAllBtn").addEventListener("click",()=>{ if(confirm("متأكد من حذف كل السجلات؟")){ data=[]; save(data); render(); }});
document.getElementById("applyFilters").addEventListener("click",render);
document.getElementById("resetFilters").addEventListener("click",()=>{ groupByEl.value="all"; fromEl.value=""; toEl.value=""; render(); });
document.getElementById("exportCsv").addEventListener("click",()=>exportCSV(applyFilters(data)));
dateEl.value=todayISO(); render();
