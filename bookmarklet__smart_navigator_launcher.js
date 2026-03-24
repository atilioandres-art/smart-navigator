/**
 * Smart Navigator Launcher — Browser Bookmarklet
 * ================================================
 * Use this in ServiceNow Next Experience (Polaris) where sys_ui_script
 * does not execute (NE bypasses classic script loading).
 *
 * HOW TO INSTALL:
 *   1. In Chrome/Edge, right-click the bookmarks bar → "Add page..."
 *   2. Name: ⚡ Smart Nav
 *   3. URL: paste the minified one-liner below (starts with javascript:)
 *   4. Click the bookmark once after loading any SN page to inject the
 *      floating ⚡ button for the entire browser session.
 *
 * USAGE:
 *   - Click ⚡ button (bottom-right) to open/close the side panel
 *   - Alt+S keyboard shortcut after injecting
 *   - Esc or click backdrop to close
 *   - Panel stays open across SN's internal SPA navigation
 *   - Only needs to be clicked once per browser session
 *
 * BOOKMARKLET URL (copy exactly, including "javascript:"):
 */

// javascript:(function(){if(document.getElementById('snav-btn'))return;var s=document.createElement('style');s.textContent='#snav-btn{position:fixed;bottom:28px;right:28px;width:54px;height:54px;border-radius:50%;background:%231d3557;color:%23fff;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.35);z-index:99999;border:none;outline:none;transition:background .15s,transform .2s}#snav-btn:hover{background:%230070d2;transform:scale(1.1)}#snav-btn.o{background:%23c62828;transform:rotate(15deg)}#snav-bd{position:fixed;inset:0;background:rgba(0,0,0,.28);z-index:99997;opacity:0;pointer-events:none;transition:opacity .22s}#snav-bd.o{opacity:1;pointer-events:auto}#snav-panel{position:fixed;top:0;right:0;width:540px;max-width:98vw;height:100vh;background:%23f4f6f8;z-index:99998;transform:translateX(106%);transition:transform .27s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:-6px 0 36px rgba(0,0,0,.25)}#snav-panel.o{transform:translateX(0)}#snav-hdr{background:%231d3557;color:%23fff;padding:13px 18px;display:flex;align-items:center;gap:9px;flex-shrink:0}#snav-x{background:none;border:none;color:%23fff;font-size:20px;cursor:pointer;padding:4px 9px;border-radius:5px;opacity:.6;line-height:1}#snav-x:hover{opacity:1;background:rgba(255,255,255,.15)}#snav-iframe{flex:1;border:none;width:100%}';document.head.appendChild(s);var bd=document.createElement('div');bd.id='snav-bd';document.body.appendChild(bd);var p=document.createElement('div');p.id='snav-panel';p.innerHTML='<div id="snav-hdr"><span style="font-size:22px">&#9889;</span><span style="flex:1;font-size:17px;font-weight:600;font-family:system-ui">Smart Navigator</span><span style="font-size:11px;opacity:.55;background:rgba(255,255,255,.12);border-radius:4px;padding:2px 7px;font-family:monospace">Alt+S</span><button id="snav-x">&#10005;</button></div><iframe id="snav-iframe" src="about:blank" frameborder="0"></iframe>';document.body.appendChild(p);var b=document.createElement('button');b.id='snav-btn';b.title='Smart Navigator (Alt+S)';b.innerHTML='&#9889;';document.body.appendChild(b);var op=false,ld=false;function tog(){op?cls():opn();}function opn(){op=true;ld||(document.getElementById('snav-iframe').src='smart_navigator_v2.do',ld=true);p.classList.add('o');b.classList.add('o');bd.classList.add('o');setTimeout(function(){try{var f=document.getElementById('snav-iframe'),i=f.contentDocument.getElementById('q');i&&(i.focus(),i.select());}catch(e){}},320);}function cls(){op=false;p.classList.remove('o');b.classList.remove('o');bd.classList.remove('o');}b.addEventListener('click',tog);bd.addEventListener('click',cls);document.getElementById('snav-x').addEventListener('click',cls);document.addEventListener('keydown',function(e){e.altKey&&(e.key==='s'||e.key==='S')&&(e.preventDefault(),tog());e.key==='Escape'&&op&&cls();});})();
