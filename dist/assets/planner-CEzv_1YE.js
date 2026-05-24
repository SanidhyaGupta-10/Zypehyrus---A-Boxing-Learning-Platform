import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const g="AIzaSyDsDknqBZPVmj-gPd_Bbmi-gs6lEAlVUYM",d=document.getElementById("planner-mount"),f=document.getElementById("onboarding-prompt");async function h(){const e=JSON.parse(localStorage.getItem("boxing_onboarding_data")||"{}");if(StreakManager.updateBadges(),!e.user_metrics){d.style.display="none",f.style.display="flex";return}if(!e.planner_config){window.location.replace("planner-config.html");return}const i=localStorage.getItem("active_boxing_plan_v2"),s=localStorage.getItem("last_plan_gen_date_v2"),n=new Date().toDateString();i&&s===n?c(JSON.parse(i)):await u(e,n)}async function u(e,i){const s=`You are the Synthetic Combat Intelligence. Generate a high-performance 7-day training roadmap in JSON format.
            RETURN ONLY THE JSON OBJECT. NO MARKDOWN.
            
            STRUCTURE:
            {
              "week_range": "DATE RANGE (e.g. OCT 23 - 29)",
              "intensity_score": 84,
              "days": [
                {
                  "day_name": "MON",
                  "date": "23",
                  "intensity": 65,
                  "protocol": [
                    { "time": "06:00 AM", "duration": "45 MIN", "title": "HEAVY BAG: POWER DRILLS", "impact": "Aerial: POWER" },
                    { "time": "11:30 AM", "duration": "30 MIN", "title": "REFLEX BALL TRAINING", "impact": "Aerial: SPEED" }
                  ],
                  "recovery": "Active Mobility & Foam Roll"
                }
              ]
            }
            
            RULES:
            1. Scale "protocol" array length based on available_time: <30 = 1-2 items, 30-60 = 2-3 items, 60+ = 3-4 items.
            2. Map exercises to primary_goal: ${e.primary_goal}.
            3. Respect preferred_time: ${e.planner_config?.preferred_time||"07:30"} for the first session each day.
            4. Align primary training blocks with peak_window: ${e.planner_config?.peak_window||"MORNING"}.
            5. Ensure "impact" tags match the goal.
            6. Use Cyber-Athletic terminology.`,n=new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),a=`Generate roadmap for: ${JSON.stringify(e)}. The current real-world date today is: ${n}. Ensure the 7-day roadmap starts from this actual date ("date" array field should be the day of the month, like "23") and follows the correct day sequence.`;try{const t=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${g}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:s+`

`+a}]}],generationConfig:{temperature:1}})});if(t.status===429)throw new Error("Neural Capacity Reached. Please wait a moment for the uplink to stabilize.");if(!t.ok){const y=await t.text();throw console.error("API Response Error:",t.status,y),new Error(`API Error: ${t.status}`)}const o=await t.json();if(console.log("Full API Response:",o),!o.candidates||o.candidates.length===0)throw new Error("No candidates returned from API. Check safety settings or quota.");let l=o.candidates[0].content.parts[0].text;const m=l.indexOf("{"),v=l.lastIndexOf("}");if(m===-1||v===-1)throw new Error("No valid JSON found in AI response.");l=l.substring(m,v+1);const p=JSON.parse(l);localStorage.setItem("active_boxing_plan_v2",JSON.stringify(p)),localStorage.setItem("last_plan_gen_date_v2",i),localStorage.getItem("last_plan_gen_timestamp")||localStorage.setItem("last_plan_gen_timestamp",Date.now()),AppSounds.play("success"),c(p)}catch(t){console.error("Plan Generation Error:",t),AppSounds.play("error"),d.innerHTML=`
                    <div style="padding: 100px 40px; text-align: center; color: #ff4444;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <h2 style="font-weight: 900; text-transform: uppercase;">Link Failure</h2>
                        <p style="font-size: 0.8rem; color: var(--zinc-500); margin-top: 10px;">${t.message}</p>
                        <button onclick="location.reload()" class="btn-primary hover-scale ripple" style="margin-top: 30px; height: 50px; padding: 0 20px; font-size: 0.8rem;">RETRY UPLINK</button>
                    </div>
                `}}function c(e){const s=e.days[0];d.innerHTML=`
                <header class="roadmap-header">
                    <div class="header-left">
                        <i class="fa-solid fa-bolt bolt-icon"></i>
                        <div class="header-title">STRATEGY DEPLOYED</div>
                    </div>
                    <div class="notification-bell">
                        <i class="fa-solid fa-bell"></i>
                    </div>
                </header>

                <div class="roadmap-summary">
                    <div class="performance-track">PERFORMANCE TRACK</div>
                    <div class="weekly-title-row">
                        <h1 class="weekly-title">WEEKLY ROADMAP</h1>
                        <span class="date-range">${e.week_range}</span>
                    </div>

                    <div class="calendar-strip">
                        ${e.days.map((n,a)=>`
                            <div class="cal-item ${a===0?"active":""}" onclick="window.switchDay(${a})">
                                <span class="cal-day-name">${n.day_name}</span>
                                <span class="cal-date">${n.date}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="section-label">TODAY'S PROTOCOL</div>
                
                <div class="protocol-list">
                    ${s.protocol.map((n,a)=>`
                        <div class="protocol-card ${a===0?"active":""}">
                            <div class="card-left">
                                <div class="card-meta">${n.time} • ${n.duration}</div>
                                <div class="card-title">${n.title}</div>
                                <div class="card-badge">${n.impact}</div>
                            </div>
                            <div class="play-btn ${a===0?"active":""}">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="recovery-pillar">
                    <div class="recovery-content">
                        <div class="recovery-label">RECOVERY PILLAR</div>
                        <div class="recovery-text">${s.recovery}</div>
                    </div>
                    <i class="fa-solid fa-moon recovery-icon"></i>
                </div>

                <div class="intensity-section">
                    <div class="intensity-header">
                        <div class="intensity-label">WEEKLY INTENSITY</div>
                        <div class="intensity-val">${e.intensity_score}%</div>
                    </div>
                    <div class="chart-container">
                        ${e.days.map((n,a)=>`
                            <div class="bar ${a===0?"active":""}" style="height: ${n.intensity}%"></div>
                        `).join("")}
                    </div>
                    <button class="reset-btn" onclick="window.resetPlan()">
                        <i class="fa-solid fa-rotate-right"></i>
                        <span>RESET</span>
                    </button>
                </div>
            `}window.switchDay=e=>{const i=JSON.parse(localStorage.getItem("active_boxing_plan_v2"));b(i,e)};function b(e,i){e.days[i],c({...e,activeDay:i})}let r=0;window.switchDay=e=>{r=e;const i=JSON.parse(localStorage.getItem("active_boxing_plan_v2"));c(i)};function w(e){const i=e.days[r],s=new Date().toDateString(),n=JSON.parse(localStorage.getItem("deployed_planner_drills_"+s)||"[]");d.innerHTML=`
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
                        ${e.days.map((a,t)=>`
                            <div class="cal-item ${t===r?"active animate-pulse":"hover-scale ripple"}" onclick="window.switchDay(${t})" style="transition: all 0.3s;">
                                <span class="cal-day-name">${a.day_name}</span>
                                <span class="cal-date">${a.date}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="section-label animate-fade anim-slide-right" style="animation-delay: 0.2s; animation-fill-mode: both;">TODAY'S PROTOCOL</div>
                
                <div class="protocol-list stagger-anim" style="animation-delay: 0.3s;">
                    ${i.protocol.map((a,t)=>{const o=n.some(l=>l.title===a.title);return`
                        <div class="protocol-card hover-scale ripple ${t===0?"active":""} ${o?"deployed":""}" 
                             onclick="window.location.href='protocol-start.html?day=${r}&p=${t}'" style="animation-fill-mode: both;">
                            <div class="card-left">
                                <div class="card-meta">${a.time} • ${a.duration}</div>
                                <div class="card-title">${a.title}</div>
                                <div class="card-badge" style="${o?"background: var(--neon); color: #000; border: none;":""}">
                                    ${o?'<i class="fa-solid fa-check-double"></i> DEPLOYED':a.impact}
                                </div>
                            </div>
                            <div class="play-btn ${t===0&&!o?"active":""}" style="${o?"background: rgba(226, 255, 59, 0.1); color: var(--neon);":""}">
                                <i class="fa-solid ${o?"fa-check":"fa-play"}"></i>
                            </div>
                        </div>
                        `}).join("")}
                </div>

                <div class="recovery-pillar animate-slide-up hover-scale" style="animation-delay: 0.4s; animation-fill-mode: both;">
                    <div class="recovery-content">
                        <div class="recovery-label">RECOVERY PILLAR</div>
                        <div class="recovery-text">${i.recovery}</div>
                    </div>
                    <i class="fa-solid fa-moon recovery-icon"></i>
                </div>

                <div class="intensity-section animate-slide-up hover-scale" style="animation-delay: 0.5s; animation-fill-mode: both;">
                    <div class="intensity-header">
                        <div class="intensity-label">WEEKLY INTENSITY</div>
                        <div class="intensity-val">${e.intensity_score}%</div>
                    </div>
                    <div class="chart-container">
                        ${e.days.map((a,t)=>`
                            <div class="bar ${t===r?"active":""}" style="height: ${a.intensity}%; transition: height 1s cubic-bezier(0.4, 0, 0.2, 1) ${.5+t*.1}s;"></div>
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
            `}c=w;window.regenerateRoadmap=function(){const e=localStorage.getItem("last_plan_gen_timestamp"),i=Date.now(),s=4320*60*1e3;if(e&&i-e<s){const n=s-(i-e),a=Math.floor(n/(1440*60*1e3)),t=Math.floor(n%(1440*60*1e3)/(3600*1e3));alert(`Neural Link Cooldown: ${a}d ${t}h remaining before next generation.`);return}confirm("Initiate AI Regeneration? All current progress will be archived.")&&(localStorage.removeItem("active_boxing_plan_v2"),localStorage.removeItem("last_plan_gen_date_v2"),localStorage.setItem("last_plan_gen_timestamp",Date.now()),location.reload())};window.resetEngine=function(){confirm("DANGER: This will wipe your bio-metrics and roadmap. Re-start onboarding?")&&(localStorage.clear(),window.location.assign("index.html"))};function _(){const e=document.getElementById("regen-btn"),i=document.getElementById("regen-timer");if(!e||!i)return;const s=localStorage.getItem("last_plan_gen_timestamp"),n=Date.now(),a=4320*60*1e3;if(s&&n-s<a){const t=a-(n-s),o=Math.floor(t/(1440*60*1e3)),l=Math.floor(t%(1440*60*1e3)/(3600*1e3));e.style.opacity="0.5",i.innerText=`NEXT SYNC: ${o}D ${l}H`}else i.innerText="LINK READY",i.style.opacity="0.3"}setTimeout(_,100);h();
