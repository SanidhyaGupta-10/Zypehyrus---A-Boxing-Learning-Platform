import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{s as b}from"./supabase-client-CZkVvohH.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";const{StreakManager:g}=window;window.db=b;document.addEventListener("DOMContentLoaded",async()=>{const x=(JSON.parse(localStorage.getItem("boxing_onboarding_data")||"{}").ring_name||"FIGHTER").toUpperCase(),y=document.getElementById("hud-user");y&&(y.innerText=x),window.StreakManager&&g.syncWithSupabase(b),setInterval(()=>{const a=Math.floor(Math.random()*9)+90,n=document.querySelector(".heart-pulse + span");n&&(n.innerText=a+"_BPM")},5e3),g.updateBadges();const S=g.checkAndGetStreak(),m=g.getRank(S),p=document.getElementById("rank-streak");p&&(p.className=`rank-badge ${m.class}

                    `,p.innerHTML=`<span class="rank-label" >SR</span> <i class="fa-solid ${m.icon}" ></i> ${m.name}

                    `),""+new Date().toDateString();const h=document.getElementById("calendar-strip"),k=["S","M","T","W","T","F","S"];h.innerHTML="";for(let a=-3;a<=3;a++){const n=new Date;n.setDate(n.getDate()+a);const d=a===0,r=n.getDate(),l=k[n.getDay()],c=n.toLocaleDateString("en-US",{weekday:"long"}),t=workoutSchedule[c],i="workout_progress_"+n.toDateString(),s=JSON.parse(localStorage.getItem(i)||"[]"),u=t&&t.drills&&t.drills.length>0&&s.length===t.drills.length,e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.alignItems="center",e.style.justifyContent="center",e.style.width="13%",e.style.height="62px",e.style.borderRadius="14px",e.style.transition="0.3s",e.style.position="relative";let f=u?'<div style="position:absolute; top:-5px; right:-5px; width: 15px; height: 15px; background: #1abc9c; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.4rem; box-shadow: 0 0 5px #1abc9c;"><i class="fa-solid fa-check"></i></div>':"";d?(e.style.background="rgba(var(--primary-rgb), 0.15)",e.style.border="1px solid var(--primary)",e.style.boxShadow="0 0 15px rgba(var(--primary-rgb), 0.4)",e.style.transform="scale(1.1)",e.innerHTML=` <span style="font-size: 0.65rem; font-weight: 800; color: #fff; margin-bottom: 2px;" >${l}

                    </span> <span style="font-size: 1.1rem; font-weight: 950; color: var(--primary);" >${r}

                    </span> ${f}

                    `):(e.style.opacity="0.4",e.innerHTML=` <span style="font-size: 0.6rem; font-weight: 800; color: #888; margin-bottom: 2px;" >${l}

                    </span> <span style="font-size: 1rem; font-weight: 800; color: #fff;" >${r}

                    </span> ${f}

                    `,u&&(e.style.opacity="0.8",e.style.border="1px solid rgba(26, 188, 156, 0.4)")),h.appendChild(e)}currentDayName;const o=getDailyWorkout();if(o&&o.drills){document.getElementById("dash-challenge-desc").innerHTML=`Session Focus:<br>${o.title}

                `;const a="workout_progress_"+new Date().toDateString(),n=JSON.parse(localStorage.getItem(a)||"[]"),d=Math.round(n.length/o.drills.length*100)||0;document.getElementById("dash-progress-ring").style.background=`conic-gradient(var(--primary) ${d*3.6}

                    deg, rgba(255, 255, 255, 0.05) 0deg)`,document.getElementById("dash-progress-text").innerHTML=`${d}

                %<br><span style="font-size: 0.45rem; font-style: normal; opacity: 0.7;" >DONE</span>`;const r=document.getElementById("dash-hud-goal-text"),l=r.closest(".hud-item"),c=document.querySelector(".challenge-card-v2");if(o.drills.length>0){const t=o.drills[0];if(r.innerText=`Daily Focus: ${t.name}

                    `,t.isPlanner){l&&l.classList.add("hud-highlight"),c&&c.classList.add("card-highlight");const s=document.querySelector(".challenge-card-v2 h3");s&&s.classList.add("text-neon-bright"),document.getElementById("dash-challenge-desc").innerText="STRATEGIC PROTOCOL ACTIVE"}let i="GO";if(t.duration)i=Math.floor(t.duration/60)+"m";else if(t.reps){const s=t.reps.match(/\d+(?=reps)/i)||t.reps.match(/\d+/);s&&(i=s[0])}document.getElementById("dash-hud-goal-val").innerHTML=i}}else document.getElementById("dash-challenge-desc").innerHTML="Recovery Focus",document.getElementById("dash-progress-ring").style.background="rgba(255, 255, 255, 0.05)",document.getElementById("dash-progress-text").innerHTML='<i class="fa-solid fa-moon" ></i><br><span style="font-size: 0.45rem; font-style: normal; opacity: 0.7;" >REST</span>',document.getElementById("dash-hud-goal-text").innerText="Daily Goal: Active Recovery",document.getElementById("dash-hud-goal-val").innerHTML='<i class="fa-solid fa-bed"></i>'});
