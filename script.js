let chart;
let history = [];

// LOGIN
function login(){
  if(
    document.getElementById("user").value==="admin" &&
    document.getElementById("pass").value==="2026"
  ){
    document.getElementById("loginScreen").style.display="none";
    document.getElementById("app").style.display="flex";
  } else {
    alert("Wrong login");
  }
}

// NAV
function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
}

// DATA
const data={
  tiktok:{name:"TikTok",cpm:6,ctr:1.4,conv:0.9},
  instagram:{name:"Instagram",cpm:7,ctr:1.6,conv:1.2},
  snapchat:{name:"Snapchat",cpm:5,ctr:1.1,conv:1.3},
  facebook:{name:"Facebook",cpm:6,ctr:1.0,conv:1.5},
  linkedin:{name:"LinkedIn",cpm:10,ctr:0.8,conv:2.0}
};

// 🎯 CAMPAIGN LOGIC
const campaignImpact = {
  awareness: { ctr:1.3, conv:0.6, roi:0.8 },
  traffic: { ctr:1.5, conv:0.8, roi:1.0 },
  leads: { ctr:1.0, conv:1.2, roi:1.3 },
  sales: { ctr:0.8, conv:1.5, roi:1.6 }
};

// 🧠 REASON
function reason(p, type){
  return `${p} performs best for ${type} campaigns due to audience behavior and cost efficiency`;
}

// 🚀 RUN
function runCampaign(){

  const budget=+document.getElementById("budget").value;
  const age=document.getElementById("age").value;
  const type=document.getElementById("campaignType").value;
  const selected=document.querySelectorAll(".platform:checked");

  if(!budget||!selected.length){
    alert("Fill all fields");
    return;
  }

  const ageFactor={
    "13-17":{tiktok:1.2,snapchat:1.2,instagram:1.1,facebook:0.7,linkedin:0.5},
    "18-24":{tiktok:1.3,instagram:1.2,snapchat:1.1,facebook:0.8,linkedin:0.6},
    "25-34":{instagram:1.2,facebook:1.1,linkedin:1.0,tiktok:0.9,snapchat:0.8},
    "35-44":{facebook:1.2,linkedin:1.1,instagram:0.9,tiktok:0.6,snapchat:0.6},
    "45+":{facebook:1.3,linkedin:1.2,instagram:0.8,tiktok:0.5,snapchat:0.5}
  };

  let results=[];

  selected.forEach(p=>{

    let d=data[p.value];
    let factor=ageFactor[age][p.value]||1;
    let camp=campaignImpact[type];

    let variation=0.9+Math.random()*0.2;

    let ctr=d.ctr*factor*camp.ctr*variation;
    let convRate=d.conv*factor*camp.conv;

    let impressions=(budget/d.cpm)*1000;
    let clicks=impressions*(ctr/100);
    let conversions=clicks*(convRate/10);

    let roi=(conversions*15*camp.roi)-budget;
    let cpa=budget/conversions;

    let score=(conversions*15)-(cpa*2);

    results.push({
      name:d.name,
      score:Math.round(score),
      roi:Math.round(roi),
      conv:Math.round(conversions)
    });
  });

  let best=results.reduce((a,b)=>a.score>b.score?a:b);

  history.push({
    time:new Date().toLocaleString(),
    platform:best.name,
    type:type,
    roi:best.roi,
    conv:best.conv
  });

  document.getElementById("output").innerHTML=`
    <h3>${best.name}</h3>
    <p>Campaign: ${type}</p>
    <p>Conversions: ${best.conv}</p>
    <p>ROI: ${best.roi}</p>
    <p>${reason(best.name,type)}</p>
  `;

  document.getElementById("historyBox").innerHTML=
  history.map(h=>`
    <div>${h.time} | ${h.platform} | ${h.type}</div>
  `).join("");

  if(chart) chart.destroy();

  chart=new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:results.map(r=>r.name),
      datasets:[{
        label:"Score",
        data:results.map(r=>r.score)
      }]
    }
  });
}

// RESET
function resetCampaign(){
  document.getElementById("budget").value="";
  document.querySelectorAll(".platform").forEach(p=>p.checked=false);
  document.getElementById("output").innerHTML="";
  if(chart) chart.destroy();
}

// 📄 EXPORT WORD
function exportWord(){

  if(history.length===0){
    alert("No data");
    return;
  }

  let content="<h1>Campaign AI Report</h1><table border='1'><tr><th>Time</th><th>Platform</th><th>Type</th><th>ROI</th></tr>";

  history.forEach(h=>{
    content+=`<tr><td>${h.time}</td><td>${h.platform}</td><td>${h.type}</td><td>${h.roi}</td></tr>`;
  });

  content+="</table>";

  let blob=new Blob(['\ufeff',content],{type:'application/msword'});
  let url=URL.createObjectURL(blob);

  let a=document.createElement("a");
  a.href=url;
  a.download="Campaign_AI_Report.doc";
  a.click();
}