/**
 * ServiceNow artifact: sys_ui_script
 * Name: SmartNavigatorLauncher
 * sys_id: dd19eef5933fbad430d2f7e03603d68c
 * global: true  |  active: true  |  ignore_in_now_experience: false
 * Instance: zurichandres.service-now.com
 *
 * NOTE: sys_ui_script does NOT execute in Next Experience (Polaris/Zurich).
 * The NE UXF bundle system bypasses classic sys_ui_script loading.
 * Use the bookmarklet in bookmarklet__smart_navigator_launcher.js instead.
 *
 * This script works in Classic UI only.
 */
(function(){
  'use strict';
  if(window.location.href.indexOf('smart_navigator_v2.do')>=0)return;
  var GUARD='__snav_injected';
  if(window[GUARD])return;
  window[GUARD]=true;

  var isOpen=false,ifrLoaded=false;

  function init(){
    if(document.getElementById('snav-btn'))return;
    if(!document.body)return;

    var s=document.createElement('style');
    s.id='snav-style';
    s.textContent=
      '#snav-btn{position:fixed;bottom:28px;right:28px;width:54px;height:54px;border-radius:50%;'+
      'background:#1d3557;color:#fff;font-size:24px;cursor:pointer;display:flex;align-items:center;'+
      'justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.35);z-index:99999;'+
      'transition:background .15s,transform .2s,box-shadow .15s;border:none;outline:none;user-select:none;}'+
      '#snav-btn:hover{background:#0070d2;transform:scale(1.1);}'+
      '#snav-btn.sn-open{background:#c62828;transform:rotate(15deg);}'+
      '#snav-bd{position:fixed;inset:0;background:rgba(0,0,0,.28);z-index:99997;opacity:0;'+
      'pointer-events:none;transition:opacity .22s;}'+
      '#snav-bd.sn-open{opacity:1;pointer-events:auto;}'+
      '#snav-panel{position:fixed;top:0;right:0;width:540px;max-width:98vw;height:100vh;'+
      'background:#f4f6f8;z-index:99998;transform:translateX(106%);'+
      'transition:transform .27s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;'+
      'box-shadow:-6px 0 36px rgba(0,0,0,.25);}'+
      '#snav-panel.sn-open{transform:translateX(0);}'+
      '#snav-hdr{background:#1d3557;color:#fff;padding:13px 18px;display:flex;align-items:center;gap:9px;flex-shrink:0;}'+
      '#snav-hdr-title{flex:1;font-size:17px;font-weight:600;}'+
      '#snav-hdr-hint{font-size:11px;opacity:.55;background:rgba(255,255,255,.12);border-radius:4px;padding:2px 7px;font-family:monospace;}'+
      '#snav-x{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:4px 9px;border-radius:5px;opacity:.6;line-height:1;}'+
      '#snav-x:hover{opacity:1;background:rgba(255,255,255,.18);}'+
      '#snav-iframe{flex:1;border:none;width:100%;background:#f4f6f8;}';
    document.head.appendChild(s);

    var bd=document.createElement('div');
    bd.id='snav-bd';
    bd.addEventListener('click',closePanel);
    document.body.appendChild(bd);

    var panel=document.createElement('div');
    panel.id='snav-panel';
    panel.setAttribute('role','dialog');
    panel.innerHTML=
      '<div id="snav-hdr">'+
      '<span style="font-size:22px">&#9889;</span>'+
      '<span id="snav-hdr-title">Smart Navigator</span>'+
      '<span id="snav-hdr-hint">Alt+S</span>'+
      '<button id="snav-x" title="Close (Esc)">&#10005;</button>'+
      '</div>'+
      '<iframe id="snav-iframe" src="about:blank" frameborder="0"></iframe>';
    document.body.appendChild(panel);
    document.getElementById('snav-x').addEventListener('click',closePanel);

    var btn=document.createElement('button');
    btn.id='snav-btn';
    btn.title='Smart Navigator (Alt+S)';
    btn.innerHTML='&#9889;';
    btn.addEventListener('click',togglePanel);
    document.body.appendChild(btn);

    document.addEventListener('keydown',function(e){
      if(e.altKey&&(e.key==='s'||e.key==='S')){e.preventDefault();togglePanel();}
      if(e.key==='Escape'&&isOpen){closePanel();}
    });
  }

  function togglePanel(){isOpen?closePanel():openPanel();}

  function openPanel(){
    isOpen=true;
    var iframe=document.getElementById('snav-iframe');
    if(!ifrLoaded&&iframe){iframe.src='smart_navigator_v2.do';ifrLoaded=true;}
    document.getElementById('snav-panel').classList.add('sn-open');
    document.getElementById('snav-btn').classList.add('sn-open');
    document.getElementById('snav-bd').classList.add('sn-open');
    setTimeout(function(){
      try{var f=document.getElementById('snav-iframe'),i=f.contentDocument.getElementById('q');if(i){i.focus();i.select();}}catch(e){}
    },320);
  }

  function closePanel(){
    isOpen=false;
    document.getElementById('snav-panel').classList.remove('sn-open');
    document.getElementById('snav-btn').classList.remove('sn-open');
    document.getElementById('snav-bd').classList.remove('sn-open');
  }

  function ensurePresent(){
    if(window.location.href.indexOf('smart_navigator_v2.do')>=0)return;
    if(!document.getElementById('snav-btn')){ifrLoaded=false;isOpen=false;init();}
  }
  setInterval(ensurePresent,2500);

  init();
  document.addEventListener('DOMContentLoaded',init);
  setTimeout(init,500);
  setTimeout(init,1500);
  setTimeout(init,4000);
})();
