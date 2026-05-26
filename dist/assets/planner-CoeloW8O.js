import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const E={STORAGE_KEY:"boxing_streak_data",getStreakData(){const e={currentStreak:0,lastCompletedDate:null};return JSON.parse(localStorage.getItem(this.STORAGE_KEY)||JSON.stringify(e))},saveStreakData(e){localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))},completeSession(){const e=this.getStreakData(),t=new Date().toDateString();if(e.lastCompletedDate===t)return console.log("Session already completed today. Streak maintained but not incremented."),e.currentStreak;e.lastCompletedDate&&new Date(e.lastCompletedDate);const n=new Date;n.setDate(n.getDate()-1);const o=n.toDateString();return e.lastCompletedDate===o?e.currentStreak+=1:e.currentStreak=1,e.lastCompletedDate=t,this.saveStreakData(e),this.updateBadges(),e.currentStreak},checkAndGetStreak(){const e=this.getStreakData();if(!e.lastCompletedDate)return 0;const t=new Date,n=new Date(e.lastCompletedDate),o=new Date(t.getFullYear(),t.getMonth(),t.getDate()),a=new Date(n.getFullYear(),n.getMonth(),n.getDate()),i=Math.abs(o-a);return Math.floor(i/(1e3*60*60*24))>1?0:e.currentStreak},async syncWithSupabase(e){if(e)try{const n=(JSON.parse(localStorage.getItem("boxing_onboarding_data")||"{}").ring_name||"FIGHTER").toUpperCase(),o=this.checkAndGetStreak();if(o<=0)return;const{error:a}=await e.from("leaderboard_streaks").upsert({name:n,score:o,display_val:o.toString(),last_updated:new Date().toISOString()},{onConflict:"name"});if(a)throw a;console.log("Streak synced with Supabase:",o)}catch(t){console.error("Supabase Streak Sync Error:",t)}},getRank(e){return e>=31?{name:"MASTER",color:"#E2FF3B",class:"rank-master",icon:"fa-fire"}:e>=22?{name:"DIAMOND",color:"#B9F2FF",class:"rank-diamond",icon:"fa-gem"}:e>=15?{name:"PLATINUM",color:"#E5E4E2",class:"rank-platinum",icon:"fa-award"}:e>=8?{name:"GOLD",color:"#FFD700",class:"rank-gold",icon:"fa-medal"}:e>=4?{name:"SILVER",color:"#C0C0C0",class:"rank-silver",icon:"fa-shield-halved"}:e>=1?{name:"BRONZE",color:"#CD7F32",class:"rank-bronze",icon:"fa-shield"}:{name:"ROOKIE",color:"#444",class:"rank-rookie",icon:"fa-user"}},updateBadges(){const e=this.checkAndGetStreak();document.querySelectorAll(".streak-badge span").forEach(n=>{n.parentElement.closest(".nav-hex-wrap")||n.parentElement.closest(".camera-main")?n.innerText=e:n.innerText=e+"D STREAK"})}};document.addEventListener("DOMContentLoaded",()=>{E.updateBadges()});window.StreakManager=E;const h={checkInterval:null,init(){console.log("Initializing Neural Notification System..."),this.requestPermission(),this.startMonitoring()},async requestPermission(){if(!("Notification"in window)){console.log("This browser does not support desktop notification");return}Notification.permission==="default"&&await Notification.requestPermission()},startMonitoring(){this.checkInterval&&clearInterval(this.checkInterval),this.checkInterval=setInterval(()=>this.checkSchedules(),6e4),this.checkSchedules()},checkSchedules(){const e=localStorage.getItem("active_boxing_plan_v2");if(!e)return;const t=JSON.parse(e),n=new Date,o=n.getDate().toString(),a=t.days.find(i=>i.date===o||i.day_name.toUpperCase()===n.toLocaleString("en-us",{weekday:"short"}).toUpperCase());!a||!a.protocol||a.protocol.forEach((i,s)=>{this.isTimeToNotify(i.time)&&this.triggerNotification(i,s)})},isTimeToNotify(e){const t=new Date,[n,o]=e.split(" ");let[a,i]=n.split(":");a=parseInt(a),i=parseInt(i),o==="PM"&&a<12&&(a+=12),o==="AM"&&a===12&&(a=0);const s=`notified_${new Date().toDateString()}_${e}`;return localStorage.getItem(s)?!1:t.getHours()===a&&t.getMinutes()===i?(localStorage.setItem(s,"true"),!0):!1},triggerNotification(e,t){const n="STRATEGIC UPLINK: "+e.title,o={body:`Focus: ${e.impact}
Duration: ${e.duration}
Initiate protocol now.`,icon:"/favicon.ico",badge:"/favicon.ico",vibrate:[200,100,200],tag:"boxing-drill-"+t,requireInteraction:!0};Notification.permission==="granted"?(new Notification(n,o),window.AudioEngine&&(window.AudioEngine.playClick(),setTimeout(()=>window.AudioEngine.playClick(),200))):(console.log("Notification: "+n),alert(n+`
`+o.body))}};window.NotificationManager=h;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>h.init()):h.init();const _={slash:new Audio("https://assets.mixkit.co/sfx/preview/mixkit-fast-rocket-whoosh-1714.mp3"),click:new Audio("https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-31.mp3"),success:new Audio("https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3"),punch:new Audio("https://assets.mixkit.co/sfx/preview/mixkit-boxer-punch-impact-2122.mp3"),error:new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"),init(){Object.values(this).forEach(e=>{e instanceof Audio&&(e.load(),e.volume=.5)}),this.bindGlobalClicks()},play(e){this[e]&&(this[e].currentTime=0,this[e].play().catch(t=>console.warn("Audio play blocked by browser:",t)))},bindGlobalClicks(){document.addEventListener("click",e=>{e.target.closest("button, .ctrl-btn, .nav-item, .clickable")&&this.play("click")})}};window.AppSounds=_;window.addEventListener("DOMContentLoaded",()=>_.init());document.addEventListener("DOMContentLoaded",()=>{k(),I()});function k(){const e=JSON.parse(localStorage.getItem("boxing_onboarding_data")||"{}"),t=e.ring_name||"FIGHTER",n=e.lifestyle||"Varied",o=e.persona||"Unknown",a=e.goals||[],i=e.promise||e.trigger||"TO BE UNSTOPPABLE",s=e.avatar_url||"https://i.pravatar.cc/150?u=viktor";JSON.parse(localStorage.getItem("app_settings")||'{"notifications":true, "stealth":false}').stealth?document.body.classList.add("stealth-active"):document.body.classList.remove("stealth-active");const b=document.getElementById("dashboard-greeting");b&&(b.innerText=`MORNING, ${t}`);const w=document.getElementById("profile-name"),S=document.getElementById("profile-trigger"),x=document.getElementById("profile-details");if(w&&(w.innerHTML=`${t}'S<br>PROFILE`),S&&(S.innerText=`PROMISE: ${i}`),x){const r=a.map(g=>`<span class="badge-elite" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);">${g}</span>`).join(" ");x.innerHTML=`
            <div class="glass-card ripple" style="padding: 25px; border-radius: 35px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.08);">
                 <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;">
                    <div>
                        <div style="font-size: 0.65rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; display:flex; align-items:center; gap:8px;">
                            IDENTITY <i class="fa-solid fa-pen" style="font-size:0.5rem; cursor:pointer;" onclick="editProfileField('ring_name', 'FIGHTER NAME')"></i>
                        </div>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #fff; font-style: italic;">"${t}"</div>
                    </div>
                     <div style="text-align: right;">
                        <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">PERSONA</div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${o}</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr; gap: 20px;">
                    <div>
                         <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
                            THE FIGHTER'S PROMISE <i class="fa-solid fa-pen" style="font-size:0.5rem; cursor:pointer;" onclick="editProfileField('promise', 'YOUR PROMISE')"></i>
                         </div>
                         <div style="font-size: 1.1rem; font-weight: 900; color: var(--primary); font-style: italic; letter-spacing: -0.5px;">"${i}"</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">LIFESTYLE</div>
                            <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${n}</div>
                        </div>
                        <div>
                             <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">LEVEL</div>
                             <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${e.experience_level||"Novice"}</div>
                        </div>
                        <div>
                             <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">PHONE</div>
                             <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${e.phone_number||"--"}</div>
                        </div>
                    </div>

                    <div>
                         <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">ACTIVE GOALS</div>
                         <div style="display:flex; flex-wrap:wrap; gap:8px;">${r}</div>
                    </div>
                </div>
            </div>
        `}document.querySelectorAll(".hero-sub-text").forEach(r=>{if(r.id==="dashboard-greeting"||r.id==="profile-trigger")return;const g=r.innerText;g.includes(t)||(r.innerHTML=`${g} <span style="color: rgba(255,255,255,0.3); margin: 0 5px;">•</span> <span style="color: var(--text-muted);">${t}</span>`)});const y=document.querySelector(".hero-container");if(y&&!document.getElementById("profile-trigger")&&!document.getElementById("dashboard-greeting")){let r=document.getElementById("promise-header-tag");r||(r=document.createElement("div"),r.id="promise-header-tag",r.style.fontSize="0.55rem",r.style.fontWeight="800",r.style.color="var(--primary)",r.style.opacity="0.7",r.style.textTransform="uppercase",r.style.marginTop="5px",y.children[1]&&y.children[1].appendChild(r)),r.innerHTML=`PROMISE: ${i}`}document.querySelectorAll("img").forEach(r=>{(r.src.includes("pravatar")||r.src.includes("avatar")||r.hasAttribute("data-profile-avatar"))&&(r.src=s,r.setAttribute("data-profile-avatar","true"))})}function I(){document.querySelectorAll("img").forEach(e=>{if(e.src.includes("pravatar")||e.src.includes("avatar")||e.hasAttribute("data-profile-avatar")){e.style.cursor="pointer",e.title="Click to change profile image",e.onclick=n=>{n.stopPropagation(),editProfileField("avatar_url","IMAGE URL")};const t=e.parentElement;if(t&&!t.querySelector(".avatar-edit-icon")){t.style.position="relative";const n=document.createElement("i");n.className="fa-solid fa-camera avatar-edit-icon",n.style.cssText="position:absolute; bottom:0; right:0; background:var(--primary); color:#000; width:18px; height:18px; border-radius:50%; font-size:0.6rem; display:flex; align-items:center; justify-content:center; border:2px solid #000; pointer-events:none;",t.appendChild(n)}}})}window.editProfileField=function(e,t){const n=JSON.parse(localStorage.getItem("boxing_onboarding_data")||"{}"),o=n[e]||"",a=prompt(`ENTER NEW ${t}:`,o);a!==null&&a.trim()!==""&&(n[e]=a.trim(),localStorage.setItem("boxing_onboarding_data",JSON.stringify(n)),k(),I(),window.dispatchEvent(new Event("storage")),window.AudioEngine&&AudioEngine.playTick())};const D=window.StreakManager,v=window.AppSounds,f=window.ZephyrOnboarding,c=document.getElementById("planner-mount"),d=document.getElementById("onboarding-prompt"),p=document.getElementById("onboarding-planner-setup");function T(e){const t=new Date,n=["MON","TUE","WED","THU","FRI","SAT","SUN"],o=e.planner_config?.preferred_time||"07:30",a=e.primary_goal||"Aerial";return{week_range:`${t.toLocaleString("en-US",{month:"short"}).toUpperCase()} ${t.getDate()} - ${t.getDate()+6}`,intensity_score:78,days:n.map((i,s)=>{const l=new Date(t);return l.setDate(t.getDate()+s),{day_name:i,date:String(l.getDate()),intensity:55+s*4,protocol:[{time:o,duration:"30 MIN",title:`${a.toUpperCase()} FOCUS DRILLS`,impact:`${a}: POWER`}],recovery:"Active mobility & foam roll"}})}}async function A(){if(!c||!f){console.error("[Planner] Missing mount or ZephyrOnboarding helpers");return}const e=f.getOnboardingData();try{D?.updateBadges?.()}catch(a){console.warn("[Planner] StreakManager:",a)}if(!f.hasUserMetrics(e)){c.style.display="none",p&&(p.style.display="none"),d&&(d.style.display="flex");return}if(!f.hasPlannerConfig(e)){c.style.display="none",d&&(d.style.display="none"),p&&(p.style.display="flex");return}d&&(d.style.display="none"),p&&(p.style.display="none"),c.style.display="block";const t=localStorage.getItem("active_boxing_plan_v2"),n=localStorage.getItem("last_plan_gen_date_v2"),o=new Date().toDateString();if(t&&n===o){u(JSON.parse(t));return}await N(e,o)}async function N(e,t){const o=(window.NEXT_PUBLIC_API_URL||window.ZEPHYR_API_BASE||"http://localhost:3000").replace(/\/$/,"")+"/api/generate-plan";try{console.log("[Planner] Fetching strategy roadmap from backend proxy:",o);const a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userData:e})});if(a.status===429)throw new Error("Neural Capacity Reached. Please wait a moment for the uplink to stabilize.");if(!a.ok){const l=await a.text();throw console.error("Backend Response Error:",a.status,l),new Error(`API Error: ${a.status}`)}const i=await a.json();if(!i.plan)throw new Error(i.error||"No valid combat strategy returned from server.");const s=i.plan;localStorage.setItem("active_boxing_plan_v2",JSON.stringify(s)),localStorage.setItem("last_plan_gen_date_v2",t),localStorage.getItem("last_plan_gen_timestamp")||localStorage.setItem("last_plan_gen_timestamp",Date.now()),v?.play?.("success"),u(s)}catch(a){console.warn("[Planner] Secure backend connection failed. Triggering standalone tactical fallback:",a);try{const i=T(e);localStorage.setItem("active_boxing_plan_v2",JSON.stringify(i)),localStorage.setItem("last_plan_gen_date_v2",t),localStorage.getItem("last_plan_gen_timestamp")||localStorage.setItem("last_plan_gen_timestamp",Date.now()),v?.play?.("success"),u(i)}catch(i){console.error("[Planner] Tactical fallback aborted:",i),v?.play?.("error"),c.innerHTML=`
                <div style="padding: 100px 40px; text-align: center; color: #ff4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <h2 style="font-weight: 900; text-transform: uppercase;">Link Failure</h2>
                    <p style="font-size: 0.8rem; color: var(--zinc-500); margin-top: 10px;">${a.message}</p>
                    <button onclick="location.reload()" class="btn-primary hover-scale ripple" style="margin-top: 30px; height: 50px; padding: 0 20px; font-size: 0.8rem;">RETRY UPLINK</button>
                </div>
            `}}}let m=0;window.switchDay=e=>{m=e;const t=JSON.parse(localStorage.getItem("active_boxing_plan_v2"));u(t)};function $(e){const t=e.days[m],n=new Date().toDateString(),o=JSON.parse(localStorage.getItem("deployed_planner_drills_"+n)||"[]");c.innerHTML=`
                <div class="animate-fade anim-slide-right">
                    <header class="roadmap-header">
                        <div class="header-left">
                            <i class="fa-solid fa-bolt bolt-icon"></i>
                            <div class="header-title">STRATEGY DEPLOYED</div>
                        </div>
                        <div class="notification-bell">
                            <i class="fa-solid fa-bell"></i>
                        </div>
                    </header>
                </div>

                <div class="roadmap-summary animate-slide-up hover-scale" style="animation-delay: 0.1s; animation-fill-mode: both;">
                    <div class="performance-track">PERFORMANCE TRACK</div>
                    <div class="weekly-title-row">
                        <h1 class="weekly-title">WEEKLY ROADMAP</h1>
                        <span class="date-range">${e.week_range}</span>
                    </div>

                    <div class="calendar-strip">
                        ${e.days.map((a,i)=>`
                            <div class="cal-item ${i===m?"active animate-pulse":"hover-scale ripple"}" onclick="window.switchDay(${i})" style="transition: all 0.3s;">
                                <span class="cal-day-name">${a.day_name}</span>
                                <span class="cal-date">${a.date}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="section-label animate-fade anim-slide-right" style="animation-delay: 0.2s; animation-fill-mode: both;">TODAY'S PROTOCOL</div>
                
                <div class="protocol-list stagger-anim" style="animation-delay: 0.3s;">
                    ${t.protocol.map((a,i)=>{const s=o.some(l=>l.title===a.title);return`
                        <div class="protocol-card hover-scale ripple ${i===0?"active":""} ${s?"deployed":""}" 
                             onclick="window.location.href='protocol-start.html?day=${m}&p=${i}'" style="animation-fill-mode: both;">
                            <div class="card-left">
                                <div class="card-meta">${a.time} • ${a.duration}</div>
                                <div class="card-title">${a.title}</div>
                                <div class="card-badge" style="${s?"background: var(--neon); color: #000; border: none;":""}">
                                    ${s?'<i class="fa-solid fa-check-double"></i> DEPLOYED':a.impact}
                                </div>
                            </div>
                            <div class="play-btn ${i===0&&!s?"active":""}" style="${s?"background: rgba(226, 255, 59, 0.1); color: var(--neon);":""}">
                                <i class="fa-solid ${s?"fa-check":"fa-play"}"></i>
                            </div>
                        </div>
                        `}).join("")}
                </div>

                <div class="recovery-pillar animate-slide-up hover-scale" style="animation-delay: 0.4s; animation-fill-mode: both;">
                    <div class="recovery-content">
                        <div class="recovery-label">RECOVERY PILLAR</div>
                        <div class="recovery-text">${t.recovery}</div>
                    </div>
                    <i class="fa-solid fa-moon recovery-icon"></i>
                </div>

                <div class="intensity-section animate-slide-up hover-scale" style="animation-delay: 0.5s; animation-fill-mode: both;">
                    <div class="intensity-header">
                        <div class="intensity-label">WEEKLY INTENSITY</div>
                        <div class="intensity-val">${e.intensity_score}%</div>
                    </div>
                    <div class="chart-container">
                        ${e.days.map((a,i)=>`
                            <div class="bar ${i===m?"active":""}" style="height: ${a.intensity}%; transition: height 1s cubic-bezier(0.4, 0, 0.2, 1) ${.5+i*.1}s;"></div>
                        `).join("")}
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px; position: absolute; bottom: 20px; right: 20px;">
                        <button type="button" class="reset-btn hover-scale" onclick="window.regenerateRoadmap()" id="regen-btn" style="position: static; width: auto; height: auto; padding: 12px 24px; border-radius: 12px; font-size: 0.75rem;">
                            <i class="fa-solid fa-sync"></i>
                            <span>REGENERATE</span>
                        </button>
                        <div id="regen-timer" style="font-size: 0.55rem; font-weight: 900; color: var(--primary); letter-spacing: 1.5px; text-transform: uppercase;"></div>
                    </div>
                </div>
            `}function u(e){$(e)}window.regenerateRoadmap=function(){const e=localStorage.getItem("last_plan_gen_timestamp"),t=Date.now(),n=4320*60*1e3;if(e&&t-e<n){const o=n-(t-e),a=Math.floor(o/(1440*60*1e3)),i=Math.floor(o%(1440*60*1e3)/(3600*1e3));alert(`Neural Link Cooldown: ${a}d ${i}h remaining before next generation.`);return}confirm("Initiate AI Regeneration? All current progress will be archived.")&&(localStorage.removeItem("active_boxing_plan_v2"),localStorage.removeItem("last_plan_gen_date_v2"),localStorage.setItem("last_plan_gen_timestamp",Date.now()),location.reload())};window.resetEngine=function(){confirm("DANGER: This will wipe your bio-metrics and roadmap. Re-start onboarding?")&&(localStorage.clear(),window.location.assign("index.html"))};function O(){const e=document.getElementById("regen-btn"),t=document.getElementById("regen-timer");if(!e||!t)return;const n=localStorage.getItem("last_plan_gen_timestamp"),o=Date.now(),a=4320*60*1e3;if(n&&o-n<a){const i=a-(o-n),s=Math.floor(i/(1440*60*1e3)),l=Math.floor(i%(1440*60*1e3)/(3600*1e3));e.style.opacity="0.5",t.innerText=`NEXT SYNC: ${s}D ${l}H`}else t.innerText="LINK READY",t.style.opacity="0.3"}setTimeout(O,100);A().catch(e=>{console.error("[Planner] init failed:",e),c&&(c.innerHTML=`
            <div style="padding: 80px 24px; text-align: center; color: #ff6b6b;">
                <h2 style="font-weight: 900; text-transform: uppercase;">Planner Offline</h2>
                <p style="margin-top: 12px; color: var(--zinc-500); font-size: 0.85rem;">${e.message}</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 24px;">RETRY</button>
            </div>`)});
