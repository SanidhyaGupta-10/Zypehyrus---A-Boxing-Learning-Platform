import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{s as h}from"./supabase-client-CZkVvohH.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";const l=window.GuruMedia;function x(e){let t=l.hydrateCatalog(window.techniquesData||{});return l.mergeCustomTechniques(t,l.loadLocalCustom()),e&&e.length&&l.mergeCustomTechniques(t,e),t}function b(e,t){let n=null,o=null;const c=String(t||"").toLowerCase();for(const a of l.CATEGORIES){const p=(e[a]||[]).find(d=>d.id===c);if(p){n=p,o=a;const d={punches:"PUNCHES",stances:"STANCE",kicks:"KICKS",defense:"DEFENSE"};document.getElementById("cat-indicator").innerText=d[a]||a.toUpperCase();break}}return{item:n,categoryKey:o}}function y(e,t,n){if(!e){document.getElementById("tech-title").innerText="Not Found";return}document.getElementById("tech-title").innerText=e.name,document.getElementById("tech-desc").innerText=e.desc||"Technique breakdown loading from combat database.";const o=document.getElementById("tech-img");o.src=e.image,o.onerror=()=>l.onImageError(o,e.name,t);const c="EFFECTIVENESS",a=e.score;document.getElementById("hero-stat-label").innerText=c,document.getElementById("power-bar-fill").style.width=a+"%",document.getElementById("power-val-text").innerText=a+"%",document.getElementById("detail-title").innerText=e.name,document.getElementById("detail-subtitle").innerText=e.subtitle||"Technique Breakdown";const p=document.getElementById("detail-steps");p.innerHTML="",e.steps&&e.steps.forEach((i,r)=>{const f=document.createElement("div");f.className="step-item-v2",f.innerHTML=`
                            <div class="step-num-v2">${r+1}</div>
                            <div class="step-text-v2">${i}</div>
                        `,p.appendChild(f)});const d=document.getElementById("detail-stats");d.innerHTML="",e.stats&&e.stats.forEach(i=>{const r=document.createElement("div");r.className="stat-circle-box",r.innerHTML=`
                            <div class="stat-circle-val">${i.val}</div>
                            <div class="stat-circle-label">${i.label}</div>
                        `,d.appendChild(r)});const m=document.getElementById("advanced-details-container");if(m){if(m.innerHTML="",e.targets&&e.targets.length>0){let i=e.targets.map(r=>`<div style="padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; font-size: 0.65rem; font-weight: 800; color: #fff; text-transform: uppercase;">${r}</div>`).join("");m.innerHTML+=`
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 0.7rem; font-weight: 900; color: #888; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;">PRIMARY TARGETS</div>
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    ${i}
                                </div>
                            </div>
                        `}if(e.pro_tip&&(m.innerHTML+=`
                            <div class="glow-chart-box ripple hover-scale" style="padding: 20px; border-color: rgba(var(--primary-rgb), 0.4); background: rgba(var(--primary-rgb), 0.05); margin-bottom: 25px; border-radius: 20px;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <i class="fa-solid fa-lightbulb" style="color: var(--primary); font-size: 1.2rem;"></i>
                                    <span style="font-size: 0.7rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 1px;">AI COACH TIP</span>
                                </div>
                                <div style="font-size: 0.85rem; color: #ddd; line-height: 1.5; font-style: italic;">"${e.pro_tip}"</div>
                            </div>
                        `),e.mistakes&&e.mistakes.length>0){let i=e.mistakes.map(r=>`
                            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; background: rgba(255,0,0,0.05); padding: 15px; border-radius: 15px; border: 1px solid rgba(255,0,0,0.1);">
                                <div style="color: #ff4444; margin-top: 2px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                <div style="font-size: 0.8rem; color: #eee; line-height: 1.4;">${r}</div>
                            </div>
                        `).join("");m.innerHTML+=`
                            <div style="margin-bottom: 30px;">
                                <div style="font-size: 0.75rem; font-weight: 900; color: #ff4444; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;">
                                    COMMON MISTAKES
                                </div>
                                <div>${i}</div>
                            </div>
                        `}}const u=document.getElementById("encyclo-grid");if(u.innerHTML="",t&&n[t]){const i=n[t].filter(s=>s.id!==e.id),f={punches:"fa-hand-fist",stances:"fa-person-walking",kicks:"fa-shoe-prints",defense:"fa-shield-halved"}[t]||"fa-star";i.length===0?u.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#444;font-size:0.75rem;padding:20px;">No other techniques in this category yet.</div>':i.forEach(s=>{const g=document.createElement("div");g.className="encyclo-card hover-scale ripple",g.style.cursor="pointer",g.onclick=()=>{window.location.href=`technical-detail.html?id=${s.id}&cat=${t.toUpperCase()}`};const v=s.isAiPick?'<span style="font-size:0.45rem;font-weight:900;background:var(--primary);color:#000;padding:2px 7px;border-radius:100px;margin-left:6px;text-transform:uppercase;vertical-align:middle;">FOUNDATION</span>':"";g.innerHTML=`
                                <div class="encyclo-icon"><i class="fa-solid ${f}"></i></div>
                                <div style="font-size:0.9rem;font-weight:900;color:#fff;text-transform:uppercase;">
                                    ${s.name}${v}
                                </div>
                                <div style="font-size:0.6rem;color:#666;font-weight:700;margin-top:3px;">${s.subtitle}</div>
                                <div class="eff-bar-track" style="margin-top:10px;background:rgba(255,255,255,0.05);">
                                    <div class="eff-bar-fill" style="width:${s.score}%"></div>
                                </div>
                                <div style="font-size:0.5rem;font-weight:800;color:var(--primary);margin-top:4px;text-transform:uppercase;">${s.score}% EFFECTIVENESS</div>
                            `,u.appendChild(g)})}}function E(e){return Promise.race([h.from("techniques").select("*").then(({data:t,error:n})=>n||!t?[]:t),new Promise(t=>setTimeout(()=>t([]),e))]).catch(()=>[])}document.addEventListener("DOMContentLoaded",()=>{const e=new URLSearchParams(window.location.search).get("id");function t(n){const o=x(n),{item:c,categoryKey:a}=b(o,e);y(c,a,o)}t(),E(2500).then(n=>{n.length&&t(n)})});
