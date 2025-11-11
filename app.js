
const S = (sel)=>document.querySelector(sel);
const SA = (sel)=>document.querySelectorAll(sel);
const CFG = window.APP_CONFIG || {};

// خطوات
const steps = [S('#step1'), S('#step2'), S('#step3'), S('#step4')];
function go(i){ steps.forEach((el,idx)=> el.classList.toggle('hidden', idx!==i)); window.scrollTo({top:0,behavior:'smooth'}); updatePills(i); }
function updatePills(i){ SA('.pill').forEach((p,idx)=> p.classList.toggle('active', idx===i)); }

S('#to2').addEventListener('click', ()=>go(1));
S('#back1').addEventListener('click', ()=>go(0));
S('#to3').addEventListener('click', ()=>{ buildRecommendations(); go(2); });
S('#back2').addEventListener('click', ()=>go(1));
S('#to4').addEventListener('click', ()=>go(3));

// تجميع المشاكل
function getPainPoints(){ const arr=[]; SA('input[name=pain]:checked').forEach(i=>arr.push(i.value)); return arr; }
function getBizType(){ const i = S('input[name=btype]:checked'); return i? i.value : ''; }

// توصيات مبسطة حسب المشاكل والنوع
function buildRecommendations(){
  const pains = getPainPoints();
  const btype = getBizType();
  const map = {
    attendance: 'حضور بالوجه مع تقرير يومي بسيط',
    inventory: 'جرد تلقائي وتنبيه نقص المخزون',
    line: 'مراقبة خط الإنتاج والتنبيه عند التوقف',
    gate: 'تسجيل دخول/خروج المركبات (LPR)',
    docs: 'قراءة فواتير/مستندات تلقائيًا',
    theft: 'اكتشاف سلوك مريب وتنبيه فوري'
  };
  const byType = {
    manufacturing: 'لوحة إنتاج + OEE مبسطة + تنبيهات توقف',
    office: 'حضور بالوجه + لوحة مهام بسيطة',
    healthcare: 'تتبّع أدوات/كواشف + OCR للملفات الطبية',
    logistics: 'LPR للبوابات + إدارة ساحة مبسطة',
    retail: 'عدّ زوار بسيط + تنبيه ازدحام',
    government: 'قوائم سماح/حظر مركبات + أرشفة'
  };
  const ul = S('#rec-list'); ul.innerHTML='';
  pains.forEach(p=>{ const li=document.createElement('li'); li.textContent = map[p]; ul.appendChild(li); });
  if(btype && byType[btype]){ const li=document.createElement('li'); li.textContent = byType[btype]; ul.appendChild(li); }
  S('#flow1').src='assets/flow_1.png'; S('#flow2').src='assets/flow_2.png'; S('#flow3').src='assets/flow_3.png';
}

// تصدير كـ JSON
S('#exportJson').addEventListener('click', ()=>{
  const data = collectData();
  download('request.json', JSON.stringify(data,null,2));
});

// إرسال بريد (mailto) مختصر
S('#sendEmail').addEventListener('click', ()=>{
  const data = collectData();
  const subject = encodeURIComponent('طلب نسخة تجريبية - R2M');
  const body = encodeURIComponent(buildSummary(data));
  const to = CFG.EMAIL_TO || '';
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// إرسال واتساب
S('#sendWhatsApp').addEventListener('click', ()=>{
  const data = collectData();
  const msg = encodeURIComponent(buildSummary(data));
  const phone = CFG.WHATSAPP_PHONE || '';
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
});

// إرسال إلى Google Sheets عبر Apps Script Web App
S('#sendSheets').addEventListener('click', async ()=>{
  const url = CFG.SHEETS_WEB_APP_URL || '';
  if(!url || url.includes('REPLACE_WITH')){
    alert('يرجى إعداد رابط Apps Script في config.js أولاً.');
    return;
  }
  const data = collectData();
  try{
    const res = await fetch(url, {method:'POST', mode:'cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const out = await res.json();
    alert('تم الإرسال إلى Google Sheets بنجاح.');
  }catch(err){
    alert('تعذّر الإرسال إلى Google Sheets: '+err.message);
  }
});

function collectData(){
  return {
    pain: getPainPoints(),
    btype: getBizType(),
    name: S('#name').value.trim(),
    org: S('#org').value.trim(),
    phone: S('#phone').value.trim(),
    email: S('#email').value.trim(),
    time: new Date().toISOString()
  };
}

function buildSummary(d){
  return [
    'طلب نسخة تجريبية (R2M)',
    'المشاكل: ' + (d.pain.join('، ')||'—'),
    'نوع المنشأة: ' + (d.btype||'—'),
    'الاسم: ' + (d.name||'—'),
    'الجهة: ' + (d.org||'—'),
    'الهاتف: ' + (d.phone||'—'),
    'البريد: ' + (d.email||'—'),
    'الوقت: ' + d.time
  ].join('\n');
}

function download(name, text){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type:'application/json'}));
  a.download = name; a.click();
}

// تبديل اللغة (فصحى / لهجة صنعاني بسيطة)
S('#langStandard').addEventListener('click', ()=>setLang('std'));
S('#langYemeni').addEventListener('click', ()=>setLang('ymn'));
function setLang(code){
  S('#langStandard').classList.toggle('active', code==='std');
  S('#langYemeni').classList.toggle('active', code!=='std');
  // عناوين بسيطة كمثال
  S('#h2_pain').textContent = (code==='std') ? 'ما المشكلة التي تُزعجك؟ اختر ما ينطبق عليك 👇' : 'مابيضايقك ياخال ؟ حدد ما بيضايقك انت في وجهي 👇';
  S('#h2_type').textContent = (code==='std') ? 'ما نوع منشأتك؟' : 'ايش بتملكو يا استاذي ؟';
  S('#h2_solution').textContent = (code==='std') ? 'الحل المقترح — بطريقة بسيطة وبالصور' : 'انت داري ياغالي ، نقترح نركب لك مثل الي بالصور وتحتهن الشرح ';
  S('#h2_poc').textContent = (code==='std') ? 'بيانات التواصل لنسخة تجريبية سريعة' : 'تشتي نسخة تجريبة ، تواصل معنا ومالك الا أمور';
}
