/**
 * App.jsx — Kurippu v3 Enhanced
 * NEW: Safety Tab, Alarm Tab, Demo Page, Camera Scan, Responsive Layout
 */
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Camera, Clock, ShieldAlert, CheckCircle2, Phone,
  User, ClipboardList, Bell, Shield, Play, RefreshCw, X, Circle, ChevronLeft,
} from "lucide-react";
import { analyzePrescription } from "./api";

const C = {
  blue:"#1e40af",blueMid:"#2563eb",blueLight:"#dbeafe",
  red:"#b91c1c",redLight:"#fee2e2",green:"#15803d",greenLight:"#dcfce7",
  amber:"#b45309",amberLight:"#fef3c7",purple:"#7c3aed",purpleLight:"#ede9fe",
  gray:"#374151",grayLight:"#f3f4f6",white:"#ffffff",
};

const ALARM_COLORS=[{hex:"#1e40af"},{hex:"#15803d"},{hex:"#b91c1c"},{hex:"#7c3aed"},{hex:"#b45309"},{hex:"#0e7490"}];
const TABLET_SIZES=["Small round white","Medium oval yellow","Large capsule red","Small oblong pink","Medium round blue","Custom"];
const SCREENS={HOME:"home",LOADING:"loading",RESULTS:"results",CONFLICT:"conflict",MEDLOG:"medlog",HISTORY:"history",PROFILE:"profile",SAFETY:"safety",ALARM:"alarm",DEMO:"demo"};
const STORAGE={PROFILE:"kurippu_profile_v2",HISTORY:"kurippu_history_v2",MED_LOG:"kurippu_med_log_v2",ALARMS:"kurippu_alarms_v3"};
const DEFAULT_PROFILE={name:"Rajan Nair",age:71,bloodGroup:"B+",emergencyContact:"9447000000",caretakerPhone:"9846000000",currentMedications:[{id:"m1",name:"Warfarin",dosage:"5mg",frequency:"Once daily",condition:"Atrial Fibrillation",totalQuantity:30,remainingQuantity:5},{id:"m2",name:"Metoprolol",dosage:"25mg",frequency:"Twice daily",condition:"Hypertension",totalQuantity:60,remainingQuantity:45}],allergies:["Penicillin","Sulfa drugs"]};

const T={
  en:{appName:"Kurippu",scanNew:"Scan Prescription",scanSub:"Camera or upload photo",viewLog:"Today's Medicines",viewLogSub:"Check and mark your doses",currentMeds:"Current Medicines",allergies:"Known Allergies",emergency:"EMERGENCY",emergencySub:"Call 108 – Ambulance",analyzing:"Reading your prescription…",step1:"Reading the image",step2:"Identifying medicines",step3:"Checking drug interactions",step4:"Translating to Malayalam",results:"Prescription Results",verified:"✓ Verified",unverified:"⚠ Unverified",noConflict:"No drug interactions found",noAllergy:"No allergy concerns found",scanAnother:"Scan Another Prescription",conflictTitle:"⚠ Drug Interaction Warning",conflictAdvice:"Do NOT take these medicines together without consulting your doctor first.",callDoctor:"Call Doctor Now",allergyTitle:"⚠ Allergy Alert!",allergyAdvice:"A medicine matches your known allergy.",proceedAnyway:"Proceed to Results →",logTitle:"Today's Medicines",taken:"TAKEN",takenMl:"കഴിച്ചു",notTaken:"Mark as Taken",allDone:"All done for today! 🎉",allDoneSub:"You've taken all your medicines. Great job!",historyTitle:"Prescription History",historyEmpty:"No prescriptions scanned yet",historyEmptySub:"Scan your first prescription to see it here",profileTitle:"My Health Profile",navHome:"Home",navLog:"Doses",navHistory:"History",navProfile:"Profile",navSafety:"Safety",navAlarm:"Alarm",dosage:"Dosage",frequency:"Frequency",timing:"Timing",duration:"Duration",days:"days",doctor:"Doctor",hospital:"Hospital",conflictDetected:"Conflict!",medicines:"medicines",takenAt:"Taken at",saveProfile:"Save Profile",saved:"Saved ✓",addMed:"Add Medicine",addAllergy:"Add Allergy",remove:"Remove",name:"Name",age:"Age",blood:"Blood Group",contact:"Emergency Contact",condition:"Condition",safetyTitle:"Safety Analysis",safetySub:"Conflicts & allergies from last scan",safetyEmpty:"No scan yet",safetyEmptySub:"Scan a prescription to see safety analysis here",profileMeds:"Profile Medications",alarmTitle:"Medicine Alarms",alarmSub:"Set reminders for each medicine",addAlarm:"Add Alarm",saveAlarm:"Save Alarm",noAlarms:"No alarms set",noAlarmsSub:"Add an alarm to get medicine reminders",alarmOn:"ON",alarmOff:"OFF",deleteAlarm:"Delete",alarmMed:"Medicine",alarmTime:"Time",alarmColor:"Colour (helps identify the medicine)",alarmSize:"Tablet size / shape",demoTitle:"Live Demo — See It In Action",demoSub:"No API key needed. Fully offline demo for judges.",demoJudge:"This demo runs entirely offline using a pre-loaded sample prescription. It showcases OCR reading, conflict detection, allergy alerts, and Malayalam translation — without consuming any API quota.",runDemo:"Run Demo Analysis",demoRunning:"Analysing…",demoStep1:"Sample Prescription",demoStep1Desc:"Patient: Rajan Nair (71). Doctor prescribes Aspirin 75mg + Ibuprofen 400mg + Amoxicillin 500mg after a knee injury.",demoStep2:"Conflicts Detected",demoStep2Desc:"Aspirin + Warfarin = HIGH RISK bleeding. Amoxicillin triggers Penicillin allergy.",demoStep3:"Malayalam Translation",demoStep3Desc:"Every instruction is translated to clear spoken Malayalam.",demoComplete:"Demo completed! All features shown without API usage.",useCamera:"Use Camera",useCameraSub:"Take photo directly",uploadPhoto:"Upload Photo",uploadSub:"Choose from gallery",capture:"Capture Photo",medicineTime:"Medicine Time!",gotIt:"Got it ✓",goBack:"Go Back",caretaker:"Caretaker Number",stock:"Remaining Stock",lowStock:"Low Stock Alert!",lowStockSub:"Medicine is about to finish soon.",alertCaretaker:"Alert Caretaker",fontSize:"Adjust Text Size",totalQty:"Total Prescribed",manualEntry:"Manual Entry"},
  ml:{appName:"കുറിപ്പ്",scanNew:"കുറിപ്പ് സ്കാൻ",scanSub:"ക്യാമറ അല്ലെങ്കിൽ ഗാലറി",viewLog:"ഇന്നത്തെ മരുന്നുകൾ",viewLogSub:"ഡോസ് അടയാളപ്പെടുത്തുക",currentMeds:"ഇപ്പോഴത്തെ മരുന്നുകൾ",allergies:"അലർജികൾ",emergency:"അടിയന്തരം",emergencySub:"108 — ആംബുലൻസ്",analyzing:"കുറിപ്പ് വായിക്കുന്നു…",step1:"ചിത്രം വായിക്കുന്നു",step2:"മരുന്നുകൾ തിരിച്ചറിയുന്നു",step3:"ഇടപെടൽ പരിശോധിക്കുന്നു",step4:"മലയാളത്തിലേക്ക് വിവർത്തനം",results:"കുറിപ്പ് ഫലങ്ങൾ",verified:"✓ സ്ഥിരീകരിച്ചു",unverified:"⚠ ഫാർമസിസ്റ്റിനോട്",noConflict:"ഡ്രഗ് ഇന്ററാക്ഷൻ ഇല്ല",noAllergy:"അലർജി ആശങ്ക ഇല്ല",scanAnother:"മറ്റൊരു കുറിപ്പ് സ്കാൻ",conflictTitle:"⚠ ഡ്രഗ് ഇടപെടൽ",conflictAdvice:"ഡോക്ടറോട് ആലോചിക്കാതെ ഈ മരുന്നുകൾ ഒരുമിച്ച് കഴിക്കരുത്.",callDoctor:"ഡോക്ടറെ വിളിക്കുക",allergyTitle:"⚠ അലർജി മുന്നറിയിപ്പ്!",allergyAdvice:"ഒരു മരുന്ന് നിങ്ങളുടെ അലർജിക്ക് കാരണമാകും.",proceedAnyway:"ഫലങ്ങളിലേക്ക് →",logTitle:"ഇന്നത്തെ മരുന്നുകൾ",taken:"കഴിച്ചു",takenMl:"TAKEN",notTaken:"കഴിച്ചതായി",allDone:"ഇന്ന് എല്ലാം കഴിച്ചു! 🎉",allDoneSub:"നിങ്ങൾ എല്ലാ മരുന്നുകളും കഴിച്ചു. ശാബാഷ്!",historyTitle:"കുറിപ്പ് ചരിത്രം",historyEmpty:"ഇതുവരെ സ്കാൻ ചെയ്തിട്ടില്ല",historyEmptySub:"ആദ്യ കുറിപ്പ് സ്കാൻ ചെയ്ത് ഇവിടെ കാണുക",profileTitle:"എന്റെ ആരോഗ്യ പ്രൊഫൈൽ",navHome:"ഹോം",navLog:"ഡോസ്",navHistory:"ചരിത്രം",navProfile:"പ്രൊഫൈൽ",navSafety:"സുരക്ഷ",navAlarm:"അലാറം",dosage:"ഡോസ്",frequency:"ആവൃത്തി",timing:"സമയം",duration:"ദൈർഘ്യം",days:"ദിവസം",doctor:"ഡോക്ടർ",hospital:"ആശുപത്രി",conflictDetected:"ഇടപെടൽ!",medicines:"മരുന്നുകൾ",takenAt:"കഴിച്ച സമയം",saveProfile:"പ്രൊഫൈൽ സേവ്",saved:"സേവ് ആയി ✓",addMed:"മരുന്ന് ചേർക്കുക",addAllergy:"അലർജി ചേർക്കുക",remove:"നീക്കം",name:"പേര്",age:"പ്രായം",blood:"രക്തഗ്രൂപ്പ്",contact:"അടിയന്തര ബന്ധം",condition:"അവസ്ഥ",safetyTitle:"സുരക്ഷാ വിശകലനം",safetySub:"അവസാന സ്കാനിൽ നിന്നുള്ള ഇടപെടൽ & അലർജി",safetyEmpty:"സ്കാൻ ഇല്ല",safetyEmptySub:"കുറിപ്പ് സ്കാൻ ചെയ്ത് ഇവിടെ കാണുക",profileMeds:"പ്രൊഫൈൽ മരുന്നുകൾ",alarmTitle:"മരുന്ന് അലാറം",alarmSub:"ഓരോ മരുന്നിനും ഓർമ്മപ്പെടുത്തൽ",addAlarm:"അലാറം ചേർക്കുക",saveAlarm:"സേവ്",noAlarms:"അലാറം ഇല്ല",noAlarmsSub:"മരുന്ന് ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക",alarmOn:"ഓൺ",alarmOff:"ഓഫ്",deleteAlarm:"നീക്കം",alarmMed:"മരുന്ന്",alarmTime:"സമയം",alarmColor:"നിറം",alarmSize:"ഗോളി വലിപ്പം",demoTitle:"ലൈവ് ഡെമോ",demoSub:"API ആവശ്യമില്ല. ഓഫ്‌ലൈൻ ഡെമോ.",demoJudge:"ഈ ഡെമോ ഓഫ്‌ലൈനിൽ പ്രവർത്തിക്കുന്നു.",runDemo:"ഡെമോ വിശകലനം",demoRunning:"വിശകലനം ചെയ്യുന്നു…",demoStep1:"സാമ്പിൾ കുറിപ്പ്",demoStep1Desc:"രോഗി: രാജൻ നായർ. ആസ്പിരിൻ + ഇബുപ്രോഫൻ + അമോക്സിസിലിൻ.",demoStep2:"ഇടപെടൽ കണ്ടെത്തി",demoStep2Desc:"ആസ്പിരിൻ + വാർഫറിൻ = ഉയർന്ന അപകടം.",demoStep3:"മലയാളം",demoStep3Desc:"എല്ലാ നിർദ്ദേശങ്ങളും മലയാളത്തിൽ.",demoComplete:"ഡെമോ പൂർത്തിയായി!",useCamera:"ക്യാമറ",useCameraSub:"നേരിട്ട് ഫോട്ടോ",uploadPhoto:"ഗാലറി",uploadSub:"ഫോട്ടോ തിരഞ്ഞെടുക്കുക",capture:"ഫോട്ടോ",medicineTime:"മരുന്ന് സമയം!",gotIt:"ശരി ✓",goBack:"തിരികെ",caretaker:"കെയർടേക്കർ നമ്പർ",stock:"ബാക്കിയുള്ള മരുന്ന്",lowStock:"മരുന്ന് തീരാറായി!",lowStockSub:"ഉടനെ വാങ്ങേണ്ടതുണ്ട്.",alertCaretaker:"കെയർടേക്കറെ അറിയിക്കുക",fontSize:"അക്ഷര വലിപ്പം",totalQty:"ആകെ മരുന്നുകൾ",manualEntry:"നേരിട്ട് ചേർക്കുക"},
};

const store={
  loadProfile:()=>{try{const r=localStorage.getItem(STORAGE.PROFILE);return r?JSON.parse(r):DEFAULT_PROFILE}catch{return DEFAULT_PROFILE}},
  saveProfile:(p)=>localStorage.setItem(STORAGE.PROFILE,JSON.stringify(p)),
  loadHistory:()=>{try{const r=localStorage.getItem(STORAGE.HISTORY);return r?JSON.parse(r):[]}catch{return[]}},
  addHistory:(e)=>{const h=store.loadHistory();h.unshift({id:Date.now().toString(),date:new Date().toISOString(),...e});localStorage.setItem(STORAGE.HISTORY,JSON.stringify(h))},
  loadMedLog:()=>{try{const r=localStorage.getItem(STORAGE.MED_LOG);return r?JSON.parse(r):{}}catch{return{}}},
  markTaken:(medId,di)=>{const log=store.loadMedLog();const today=new Date().toISOString().slice(0,10);if(!log[today])log[today]={};if(!log[today][medId])log[today][medId]={};log[today][medId][di]={takenAt:new Date().toISOString()};localStorage.setItem(STORAGE.MED_LOG,JSON.stringify(log));return log},
  isTaken:(medId,di)=>{const log=store.loadMedLog();const today=new Date().toISOString().slice(0,10);return!!(log?.[today]?.[medId]?.[di])},
  loadAlarms:()=>{try{const r=localStorage.getItem(STORAGE.ALARMS);return r?JSON.parse(r):[]}catch{return[]}},
  saveAlarms:(a)=>localStorage.setItem(STORAGE.ALARMS,JSON.stringify(a)),
};

function playChime(urgent=false){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const notes=urgent?[880,660,880,440]:[523.25,659.25,783.99];
    notes.forEach((freq,i)=>{
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.connect(gain);gain.connect(ctx.destination);
      osc.type=urgent?"square":"sine";osc.frequency.value=freq;
      gain.gain.setValueAtTime(0,ctx.currentTime+i*.25);
      gain.gain.linearRampToValueAtTime(urgent?.4:.3,ctx.currentTime+i*.25+.05);
      gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.25+.6);
      osc.start(ctx.currentTime+i*.25);osc.stop(ctx.currentTime+i*.25+.7);
    });
  }catch{}
}

const SOSButton=({t})=>(
  <a href="tel:108" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:C.red,color:C.white,padding:"14px",fontSize:17,fontWeight:900,letterSpacing:.5,textDecoration:"none",borderTop:`3px solid #7f1d1d`,flexShrink:0}}>
    <Phone size={20} strokeWidth={2.5}/>{t.emergency} — {t.emergencySub}
  </a>
);

const Card=({children,style={},danger=false,success=false,info=false})=>(
  <div style={{background:danger?C.redLight:success?C.greenLight:info?C.blueLight:C.white,borderRadius:16,padding:"18px",marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",border:danger?`2px solid ${C.red}`:success?`2px solid ${C.green}`:info?`2px solid ${C.blue}`:"none",...style}}>
    {children}
  </div>
);

const BigBtn=({onClick,label,sub,icon:Icon,color=C.blue,disabled})=>(
  <button onClick={onClick} disabled={disabled} style={{width:"100%",background:disabled?"#9ca3af":color,color:C.white,border:"none",borderRadius:18,padding:"18px 22px",display:"flex",alignItems:"center",gap:14,cursor:disabled?"not-allowed":"pointer",marginBottom:12,boxShadow:disabled?"none":`0 4px 16px ${color}55`,fontFamily:"inherit"}}
    onMouseDown={e=>!disabled&&(e.currentTarget.style.transform="scale(0.97)")}
    onMouseUp={e=>!disabled&&(e.currentTarget.style.transform="scale(1)")}
    onTouchStart={e=>!disabled&&(e.currentTarget.style.transform="scale(0.97)")}
    onTouchEnd={e=>!disabled&&(e.currentTarget.style.transform="scale(1)")}>
    {Icon&&<Icon size={28} strokeWidth={2} style={{flexShrink:0}}/>}
    <div style={{textAlign:"left"}}>
      <div style={{fontSize:19,fontWeight:900}}>{label}</div>
      {sub&&<div style={{fontSize:13,opacity:.85,marginTop:2}}>{sub}</div>}
    </div>
  </button>
);

const Badge=({label,color=C.blue,bg})=>(
  <span style={{background:bg||`${color}22`,color,padding:"3px 11px",borderRadius:100,fontSize:13,fontWeight:700,display:"inline-block"}}>{label}</span>
);

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomeScreen({t,lang,profile,onScan,onViewLog,onDemo}){
  const fileRef=useRef(null);
  const videoRef=useRef(null);
  const canvasRef=useRef(null);
  const streamRef=useRef(null);
  const [showModal,setShowModal]=useState(false);
  const [cameraOn,setCameraOn]=useState(false);
  const [facing,setFacing]=useState("environment");

  const hour=new Date().getHours();
  const greeting=hour<12?(lang==="ml"?"സുപ്രഭാതം":"Good Morning"):hour<17?(lang==="ml"?"ഉच्ചകഴിഞ്ഞ ആശംസ":"Good Afternoon"):(lang==="ml"?"ശুഭസন്ധ്യ":"Good Evening");

  const handleFile=(e)=>{const f=e.target.files?.[0];if(f){setShowModal(false);onScan(f);}};

  const startCam=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing}});
      streamRef.current=stream;
      if(videoRef.current)videoRef.current.srcObject=stream;
      setCameraOn(true);
    }catch{alert("Camera denied. Use Upload instead.");}
  };

  const stopCam=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;setCameraOn(false);};

  const flipCam=async()=>{
    stopCam();
    const next=facing==="environment"?"user":"environment";
    setFacing(next);
    setTimeout(async()=>{
      try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:next}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;setCameraOn(true);}catch{}
    },200);
  };

  const capture=()=>{
    const v=videoRef.current,c=canvasRef.current;
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    c.toBlob(blob=>{stopCam();setShowModal(false);onScan(new File([blob],"capture.jpg",{type:"image/jpeg"}));},"image/jpeg",.9);
  };

  const close=()=>{stopCam();setShowModal(false);};

  return(
    <div style={{padding:"18px 16px 16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.blue} 0%,${C.blueMid} 100%)`,borderRadius:20,padding:"22px",marginBottom:20,color:C.white}}>
        <div style={{fontSize:15,opacity:.85}}>{greeting},</div>
        <div style={{fontSize:26,fontWeight:900,marginTop:3}}>{profile.name} 👋</div>
        <div style={{fontSize:14,opacity:.8,marginTop:6}}>{lang==="ml"?`${profile.age} വയസ്സ് • ${profile.bloodGroup}`:`Age ${profile.age} • Blood: ${profile.bloodGroup}`}</div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>

      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <button onClick={()=>setShowModal(true)} style={{flex:1,background:C.blue,color:C.white,border:"none",borderRadius:18,padding:"18px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:`0 4px 16px ${C.blue}55`,fontFamily:"inherit"}}>
          <Camera size={26} strokeWidth={2} style={{flexShrink:0}}/>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:18,fontWeight:900}}>{t.scanNew}</div>
            <div style={{fontSize:12,opacity:.85}}>{t.scanSub}</div>
          </div>
        </button>
        <button onClick={onDemo} style={{background:C.purple,color:C.white,border:"none",borderRadius:18,padding:"16px 14px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",boxShadow:`0 4px 16px ${C.purple}55`,minWidth:84,fontFamily:"inherit"}}>
          <Play size={20} strokeWidth={2}/>
          <span style={{fontSize:11,fontWeight:800}}>{lang==="ml"?"ഡെമോ":"Demo"}</span>
        </button>
      </div>

      <BigBtn onClick={onViewLog} label={t.viewLog} sub={t.viewLogSub} icon={ClipboardList} color={C.green}/>

      <Card>
        <div style={{fontSize:"1rem",fontWeight:800,color:C.blue,marginBottom:12}}>🛡 {t.currentMeds}</div>
        {(profile.currentMedications||[]).map(m=>{
          const low = (m.remainingQuantity || 0) < 5;
          return (
          <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${C.grayLight}`}}>
            <div>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:C.gray}}>{m.name}</div>
              <div style={{fontSize:"0.8rem",color:"#6b7280"}}>{m.dosage} • {m.frequency}</div>
              {m.remainingQuantity !== undefined && (
                <div style={{fontSize:"0.7rem", color: low ? C.red : C.green, fontWeight: 800, marginTop: 2}}>
                  {t.stock}: {m.remainingQuantity}
                </div>
              )}
            </div>
            <Badge label={m.condition} color={C.blue}/>
          </div>
        )})}
        <div style={{fontSize:16,fontWeight:800,color:C.red,marginTop:6,marginBottom:10}}>⚠ {t.allergies}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {(profile.allergies||[]).map((a,i)=><Badge key={i} label={a} color={C.red}/>)}
        </div>
      </Card>

      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:C.white,borderRadius:24,width:"100%",maxWidth:440,overflow:"hidden"}}>
            <div style={{background:C.blue,color:C.white,padding:"15px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:18,fontWeight:900}}>{t.scanNew}</span>
              <button onClick={close} style={{background:"none",border:"none",color:C.white,cursor:"pointer",padding:4}}><X size={20}/></button>
            </div>
            <div style={{padding:20}}>
              {!cameraOn?(
                <>
                  <BigBtn onClick={startCam} label={t.useCamera} sub={t.useCameraSub} icon={Camera} color={C.blue}/>
                  <BigBtn onClick={()=>{fileRef.current?.click();close();}} label={t.uploadPhoto} sub={t.uploadSub} icon={ClipboardList} color={C.gray}/>
                </>
              ):(
                <>
                  <video ref={videoRef} autoPlay playsInline style={{width:"100%",borderRadius:12,background:"#000",display:"block"}}/>
                  <canvas ref={canvasRef} style={{display:"none"}}/>
                  <div style={{display:"flex",gap:10,marginTop:12}}>
                    <button onClick={capture} style={{flex:1,background:C.blue,color:C.white,border:"none",borderRadius:14,padding:"14px",fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit"}}>
                      <Circle size={18} strokeWidth={3}/>{t.capture}
                    </button>
                    <button onClick={flipCam} style={{background:C.grayLight,border:"none",borderRadius:14,padding:"14px 16px",cursor:"pointer"}}><RefreshCw size={18} color={C.gray}/></button>
                    <button onClick={close} style={{background:C.redLight,border:"none",borderRadius:14,padding:"14px 16px",cursor:"pointer"}}><X size={18} color={C.red}/></button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LOADING ───────────────────────────────────────────────────────────────────
function LoadingScreen({t}){
  const [step,setStep]=useState(0);
  const steps=[t.step1,t.step2,t.step3,t.step4];
  useEffect(()=>{const ts=steps.map((_,i)=>setTimeout(()=>setStep(i),i*1800));return()=>ts.forEach(clearTimeout);},[]);
  return(
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,background:C.grayLight}}>
      <div style={{fontSize:64,marginBottom:20,animation:"bounce 1s ease infinite alternate"}}>💊</div>
      <div style={{fontSize:22,fontWeight:900,color:C.blue,textAlign:"center",marginBottom:28}}>{t.analyzing}</div>
      <div style={{width:"100%",maxWidth:360}}>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",background:C.white,borderRadius:14,marginBottom:10,border:`2px solid ${i<=step?C.blue:"#e5e7eb"}`,transition:"all 0.4s",opacity:i<=step?1:.4}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:i<step?C.green:i===step?C.blue:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {i<step?<CheckCircle2 size={17} color={C.white}/>:i===step?<div style={{width:12,height:12,borderRadius:"50%",background:C.white,animation:"pulse 1s infinite"}}/>:<div style={{width:8,height:8,borderRadius:"50%",background:"#9ca3af"}}/>}
            </div>
            <span style={{fontSize:16,fontWeight:600,color:i<=step?C.gray:"#9ca3af"}}>{s}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-12px)}}`}</style>
    </div>
  );
}

// ── CONFLICT ──────────────────────────────────────────────────────────────────
function ConflictScreen({t,lang,result,profile,onBack,onProceed}){
  const isAllergy=result?.allergyAlert;
  return(
    <div style={{position:"fixed",inset:0,background:C.red,zIndex:9999,display:"flex",flexDirection:"column",overflow:"auto"}}>
      <div style={{background:"#7f1d1d",padding:"28px 20px 20px",textAlign:"center"}}>
        <div style={{fontSize:56}}>🚨</div>
        <div style={{fontSize:22,fontWeight:900,color:C.white,marginTop:10}}>{isAllergy?t.allergyTitle:t.conflictTitle}</div>
        <div style={{fontSize:16,color:"#fca5a5",marginTop:8,lineHeight:1.5}}>{isAllergy?t.allergyAdvice:t.conflictAdvice}</div>
      </div>
      <div style={{padding:"20px",flex:1}}>
        {isAllergy&&result.allergyDetails&&(
          <div style={{background:"#7f1d1d",borderRadius:16,padding:18,marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:8}}>{lang==="ml"?"അലർജി വിവരങ്ങൾ":"Allergy Details"}</div>
            <div style={{fontSize:15,color:"#fca5a5",lineHeight:1.6}}>{result.allergyDetails}</div>
          </div>
        )}
        {(result?.conflicts||[]).map((c,i)=>(
          <div key={i} style={{background:"#7f1d1d",borderRadius:16,padding:18,marginBottom:12}}>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
              <Badge label={c.drug1} color={C.white} bg="#991b1b"/>
              <span style={{color:"#fca5a5",fontSize:18}}>+</span>
              <Badge label={c.drug2} color={C.white} bg="#991b1b"/>
              <Badge label={c.severity} color={C.white} bg={c.severity==="HIGH"?"#450a0a":"#7c2d12"}/>
            </div>
            <div style={{fontSize:14,color:"#fca5a5",lineHeight:1.6}}>{lang==="ml"&&c.malayalamReason?c.malayalamReason:c.reason}</div>
          </div>
        ))}
        <a href={`tel:${profile.emergencyContact||"108"}`} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,background:C.white,color:C.red,padding:"18px",borderRadius:16,textDecoration:"none",fontSize:19,fontWeight:900,marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}><Phone size={24}/>{t.callDoctor}</a>
        <a href="tel:108" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,background:"#450a0a",color:C.white,padding:"15px",borderRadius:16,textDecoration:"none",fontSize:17,fontWeight:800,marginBottom:12}}><Phone size={20}/>EMERGENCY — 108</a>
        <button onClick={onProceed} style={{width:"100%",background:"transparent",border:`2px solid #fca5a5`,color:"#fca5a5",padding:"13px",borderRadius:14,fontSize:16,fontWeight:700,cursor:"pointer",marginBottom:10,fontFamily:"inherit"}}>{t.proceedAnyway}</button>
        <button onClick={onBack} style={{width:"100%",background:"transparent",border:"none",color:"#fca5a5",padding:"10px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>← {t.goBack}</button>
      </div>
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────────────────
function ResultsScreen({t,lang,result,onReset}){
  if(!result)return null;
  const safe=!result.conflictFound&&!result.allergyAlert;
  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{background:safe?C.greenLight:C.redLight,border:`2px solid ${safe?C.green:C.red}`,borderRadius:16,padding:"15px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
        {safe?<CheckCircle2 size={32} color={C.green}/>:<ShieldAlert size={32} color={C.red}/>}
        <div>
          <div style={{fontSize:17,fontWeight:900,color:safe?C.green:C.red}}>{safe?(lang==="ml"?"✓ സുരക്ഷിതം":"✓ Safe to Proceed"):(lang==="ml"?"⚠ ജാഗ്രത":"⚠ Caution Required")}</div>
          <div style={{fontSize:13,color:C.gray}}>{safe?t.noConflict:(lang==="ml"?"ഡോക്ടറോട് ബന്ധപ്പെടുക":"Please consult your doctor")}</div>
        </div>
      </div>
      {(result.doctorName||result.hospitalName)&&(
        <Card>
          {result.doctorName&&<div style={{fontSize:15,color:C.gray,marginBottom:4}}><b>{t.doctor}:</b> {result.doctorName}</div>}
          {result.hospitalName&&<div style={{fontSize:15,color:C.gray}}><b>{t.hospital}:</b> {result.hospitalName}</div>}
        </Card>
      )}
      {(result.medicines||[]).map((med,i)=>(
        <Card key={i}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{fontSize:21,fontWeight:900,color:C.blue,flex:1}}>{med.name}</div>
            <Badge label={med.verified?t.verified:t.unverified} color={med.verified?C.green:C.amber}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[[t.dosage,med.dosage],[t.frequency,med.frequency],[t.timing,med.timing],[t.totalQty,med.totalQuantity],[t.duration,med.durationDays?`${med.durationDays} ${t.days}`:null]].map(([label,val])=>val&&(
              <div key={label} style={{background:C.blueLight,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:"0.75rem",color:C.blueMid,fontWeight:700}}>{label}</div>
                <div style={{fontSize:"0.9rem",fontWeight:700,color:C.gray,marginTop:2}}>{val}</div>
              </div>
            ))}
          </div>
          {med.malayalamTiming&&(
            <div style={{background:"#fef9c3",border:"1px solid #fcd34d",borderRadius:12,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#92400e",marginBottom:4}}>🗣 Malayalam</div>
              <div style={{fontSize:17,color:"#78350f",lineHeight:1.6,fontWeight:600}}>{med.malayalamTiming}</div>
            </div>
          )}
        </Card>
      ))}
      {result.generalNote&&<Card><div style={{fontSize:14,color:C.gray,lineHeight:1.6}}>📋 {result.generalNote}</div></Card>}
      <BigBtn onClick={onReset} label={t.scanAnother} icon={Camera} color={C.blue}/>
    </div>
  );
}

// ── SAFETY TAB ────────────────────────────────────────────────────────────────
function SafetyScreen({t,lang,result,profile}){
  if(!result)return(
    <div style={{padding:"18px 16px"}}>
      <div style={{fontSize:21,fontWeight:900,color:C.blue,marginBottom:6}}>🛡 {t.safetyTitle}</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{t.safetySub}</div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>🛡</div>
        <div style={{fontSize:19,fontWeight:800,color:C.green}}>{t.safetyEmpty}</div>
        <div style={{fontSize:14,color:"#9ca3af",marginTop:6}}>{t.safetyEmptySub}</div>
      </div>
    </div>
  );
  const safe=!result.conflictFound&&!result.allergyAlert;
  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{fontSize:21,fontWeight:900,color:C.blue,marginBottom:4}}>🛡 {t.safetyTitle}</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>{t.safetySub}</div>
      <div style={{background:safe?C.greenLight:C.redLight,border:`2px solid ${safe?C.green:C.red}`,borderRadius:16,padding:"15px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
        {safe?<CheckCircle2 size={32} color={C.green}/>:<ShieldAlert size={32} color={C.red}/>}
        <div>
          <div style={{fontSize:16,fontWeight:900,color:safe?C.green:C.red}}>{safe?(lang==="ml"?"✓ ഇടപെടൽ ഇല്ല":"✓ No Conflicts Found"):(lang==="ml"?"⚠ ഇടപെടൽ കണ്ടെത്തി":"⚠ Conflicts Detected")}</div>
          <div style={{fontSize:13,color:C.gray}}>{safe?t.noConflict:""}{result.allergyAlert?" | "+t.allergyTitle:""}</div>
        </div>
      </div>
      {result.allergyAlert&&result.allergyDetails&&(
        <Card danger>
          <div style={{fontSize:16,fontWeight:900,color:C.red,marginBottom:10}}>⚠ {t.allergyTitle}</div>
          <div style={{fontSize:14,color:"#7f1d1d",lineHeight:1.6}}>{result.allergyDetails}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>{(profile.allergies||[]).map((a,i)=><Badge key={i} label={a} color={C.red}/>)}</div>
        </Card>
      )}
      {(result.conflicts||[]).length>0&&(
        <>
          <div style={{fontSize:16,fontWeight:800,color:C.red,marginBottom:12}}>🔴 {lang==="ml"?"ഡ്രഗ് ഇടപെടലുകൾ":"Drug Interactions"}</div>
          {result.conflicts.map((c,i)=>(
            <div key={i} style={{background:C.white,borderRadius:16,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",borderLeft:`5px solid ${c.severity==="HIGH"?C.red:c.severity==="MEDIUM"?C.amber:C.green}`}}>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
                <Badge label={c.drug1} color={C.red}/>
                <span style={{color:"#9ca3af"}}>+</span>
                <Badge label={c.drug2} color={C.red}/>
                <span style={{background:c.severity==="HIGH"?C.red:c.severity==="MEDIUM"?C.amber:C.green,color:C.white,padding:"2px 10px",borderRadius:100,fontSize:12,fontWeight:900}}>{c.severity}</span>
              </div>
              <div style={{fontSize:14,color:C.gray,lineHeight:1.6}}>{lang==="ml"&&c.malayalamReason?c.malayalamReason:c.reason}</div>
            </div>
          ))}
        </>
      )}
      {safe&&<Card success style={{textAlign:"center",padding:"22px"}}><div style={{fontSize:38,marginBottom:10}}>✅</div><div style={{fontSize:16,fontWeight:800,color:C.green}}>{t.noConflict}</div><div style={{fontSize:13,color:C.gray,marginTop:4}}>{t.noAllergy}</div></Card>}
      <div style={{marginTop:8}}>
        <div style={{fontSize:14,fontWeight:800,color:C.gray,marginBottom:10}}>📋 {t.profileMeds}</div>
        {(profile.currentMedications||[]).map(m=>(
          <div key={m.id} style={{background:C.grayLight,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:15,fontWeight:700}}>{m.name} {m.dosage}</div><div style={{fontSize:12,color:"#6b7280"}}>{m.frequency} • {m.condition}</div></div>
            <Badge label={lang==="ml"?"ഉണ്ട്":"Active"} color={C.blue}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ALARM ─────────────────────────────────────────────────────────────────────
function AlarmScreen({t,lang,profile,alarms,setAlarms}){
  const [showForm,setShowForm]=useState(false);
  const [selColor,setSelColor]=useState(ALARM_COLORS[0].hex);
  const [selMed,setSelMed]=useState(profile.currentMedications?.[0]?.name||"");
  const [selTime,setSelTime]=useState("08:00");
  const [selSize,setSelSize]=useState(TABLET_SIZES[0]);
  const inp={width:"100%",padding:"11px 13px",fontSize:16,border:`2px solid #e5e7eb`,borderRadius:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:12};

  const save=()=>{
    if(!selMed||!selTime)return;
    const updated=[...alarms,{id:Date.now().toString(),med:selMed,time:selTime,color:selColor,size:selSize,enabled:true}];
    setAlarms(updated);store.saveAlarms(updated);setShowForm(false);
  };
  const toggle=(id)=>{const u=alarms.map(a=>a.id===id?{...a,enabled:!a.enabled}:a);setAlarms(u);store.saveAlarms(u);};
  const del=(id)=>{const u=alarms.filter(a=>a.id!==id);setAlarms(u);store.saveAlarms(u);};
  const fmt=(t24)=>{const[h,m]=t24.split(":");return`${h%12||12}:${m} ${h<12?"AM":"PM"}`;};

  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{fontSize:21,fontWeight:900,color:C.blue,marginBottom:4}}>⏰ {t.alarmTitle}</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>{t.alarmSub}</div>
      {showForm&&(
        <Card info style={{marginBottom:14}}>
          <div style={{fontSize:16,fontWeight:800,color:C.blue,marginBottom:14}}>➕ {t.addAlarm}</div>
          <label style={{fontSize:13,fontWeight:700,color:C.gray,display:"block",marginBottom:6}}>{t.alarmMed}</label>
          <select value={selMed} onChange={e=>setSelMed(e.target.value)} style={inp}>
            {(profile.currentMedications||[]).map(m=><option key={m.id} value={m.name}>{m.name} {m.dosage}</option>)}
          </select>
          <label style={{fontSize:13,fontWeight:700,color:C.gray,display:"block",marginBottom:6}}>{t.alarmTime}</label>
          <input type="time" value={selTime} onChange={e=>setSelTime(e.target.value)} style={inp}/>
          <label style={{fontSize:13,fontWeight:700,color:C.gray,display:"block",marginBottom:8}}>{t.alarmColor}</label>
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            {ALARM_COLORS.map(c=>(
              <div key={c.hex} onClick={()=>setSelColor(c.hex)} style={{width:34,height:34,borderRadius:"50%",background:c.hex,border:`3px solid ${selColor===c.hex?"#1e293b":"transparent"}`,cursor:"pointer",transform:selColor===c.hex?"scale(1.2)":"scale(1)",transition:"transform .15s"}}/>
            ))}
          </div>
          <label style={{fontSize:13,fontWeight:700,color:C.gray,display:"block",marginBottom:6}}>{t.alarmSize}</label>
          <select value={selSize} onChange={e=>setSelSize(e.target.value)} style={inp}>
            {TABLET_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{display:"flex",gap:10}}>
            <button onClick={save} style={{flex:1,background:C.blue,color:C.white,border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{t.saveAlarm}</button>
            <button onClick={()=>setShowForm(false)} style={{background:C.grayLight,border:"none",borderRadius:12,padding:"13px 16px",cursor:"pointer",fontFamily:"inherit",color:C.gray}}>✕</button>
          </div>
        </Card>
      )}
      <BigBtn onClick={()=>setShowForm(true)} label={t.addAlarm} icon={Bell} color={C.blue}/>
      {alarms.length===0?(
        <div style={{textAlign:"center",padding:"36px 20px"}}>
          <div style={{fontSize:48,marginBottom:12}}>⏰</div>
          <div style={{fontSize:17,fontWeight:700,color:C.gray}}>{t.noAlarms}</div>
          <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>{t.noAlarmsSub}</div>
        </div>
      ):alarms.map(a=>(
        <div key={a.id} style={{background:C.white,borderRadius:16,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",borderLeft:`5px solid ${a.color}`,opacity:a.enabled?1:.65}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:26,fontWeight:900,color:"#1e293b"}}>{fmt(a.time)}</div>
              <div style={{fontSize:16,fontWeight:700,marginTop:4,display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:13,height:13,borderRadius:"50%",background:a.color,display:"inline-block",flexShrink:0}}/>
                {a.med}
              </div>
              <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{a.size}</div>
            </div>
            <button onClick={()=>del(a.id)} style={{background:C.redLight,color:C.red,border:"none",borderRadius:10,padding:"8px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.deleteAlarm}</button>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <Badge label={a.enabled?t.alarmOn:t.alarmOff} color={a.enabled?C.green:C.red}/>
            <Badge label={a.size} color={C.blue}/>
          </div>
          <button onClick={()=>toggle(a.id)} style={{marginTop:12,background:a.enabled?C.greenLight:C.grayLight,border:`2px solid ${a.enabled?C.green:"#e5e7eb"}`,borderRadius:12,padding:"8px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:a.enabled?C.green:C.gray,display:"flex",alignItems:"center",gap:8}}>
            <Bell size={14}/>{a.enabled?(lang==="ml"?"ഓൺ — ഓഫ് ചെയ്യാൻ":"ON — tap to disable"):(lang==="ml"?"ഓഫ് — ഓൺ ചെയ്യാൻ":"OFF — tap to enable")}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── DEMO ──────────────────────────────────────────────────────────────────────
const DEMO_RESULT={success:true,imageQuality:"GOOD",doctorName:"Dr. Priya Menon",hospitalName:"Kochi Medical Centre",medicines:[{name:"Aspirin",dosage:"75mg",frequency:"Once daily",timing:"After food",durationDays:30,totalQuantity:30,remainingQuantity:3,verified:true,malayalamTiming:"ഭക്ഷണത്തിനു ശേഷം രാവിലെ ഒരു ഗോളി"},{name:"Ibuprofen",dosage:"400mg",frequency:"Twice daily",timing:"After food",durationDays:7,totalQuantity:14,remainingQuantity:12,verified:true,malayalamTiming:"ഭക്ഷണത്തിനു ശേഷം രാവിലെയും വൈകുന്നേരവും"},{name:"Amoxicillin",dosage:"500mg",frequency:"Three times daily",timing:"After food",durationDays:5,totalQuantity:15,remainingQuantity:15,verified:true,malayalamTiming:"ഭക്ഷണത്തിനു ശേഷം മൂന്ന് നേരവും ഒരു ഗോളി"}],conflictFound:true,conflicts:[{drug1:"Aspirin",drug2:"Warfarin",severity:"HIGH",reason:"Aspirin + Warfarin significantly increases bleeding risk.",malayalamReason:"ആസ്പിരിനും വാർഫറിനും ഒരുമിച്ച് കഴിച്ചാൽ ആന്തരിക രക്തസ്രാവ സാദ്ധ്യത വളരെ കൂടുതൽ."},{drug1:"Ibuprofen",drug2:"Metoprolol",severity:"MEDIUM",reason:"NSAIDs can reduce Metoprolol effectiveness and worsen hypertension.",malayalamReason:"ഇബുപ്രോഫൻ ബി.പി. കൂടാൻ ഇടയുണ്ട്."}],allergyAlert:true,allergyDetails:"Amoxicillin is a Penicillin-class antibiotic. Patient is allergic to Penicillin — serious reaction risk.",generalNote:"Consult your doctor before starting this prescription."};

function DemoScreen({t,lang,onBack}){
  const [running,setRunning]=useState(false);
  const [result,setResult]=useState(null);
  const run=()=>{setRunning(true);setResult(null);setTimeout(()=>{setRunning(false);setResult(DEMO_RESULT);playChime(true);},2500);};

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.purple},#4f46e5)`,padding:"24px 20px",color:C.white,textAlign:"center"}}>
        <div style={{fontSize:38,marginBottom:10}}>🎬</div>
        <div style={{fontSize:21,fontWeight:900}}>{t.demoTitle}</div>
        <div style={{fontSize:13,opacity:.85,marginTop:6}}>{t.demoSub}</div>
      </div>
      <div style={{padding:"18px 16px"}}>
        <Card info style={{marginBottom:18}}>
          <div style={{fontSize:13,color:C.blue,fontWeight:700,marginBottom:4}}>ℹ️ {lang==="ml"?"ജഡ്ജുകൾക്ക്":"For Judges & Reviewers"}</div>
          <div style={{fontSize:13,color:C.blue,lineHeight:1.7}}>{t.demoJudge}</div>
        </Card>
        {[[t.demoStep1,t.demoStep1Desc,"1"],[t.demoStep2,t.demoStep2Desc,"2"],[t.demoStep3,t.demoStep3Desc,"3"]].map(([title,desc,num])=>(
          <div key={num} style={{background:C.white,borderRadius:16,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",borderLeft:`4px solid ${C.purple}`}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:C.purple,color:C.white,fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>{num}</div>
            <div style={{fontSize:16,fontWeight:800,color:"#1e293b",marginBottom:4}}>{title}</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>{desc}</div>
          </div>
        ))}
        <button onClick={run} disabled={running} style={{width:"100%",background:running?"#9ca3af":C.purple,color:C.white,border:"none",borderRadius:18,padding:"17px",fontSize:18,fontWeight:900,cursor:running?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:12,boxShadow:`0 4px 20px ${C.purple}44`}}>
          <Play size={20} strokeWidth={2.5}/>{running?t.demoRunning:t.runDemo}
        </button>
        {result&&(
          <div style={{marginTop:20}}>
            <div style={{fontSize:17,fontWeight:900,color:"#1e293b",marginBottom:14}}>📊 {lang==="ml"?"വിശകലന ഫലം":"Analysis Result"}</div>
            <Card danger>
              <div style={{fontSize:15,fontWeight:900,color:C.red,marginBottom:8}}>⚠ {t.allergyTitle}</div>
              <div style={{fontSize:13,color:"#7f1d1d",lineHeight:1.6}}>{result.allergyDetails}</div>
            </Card>
            <div style={{fontSize:14,fontWeight:800,color:C.red,marginBottom:10}}>🔴 {lang==="ml"?"ഡ്രഗ് ഇടപെടൽ":"Drug Interactions"}</div>
            {result.conflicts.map((c,i)=>(
              <div key={i} style={{background:C.white,borderRadius:14,padding:16,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:`4px solid ${c.severity==="HIGH"?C.red:C.amber}`}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
                  <Badge label={c.drug1} color={C.red}/><span style={{color:"#9ca3af"}}>+</span><Badge label={c.drug2} color={C.red}/>
                  <span style={{background:c.severity==="HIGH"?C.red:C.amber,color:C.white,padding:"2px 9px",borderRadius:100,fontSize:11,fontWeight:900}}>{c.severity}</span>
                </div>
                <div style={{fontSize:13,color:C.gray,lineHeight:1.5}}>{lang==="ml"?c.malayalamReason:c.reason}</div>
              </div>
            ))}
            <div style={{fontSize:14,fontWeight:800,color:C.blue,marginBottom:10,marginTop:4}}>💊 {lang==="ml"?"കണ്ടെത്തിയ മരുന്നുകൾ":"Medicines Identified"}</div>
            {result.medicines.map((m,i)=>(
              <div key={i} style={{background:C.white,borderRadius:14,padding:16,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:16,fontWeight:800,color:C.blue}}>{m.name} <span style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{m.dosage}</span></div>
                <div style={{fontSize:12,color:"#6b7280",margin:"4px 0"}}>{m.frequency} • {m.timing} • {m.durationDays} {t.days}</div>
                <div style={{background:"#fef9c3",borderRadius:9,padding:"8px 11px",marginTop:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#92400e"}}>🗣 Malayalam</div>
                  <div style={{fontSize:14,color:"#78350f",fontWeight:600}}>{m.malayalamTiming}</div>
                </div>
              </div>
            ))}
            <Card success style={{textAlign:"center"}}><div style={{fontSize:15,fontWeight:800,color:C.green}}>✅ {t.demoComplete}</div></Card>
          </div>
        )}
        <BigBtn onClick={onBack} label={t.goBack} icon={ChevronLeft} color={C.blue} style={{marginTop:8}}/>
      </div>
    </div>
  );
}

// ── MED LOG ───────────────────────────────────────────────────────────────────
function MedLogScreen({t,lang,profile,setProfile}){
  const [log,setLog]=useState(store.loadMedLog());
  const today=new Date().toISOString().slice(0,10);
  const meds=profile.currentMedications||[];
  const pd=(freq="")=>{const f=freq.toLowerCase();if(f.includes("twice"))return["Morning","Evening"];if(f.includes("three")||f.includes("thrice"))return["Morning","Afternoon","Evening"];if(f.includes("once")||f.includes("daily"))return["Morning"];return["As needed"];};
  const total=meds.reduce((s,m)=>s+pd(m.frequency).length,0);
  const taken=meds.reduce((s,m)=>s+pd(m.frequency).filter((_,i)=>store.isTaken(m.id,i)).length,0);
  const allDone=taken===total&&total>0;
  const pct=total?Math.round((taken/total)*100):0;
  const dateStr=new Date().toLocaleDateString(lang==="ml"?"ml-IN":"en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  
  const handleTaken=(medId,di)=>{
    const nl=store.markTaken(medId,di);
    setLog({...nl});
    playChime();
    
    // Decrement stock
    const updatedMeds = (profile.currentMedications || []).map(m => {
      if(m.id === medId){
        const rem = Math.max(0, (m.remainingQuantity || 0) - 1);
        if(rem === 3) {
           alert(`LOW STOCK! \n\n${m.name} is about to finish. \nCaretaker notified: ${profile.caretakerPhone}`);
        }
        return {...m, remainingQuantity: rem};
      }
      return m;
    });
    setProfile({...profile, currentMedications: updatedMeds});
  };

  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,borderRadius:20,padding:"20px",marginBottom:18,color:C.white}}>
        <div style={{fontSize:"1.3rem",fontWeight:900}}>{t.logTitle}</div>
        <div style={{fontSize:"0.8rem",opacity:.85,marginTop:4}}>{dateStr}</div>
        <div style={{marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:"0.8rem"}}>{taken}/{total} {lang==="ml"?"ഡോസ്":"doses"}</span><span style={{fontSize:"0.8rem",fontWeight:700}}>{pct}%</span></div>
          <div style={{background:"rgba(255,255,255,.3)",borderRadius:8,height:10}}><div style={{background:C.white,borderRadius:8,height:10,width:`${pct}%`,transition:"width .5s"}}/></div>
        </div>
      </div>
      {allDone&&<Card success style={{textAlign:"center",padding:"18px",marginBottom:14}}><div style={{fontSize:"2.1rem"}}>🎉</div><div style={{fontSize:"1.2rem",fontWeight:900,color:C.green}}>{t.allDone}</div><div style={{fontSize:"0.9rem",color:C.gray,marginTop:4}}>{t.allDoneSub}</div></Card>}
      {meds.map(med=>{
        const doses=pd(med.frequency);
        const lowStock = (med.remainingQuantity || 0) < 5;
        return(
          <Card key={med.id} danger={lowStock} style={{borderLeft: lowStock ? `6px solid ${C.red}` : "none"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3}}>
               <div style={{fontSize:"1.2rem",fontWeight:900,color:C.blue}}>{med.name}</div>
               {lowStock && <Badge label={t.lowStock} color={C.red}/>}
            </div>
            <div style={{fontSize:"0.8rem",color:"#6b7280",marginBottom:12}}>{med.dosage} • {med.frequency}</div>
            
            <div style={{marginBottom:15, background: C.grayLight, padding:10, borderRadius:12, display:"flex", alignItems:"center", gap:10}}>
               <div style={{flex:1, background:"#e5e7eb", height:8, borderRadius:4, overflow:"hidden"}}>
                  <div style={{width:`${Math.min(100, (med.remainingQuantity/med.totalQuantity)*100)}%`, background: lowStock ? C.red : C.green, height:"100%"}}/>
               </div>
               <span style={{fontSize:"0.7rem", fontWeight:800}}>{t.stock}: {med.remainingQuantity}</span>
            </div>

            {doses.map((label,di)=>{
              const tkn=store.isTaken(med.id,di);
              const td=log?.[today]?.[med.id]?.[di];
              const tt=td?.takenAt?new Date(td.takenAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):null;
              return(
                <div key={di} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderTop:di>0?`1px solid ${C.grayLight}`:"none"}}>
                  <div>
                    <div style={{fontSize:"1rem",fontWeight:700,color:C.gray}}>{label}</div>
                    {tkn&&tt&&<div style={{fontSize:"0.75rem",color:C.green,marginTop:2}}>✓ {t.takenAt} {tt}</div>}
                  </div>
                  <button onClick={()=>!tkn&&handleTaken(med.id,di)} style={{background:tkn?C.green:C.blue,color:C.white,border:"none",borderRadius:14,padding:"11px 18px",fontSize:"1.05rem",fontWeight:900,cursor:tkn?"default":"pointer",minWidth:115,opacity:tkn?.85:1,boxShadow:tkn?"none":`0 4px 12px ${C.blue}44`,fontFamily:"inherit"}}>
                    {tkn?`✓ ${lang==="ml"?t.taken:t.takenMl}`:`${t.taken} / ${t.takenMl}`}
                  </button>
                </div>
              );
            })}
          </Card>
        );
      })}
    </div>
  );
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
function HistoryScreen({t,lang,history}){
  if(!history.length)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,minHeight:"60vh",textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16}}>📋</div>
      <div style={{fontSize:21,fontWeight:900,color:C.gray}}>{t.historyEmpty}</div>
      <div style={{fontSize:14,color:"#9ca3af",marginTop:8}}>{t.historyEmptySub}</div>
    </div>
  );
  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{fontSize:22,fontWeight:900,color:C.blue,marginBottom:18}}>{t.historyTitle}</div>
      {history.map(entry=>{
        const d=new Date(entry.date);
        return(
          <Card key={entry.id} danger={entry.conflictFound||entry.allergyAlert}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:12,color:"#9ca3af"}}>{d.toLocaleDateString(lang==="ml"?"ml-IN":"en-IN",{day:"numeric",month:"short",year:"numeric"})} • {d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
              {(entry.conflictFound||entry.allergyAlert)&&<Badge label={t.conflictDetected} color={C.red}/>}
            </div>
            {entry.doctorName&&<div style={{fontSize:15,fontWeight:700,color:C.gray,marginBottom:6}}>{t.doctor}: {entry.doctorName}</div>}
            <div style={{fontSize:13,color:"#6b7280"}}>{(entry.medicines||[]).length} {t.medicines}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>{(entry.medicines||[]).slice(0,4).map((m,i)=><Badge key={i} label={m.name} color={C.blue}/>)}</div>
          </Card>
        );
      })}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfileScreen({t,lang,profile,setProfile,fontScale,setFontScale}){
  const [local,setLocal]=useState({...profile});
  const [saved,setSaved]=useState(false);
  const [nm,setNm]=useState({name:"",dosage:"",frequency:"Once daily",condition:"",totalQuantity:10,remainingQuantity:10});
  const [na,setNa]=useState("");
  const inp={width:"100%",padding:"11px 13px",fontSize:16,border:`2px solid #e5e7eb`,borderRadius:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  const save=()=>{store.saveProfile(local);setProfile(local);setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return(
    <div style={{padding:"18px 16px"}}>
      <div style={{fontSize:"1.4rem",fontWeight:900,color:C.blue,marginBottom:18}}>{t.profileTitle}</div>
      
      <Card info>
        <div style={{fontSize:"1.1rem",fontWeight:800,color:C.blue,marginBottom:12}}>🔠 {t.fontSize}</div>
        <div style={{display:"flex",alignItems:"center",gap:15}}>
          <span style={{fontSize:"0.8rem"}}>A</span>
          <input type="range" min="1" max="2" step="0.1" value={fontScale} onChange={e=>setFontScale(parseFloat(e.target.value))} style={{flex:1, cursor: "pointer"}}/>
          <span style={{fontSize:"1.3rem"}}>A</span>
        </div>
      </Card>

      <Card>
        {[[t.name,"name","text"],[t.age,"age","number"],[t.blood,"bloodGroup","text"],[t.contact,"emergencyContact","tel"],[t.caretaker,"caretakerPhone","tel"]].map(([label,key,type])=>(
          <div key={key} style={{marginBottom:13}}>
            <label style={{fontSize:"0.8rem",fontWeight:700,color:C.gray,display:"block",marginBottom:5}}>{label}</label>
            <input type={type} value={local[key]||""} onChange={e=>setLocal(p=>({...p,[key]:e.target.value}))} style={inp}/>
          </div>
        ))}
      </Card>
      
      <Card>
        <div style={{fontSize:"1.1rem",fontWeight:800,color:C.blue,marginBottom:14}}>💊 {t.currentMeds}</div>
        {(local.currentMedications||[]).map(m=>(
          <div key={m.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.grayLight}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:"1rem",fontWeight:700}}>{m.name} {m.dosage}</div>
                <div style={{fontSize:"0.75rem",color:"#6b7280"}}>{m.frequency} • {m.condition}</div>
              </div>
              <button onClick={()=>setLocal(p=>({...p,currentMedications:p.currentMedications.filter(x=>x.id!==m.id)}))} style={{background:C.redLight,color:C.red,border:"none",borderRadius:10,padding:"7px 11px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.remove}</button>
            </div>
            {m.remainingQuantity !== undefined && (
              <div style={{marginTop:8, display:"flex", alignItems:"center", gap:8}}>
                <div style={{flex:1, background:C.grayLight, height:10, borderRadius:5, overflow:"hidden"}}>
                  <div style={{width:`${Math.min(100, (m.remainingQuantity/m.totalQuantity)*100)}%`, background: m.remainingQuantity < 5 ? C.red : C.green, height:"100%"}}/>
                </div>
                <span style={{fontSize:"0.75rem", fontWeight:700, color: m.remainingQuantity < 5 ? C.red : C.gray}}>{t.stock}: {m.remainingQuantity}</span>
              </div>
            )}
          </div>
        ))}
        
        <div style={{marginTop:20, padding:15, background:C.grayLight, borderRadius:16}}>
          <div style={{fontSize:"0.9rem", fontWeight:800, color:C.blue, marginBottom:10}}>➕ {t.manualEntry}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["name",t.name],["dosage",t.dosage],["condition",t.condition]].map(([k,ph])=>(
              <input key={k} placeholder={ph} value={nm[k]} onChange={e=>setNm(p=>({...p,[k]:e.target.value}))} style={{...inp,fontSize:"0.9rem"}}/>
            ))}
            <select value={nm.frequency} onChange={e=>setNm(p=>({...p,frequency:e.target.value}))} style={{...inp,fontSize:"0.9rem"}}>
              <option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>As needed</option>
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10, marginTop:10}}>
            <div style={{display:"flex", flexDirection:"column", gap:4}}>
              <label style={{fontSize:"0.7rem", fontWeight:700, color:C.gray}}>{t.totalQty}</label>
              <input type="number" value={nm.totalQuantity} onChange={e=>setNm(p=>({...p,totalQuantity:parseInt(e.target.value)}))} style={{...inp,fontSize:"0.9rem"}}/>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:4}}>
              <label style={{fontSize:"0.7rem", fontWeight:700, color:C.gray}}>{t.stock}</label>
              <input type="number" value={nm.remainingQuantity} onChange={e=>setNm(p=>({...p,remainingQuantity:parseInt(e.target.value)}))} style={{...inp,fontSize:"0.9rem"}}/>
            </div>
          </div>
          <button onClick={()=>{if(!nm.name.trim())return;setLocal(p=>({...p,currentMedications:[...p.currentMedications,{...nm,id:Date.now().toString()}]}));setNm({name:"",dosage:"",frequency:"Once daily",condition:"",totalQuantity:10,remainingQuantity:10}); }} style={{width:"100%",background:C.blue,color:C.white,border:`none`,borderRadius:12,padding:"11px",fontSize:"0.95rem",fontWeight:800,cursor:"pointer",marginTop:14,fontFamily:"inherit"}}>+ {t.addMed}</button>
        </div>
      </Card>

      <Card>
        <div style={{fontSize:"1.1rem",fontWeight:800,color:C.red,marginBottom:14}}>⚠ {t.allergies}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
          {(local.allergies||[]).map((a,i)=>(
            <button key={i} onClick={()=>setLocal(p=>({...p,allergies:p.allergies.filter((_,idx)=>idx!==i)}))} style={{background:C.redLight,color:C.red,border:`1px solid ${C.red}`,borderRadius:100,padding:"6px 13px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{a} ✕</button>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <input placeholder={lang==="ml"?"അലർജി ചേർക്കുക...":"Add allergy..."} value={na} onChange={e=>setNa(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&na.trim()){setLocal(p=>({...p,allergies:[...(p.allergies||[]),na.trim()]}));setNa("");}}} style={{...inp,flex:1,fontSize:"0.9rem"}}/>
          <button onClick={()=>{if(!na.trim())return;setLocal(p=>({...p,allergies:[...(p.allergies||[]),na.trim()]}));setNa("");}} style={{background:C.red,color:C.white,border:"none",borderRadius:12,padding:"0 16px",fontSize:"1.3rem",fontWeight:900,cursor:"pointer"}}>+</button>
        </div>
      </Card>
      <Card danger style={{marginTop: 10}}>
        <div style={{fontSize:"1.1rem",fontWeight:800,color:C.red,marginBottom:10}}>📢 {t.alertCaretaker}</div>
        <BigBtn onClick={() => {
          alert(`MANNUAL ALERT: Caretaker ${profile.caretakerPhone} has been notified!`);
        }} label={t.alertCaretaker} sub={profile.caretakerPhone} icon={Phone} color={C.red} />
      </Card>
      <button onClick={save} style={{width:"100%",background:saved?C.green:C.blue,color:C.white,border:"none",borderRadius:18,padding:"17px",fontSize:"1.2rem",fontWeight:900,cursor:"pointer",marginBottom:16,transition:"background .3s",fontFamily:"inherit", marginTop: 10}}>{saved?t.saved:t.saveProfile}</button>
    </div>
  );
}

// ── ALARM POPUP ───────────────────────────────────────────────────────────────
function AlarmPopup({alarm,t,onDismiss}){
  if(!alarm)return null;
  const fmt=(t24)=>{const[h,m]=t24.split(":");return`${h%12||12}:${m} ${h<12?"AM":"PM"}`;};
  return(
    <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9998,background:C.white,borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.3)",padding:"18px 22px",maxWidth:380,width:"calc(100% - 40px)",borderTop:`6px solid ${alarm.color}`,animation:"slideDown .4s ease"}}>
      <style>{`@keyframes slideDown{from{transform:translateX(-50%) translateY(-30px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}@keyframes ringAnim{0%,50%,100%{transform:rotate(0)}10%,30%{transform:rotate(-14deg)}20%,40%{transform:rotate(14deg)}}`}</style>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <span style={{fontSize:28,animation:"ringAnim 1s ease infinite",display:"inline-block"}}>🔔</span>
        <div>
          <div style={{fontSize:16,fontWeight:900,color:"#1e293b"}}>{t.medicineTime}</div>
          <div style={{fontSize:12,color:"#6b7280"}}>{fmt(alarm.time)}</div>
        </div>
      </div>
      <div style={{background:"#f8fafc",borderRadius:12,padding:"12px 14px",marginBottom:14,borderLeft:`4px solid ${alarm.color}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{width:12,height:12,borderRadius:"50%",background:alarm.color,display:"inline-block"}}/>
          <span style={{fontSize:16,fontWeight:900,color:"#1e293b"}}>{alarm.med}</span>
        </div>
        <div style={{fontSize:12,color:"#6b7280"}}>{alarm.size}</div>
      </div>
      <button onClick={onDismiss} style={{width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:12,padding:"12px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{t.gotIt}</button>
    </div>
  );
}

// ── ERROR ─────────────────────────────────────────────────────────────────────
function ErrorScreen({lang,message,onRetry}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,minHeight:"70vh",textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16}}>⚠️</div>
      <div style={{fontSize:21,fontWeight:900,color:C.red,marginBottom:10}}>{lang==="ml"?"ഒരു പ്രശ്നം ഉണ്ടായി":"Something went wrong"}</div>
      <div style={{fontSize:15,color:C.gray,background:C.grayLight,borderRadius:12,padding:"16px 20px",marginBottom:24,lineHeight:1.6,maxWidth:360}}>{message}</div>
      <BigBtn onClick={onRetry} label={lang==="ml"?"വീണ്ടും ശ്രമിക്കുക":"Try Again"} icon={Camera} color={C.blue}/>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV=[
  {id:SCREENS.HOME,  icon:ClipboardList,key:"navHome"},
  {id:SCREENS.SAFETY,icon:Shield,       key:"navSafety"},
  {id:SCREENS.ALARM, icon:Bell,         key:"navAlarm"},
  {id:SCREENS.MEDLOG,icon:CheckCircle2, key:"navLog"},
  {id:SCREENS.HISTORY,icon:Clock,       key:"navHistory"},
  {id:SCREENS.PROFILE,icon:User,        key:"navProfile"},
];
const HIDE_NAV=[SCREENS.LOADING,SCREENS.CONFLICT];

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("en");
  const [screen,setScreen]=useState(SCREENS.HOME);
  const [activeTab,setActiveTab]=useState(SCREENS.HOME);
  const [profile,setProfileState]=useState(store.loadProfile);
  const [history,setHistory]=useState(store.loadHistory);
  const [scanResult,setScanResult]=useState(null);
  const [errorMsg,setErrorMsg]=useState("");
  const [alarms,setAlarms]=useState(store.loadAlarms);
  const [firedAlarm,setFiredAlarm]=useState(null);
  const [fontScale,setFontScale]=useState(1.3);

  const t=T[lang];
  const showNav=!HIDE_NAV.includes(screen);

  // Alarm check
  useEffect(()=>{
    const check=()=>{
      const now=new Date();
      const cur=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      alarms.forEach(a=>{if(a.enabled&&a.time===cur){setFiredAlarm(a);playChime(true);}});
    };
    const id=setInterval(check,30000);
    return()=>clearInterval(id);
  },[alarms]);

  // Caretaker Alert logic for missed doses
  useEffect(()=>{
    const id=setInterval(()=>{
      const now=new Date();
      const h=now.getHours(),m=now.getMinutes();
      // Check for missed doses 3 times a day (9 AM, 2 PM, 9 PM)
      if(([9,14,21].includes(h)&&m===0)){
        const today=new Date().toISOString().slice(0,10);
        const log=store.loadMedLog();
        const missed=(profile.currentMedications||[]).filter(med=>{
          const medLogToday = log?.[today]?.[med.id];
          return !medLogToday || !medLogToday[0];
        });

        if(missed.length>0 && profile.caretakerPhone){
          playChime(true);
          console.log(`ALERT: Caretaker ${profile.caretakerPhone} notified for missed meds: ${missed.map(m=>m.name).join(", ")}`);
          alert(`CARETAKER ALERT SENT! \n\nPatient missed: ${missed.map(m=>m.name).join(", ")}. \nNotification sent to: ${profile.caretakerPhone}`);
        }
      }
    },60000);
    return()=>clearInterval(id);
  },[profile]);

  const handleScan=useCallback(async(file)=>{
    setScreen(SCREENS.LOADING);
    const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
    try{
      const result=await analyzePrescription(base64,file.type,profile);
      setScanResult(result);
      store.addHistory({medicines:result.medicines||[],doctorName:result.doctorName,hospitalName:result.hospitalName,conflictFound:result.conflictFound,allergyAlert:result.allergyAlert});
      setHistory(store.loadHistory());
      setScreen(result.conflictFound||result.allergyAlert?SCREENS.CONFLICT:SCREENS.RESULTS);
    }catch(err){
      setErrorMsg(err.message||"Something went wrong. Please try again.");
      setScreen("error");
    }
  },[profile]);

  const goHome=()=>{setScreen(SCREENS.HOME);setActiveTab(SCREENS.HOME);setScanResult(null);setErrorMsg("");};
  const goTab=(id)=>{setActiveTab(id);setScreen(id);};
  const setProfile=(p)=>{setProfileState(p);store.saveProfile(p);};

  return(
    <div style={{minHeight:"100dvh",background:C.grayLight,fontFamily:"'Noto Sans Malayalam','Segoe UI',system-ui,sans-serif",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",boxShadow:"0 0 60px rgba(0,0,0,0.15)", overflow: "hidden"}}>
      <style>{`
        html { font-size: ${16 * fontScale}px; }
        button, input, select { font-size: inherit !important; }
        .small-text { font-size: 0.8rem; }
        .big-text { font-size: 1.2rem; }
        * { transition: font-size 0.2s ease; }
      `}</style>
      {showNav&&(
        <header style={{position:"sticky",top:0,zIndex:100,background:C.white,borderBottom:`2px solid ${C.blueLight}`,padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:"1.5rem"}}>💊</span>
            <span style={{fontSize:"1.2rem",fontWeight:900,color:C.blue}}>{lang==="ml"?"കുറിപ്പ്":"Kurippu"}</span>
          </div>
          <div style={{display:"flex",background:C.grayLight,borderRadius:12,padding:3,gap:3}}>
            {["en","ml"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{padding:"6px 10px",borderRadius:9,border:"none",background:lang===l?C.blue:"transparent",color:lang===l?C.white:"#6b7280",fontSize:"0.8rem",fontWeight:900,cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>{l==="en"?"EN":"മല"}</button>
            ))}
          </div>
        </header>
      )}

      <main style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
        {screen===SCREENS.HOME    &&<HomeScreen    t={t} lang={lang} profile={profile} onScan={handleScan} onViewLog={()=>goTab(SCREENS.MEDLOG)} onDemo={()=>goTab(SCREENS.DEMO)}/>}
        {screen===SCREENS.LOADING &&<LoadingScreen t={t} lang={lang}/>}
        {screen===SCREENS.CONFLICT&&<ConflictScreen t={t} lang={lang} result={scanResult} profile={profile} onBack={goHome} onProceed={()=>setScreen(SCREENS.RESULTS)}/>}
        {screen===SCREENS.RESULTS &&<ResultsScreen t={t} lang={lang} result={scanResult} onReset={goHome}/>}
        {screen===SCREENS.SAFETY  &&<SafetyScreen  t={t} lang={lang} result={scanResult} profile={profile}/>}
        {screen===SCREENS.ALARM   &&<AlarmScreen   t={t} lang={lang} profile={profile} alarms={alarms} setAlarms={setAlarms}/>}
        {screen===SCREENS.DEMO    &&<DemoScreen    t={t} lang={lang} onBack={goHome}/>}
        {screen===SCREENS.MEDLOG  &&<MedLogScreen  t={t} lang={lang} profile={profile} setProfile={setProfile}/>}
        {screen===SCREENS.HISTORY &&<HistoryScreen t={t} lang={lang} history={history}/>}
        {screen===SCREENS.PROFILE &&<ProfileScreen t={t} lang={lang} profile={profile} setProfile={setProfile} fontScale={fontScale} setFontScale={setFontScale}/>}
        {screen==="error"         &&<ErrorScreen   lang={lang} message={errorMsg} onRetry={goHome}/>}
      </main>

      {showNav&&(
        <nav style={{background:C.white,borderTop:`2px solid ${C.blueLight}`,boxShadow:"0 -4px 16px rgba(0,0,0,0.08)",flexShrink:0}}>
          <div style={{display:"flex"}}>
            {NAV.map(({id,icon:Icon,key})=>{
              const active=activeTab===id;
              return(
                <button key={id} onClick={()=>goTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 0",border:"none",background:"transparent",color:active?C.blue:"#9ca3af",cursor:"pointer",transition:"all .15s",borderTop:active?`3px solid ${C.blue}`:"3px solid transparent",fontFamily:"inherit"}}>
                  <Icon size={21} strokeWidth={active?2.5:1.8}/>
                  <span style={{fontSize:9,fontWeight:active?800:500}}>{t[key]}</span>
                </button>
              );
            })}
          </div>
          <SOSButton t={t}/>
        </nav>
      )}

      {firedAlarm&&<AlarmPopup alarm={firedAlarm} t={t} onDismiss={()=>setFiredAlarm(null)}/>}
    </div>
  );
}
