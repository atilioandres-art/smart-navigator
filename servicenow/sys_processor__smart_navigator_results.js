/**
 * ServiceNow artifact: sys_processor
 * Name: smart_navigator_results
 * Path: smart_navigator_results  (accessible at /smart_navigator_results.do)
 * Instance: zurichandres.service-now.com
 *
 * Server-side search results for Smart Navigator "Search everywhere".
 * Accepts: ?q=<search term>
 * Queries key tables via GlideRecord (no client-side XHR needed).
 * Returns fully-rendered HTML — works regardless of REST API availability.
 */
(function process(g_request, g_response, g_processor) {

  var q = (g_request.getParameter('q') || '').trim();

  /* ── CSS ─────────────────────────────────────────────────────────── */
  var CSS = [
    '*{box-sizing:border-box;margin:0;padding:0}',
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,Arial,sans-serif;',
    'background:#f4f6f8;min-height:100vh;font-size:14px;color:#1b2a34}',
    '.hdr{background:#1d3557;color:#fff;padding:10px 20px;display:flex;align-items:center;gap:12px}',
    '.hdr-logo{font-size:18px;flex-shrink:0}',
    '.hdr-title{font-size:15px;font-weight:600;flex-shrink:0}',
    '.hdr-form{flex:1;margin:0 12px}',
    '.hdr-form input{width:100%;padding:7px 12px;border-radius:5px;border:none;font-size:14px;',
    'background:rgba(255,255,255,.15);color:#fff;outline:none}',
    '.hdr-form input::placeholder{color:rgba(255,255,255,.55)}',
    '.hdr-back{color:rgba(255,255,255,.75);text-decoration:none;font-size:13px;white-space:nowrap;flex-shrink:0}',
    '.hdr-back:hover{color:#fff}',
    '.wrap{max-width:960px;margin:16px auto;padding:0 16px}',
    '.status{font-size:12px;color:#6b778c;padding:0 0 10px}',
    '.section{background:#fff;border-radius:8px;box-shadow:0 1px 5px rgba(0,0,0,.07);margin-bottom:10px;overflow:hidden}',
    '.sec-hdr{padding:9px 16px;background:#f8f9fb;border-bottom:1px solid #e8ecf0;display:flex;align-items:center;gap:8px}',
    '.sec-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}',
    '.sec-count{font-size:11px;background:#e5eaee;color:#5f6b78;border-radius:10px;padding:1px 8px;font-weight:600}',
    '.sec-link{margin-left:auto;font-size:12px;color:#0070d2;text-decoration:none}',
    '.sec-link:hover{text-decoration:underline}',
    '.row{display:flex;align-items:center;gap:10px;padding:9px 16px;border-bottom:1px solid #f0f2f5;',
    'cursor:pointer;text-decoration:none;color:inherit;transition:background .08s}',
    '.row:last-child{border-bottom:none}',
    '.row:hover{background:#f0f7ff}',
    '.row-ico{width:26px;height:26px;border-radius:5px;display:flex;align-items:center;',
    'justify-content:center;font-size:14px;flex-shrink:0}',
    '.row-body{flex:1;min-width:0}',
    '.row-name{font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.row-desc{font-size:12px;color:#6b778c;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.empty{text-align:center;padding:48px 20px;color:#6b778c;background:#fff;border-radius:8px;',
    'box-shadow:0 1px 5px rgba(0,0,0,.07)}',
    '.empty-icon{font-size:32px;margin-bottom:10px}',
    '.bg-inc{background:#fce8e8;color:#c62828}.t-inc{color:#c62828}',
    '.bg-chg{background:#f3e5f5;color:#7b1fa2}.t-chg{color:#7b1fa2}',
    '.bg-prb{background:#fff3e0;color:#e65100}.t-prb{color:#e65100}',
    '.bg-req{background:#e3f2fd;color:#1565c0}.t-req{color:#1565c0}',
    '.bg-ci{background:#e8f5e9;color:#2e7d32}.t-ci{color:#2e7d32}',
    '.bg-kb{background:#f1f8e9;color:#558b2f}.t-kb{color:#558b2f}',
    '.bg-usr{background:#e8eaf6;color:#283593}.t-usr{color:#283593}',
    '.bg-ast{background:#e0f7fa;color:#00695c}.t-ast{color:#00695c}'
  ].join('');

  /* ── helpers ─────────────────────────────────────────────────────── */
  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function section(label, bgCls, tCls, icon, listUrl, rows) {
    if (!rows.length) return '';
    var h = '<div class="section">';
    h += '<div class="sec-hdr">';
    h += '<span class="row-ico ' + bgCls + '">' + icon + '</span>';
    h += '<span class="sec-title ' + tCls + '">' + label + '</span>';
    h += '<span class="sec-count">' + rows.length + (rows.length >= 10 ? '+' : '') + '</span>';
    h += '<a class="sec-link" href="/' + listUrl + esc(q) + '" target="_top">View all &rarr;</a>';
    h += '</div>';
    rows.forEach(function(r) {
      h += '<a class="row" href="/' + r.url + '" target="_top">';
      h += '<div class="row-ico ' + bgCls + '">' + icon + '</div>';
      h += '<div class="row-body">';
      h += '<div class="row-name">' + esc(r.name) + '</div>';
      if (r.desc) h += '<div class="row-desc">' + esc(r.desc.substring(0, 120)) + '</div>';
      h += '</div></a>';
    });
    h += '</div>';
    return h;
  }

  /* ── search ──────────────────────────────────────────────────────── */
  function search(table, queryStr, fields, limit, map) {
    var rows = [];
    var gr = new GlideRecord(table);
    gr.addEncodedQuery(queryStr);
    gr.setLimit(limit || 10);
    gr.query();
    while (gr.next()) rows.push(map(gr));
    return rows;
  }

  /* ── serve empty search form ─────────────────────────────────────── */
  if (!q) {
    var pg = new GlideRecord('sys_ui_page');
    if (pg.get('name', 'smart_navigator_results')) {
      g_processor.writeOutput('text/html; charset=UTF-8', pg.getValue('html'));
    } else {
      g_processor.writeOutput('text/html; charset=UTF-8',
        '<!DOCTYPE html><html><body>Enter a search term: ' +
        '<form><input name="q" autofocus><button>Search</button></form></body></html>');
    }
    return;
  }

  /* ── run all searches ────────────────────────────────────────────── */
  var lq = 'LIKE' + q;

  var incidents = search('incident',
    'short_descriptionCONTAINS' + q + '^active=true', null, 10,
    function(r) { return {
      name: r.getValue('number') + ' \u2014 ' + (r.getValue('short_description') || '').substring(0, 80),
      desc: 'Priority: ' + r.getDisplayValue('priority') + ' \u00b7 State: ' + r.getDisplayValue('state'),
      url: 'incident.do?sys_id=' + r.getValue('sys_id')
    }; });

  var changes = search('change_request',
    'short_descriptionCONTAINS' + q + '^active=true', null, 10,
    function(r) { return {
      name: r.getValue('number') + ' \u2014 ' + (r.getValue('short_description') || '').substring(0, 80),
      desc: 'Type: ' + r.getDisplayValue('type') + ' \u00b7 State: ' + r.getDisplayValue('state'),
      url: 'change_request.do?sys_id=' + r.getValue('sys_id')
    }; });

  var problems = search('problem',
    'short_descriptionCONTAINS' + q + '^active=true', null, 10,
    function(r) { return {
      name: r.getValue('number') + ' \u2014 ' + (r.getValue('short_description') || '').substring(0, 80),
      desc: 'State: ' + r.getDisplayValue('state'),
      url: 'problem.do?sys_id=' + r.getValue('sys_id')
    }; });

  var ritms = search('sc_req_item',
    'short_descriptionCONTAINS' + q + '^active=true', null, 10,
    function(r) { return {
      name: r.getValue('number') + ' \u2014 ' + (r.getValue('short_description') || '').substring(0, 80),
      desc: 'State: ' + r.getDisplayValue('state'),
      url: 'sc_req_item.do?sys_id=' + r.getValue('sys_id')
    }; });

  var cis = search('cmdb_ci',
    'nameCONTAINS' + q, null, 10,
    function(r) { return {
      name: r.getValue('name'),
      desc: r.getDisplayValue('sys_class_name') + (r.getValue('ip_address') ? ' \u00b7 ' + r.getValue('ip_address') : ''),
      url: 'cmdb_ci.do?sys_id=' + r.getValue('sys_id')
    }; });

  var kb = search('kb_knowledge',
    'short_descriptionCONTAINS' + q + '^workflow_state=published', null, 10,
    function(r) { return {
      name: r.getValue('number') + ' \u2014 ' + (r.getValue('short_description') || '').substring(0, 80),
      desc: r.getDisplayValue('category') || '',
      url: 'kb_knowledge.do?sys_id=' + r.getValue('sys_id')
    }; });

  var users = search('sys_user',
    'nameCONTAINS' + q + '^ORuser_nameCONTAINS' + q + '^ORemailCONTAINS' + q + '^active=true', null, 10,
    function(r) { return {
      name: r.getValue('name'),
      desc: (r.getValue('title') || '') + (r.getValue('email') ? ' \u00b7 ' + r.getValue('email') : ''),
      url: 'sys_user.do?sys_id=' + r.getValue('sys_id')
    }; });

  var assets = search('alm_asset',
    'display_nameCONTAINS' + q, null, 10,
    function(r) { return {
      name: r.getValue('display_name') || r.getValue('asset_tag') || '(no name)',
      desc: 'Tag: ' + (r.getValue('asset_tag') || '?') + ' \u00b7 State: ' + r.getDisplayValue('install_status'),
      url: 'alm_asset.do?sys_id=' + r.getValue('sys_id')
    }; });

  /* ── build HTML ──────────────────────────────────────────────────── */
  var total = incidents.length + changes.length + problems.length + ritms.length +
              cis.length + kb.length + users.length + assets.length;

  var body = '';
  body += section('Incidents',    'bg-inc', 't-inc', '&#128680;', 'incident_list.do?sysparm_query=short_descriptionCONTAINS',     incidents);
  body += section('Changes',      'bg-chg', 't-chg', '&#128260;', 'change_request_list.do?sysparm_query=short_descriptionCONTAINS', changes);
  body += section('Problems',     'bg-prb', 't-prb', '&#9888;',   'problem_list.do?sysparm_query=short_descriptionCONTAINS',       problems);
  body += section('Request Items','bg-req', 't-req', '&#128203;', 'sc_req_item_list.do?sysparm_query=short_descriptionCONTAINS',   ritms);
  body += section('Config Items', 'bg-ci',  't-ci',  '&#128187;', 'cmdb_ci_list.do?sysparm_query=nameCONTAINS',                   cis);
  body += section('Knowledge',    'bg-kb',  't-kb',  '&#128218;', 'kb_knowledge_list.do?sysparm_query=short_descriptionCONTAINS', kb);
  body += section('Users',        'bg-usr', 't-usr', '&#128100;', 'sys_user_list.do?sysparm_query=nameCONTAINS',                  users);
  body += section('Assets',       'bg-ast', 't-ast', '&#128230;', 'alm_asset_list.do?sysparm_query=display_nameCONTAINS',         assets);

  if (!body) {
    body = '<div class="empty"><div class="empty-icon">&#128269;</div>' +
           'No results found for &ldquo;' + esc(q) + '&rdquo;.' +
           '<br><span style="font-size:13px;color:#8c98a4;margin-top:6px;display:block">' +
           'Try different keywords or check the spelling.</span></div>';
  }

  var statusText = total > 0
    ? total + ' result' + (total === 1 ? '' : 's') + ' across ' +
      [incidents,changes,problems,ritms,cis,kb,users,assets].filter(function(a){return a.length;}).length + ' tables'
    : '';

  var html = '<!DOCTYPE html><html><head>' +
    '<meta charset="utf-8"><title>Results: ' + esc(q) + ' \u2014 Smart Navigator</title>' +
    '<style>' + CSS + '</style>' +
    '</head><body>' +
    '<div class="hdr">' +
    '<span class="hdr-logo">&#9889;</span>' +
    '<span class="hdr-title">Search Results</span>' +
    '<form class="hdr-form" method="get" action="smart_navigator_results.do">' +
    '<input name="q" value="' + esc(q) + '" placeholder="Search everywhere..." autocomplete="off" spellcheck="false">' +
    '</form>' +
    '<a class="hdr-back" href="smart_navigator_v2.do" target="_top">&#8592; Navigator</a>' +
    '</div>' +
    '<div class="wrap">' +
    (statusText ? '<div class="status">' + statusText + '</div>' : '') +
    body +
    '</div></body></html>';

  g_processor.writeOutput('text/html; charset=UTF-8', html);

})(g_request, g_response, g_processor);
