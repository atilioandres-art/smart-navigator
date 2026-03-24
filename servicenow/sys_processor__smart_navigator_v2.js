/**
 * ServiceNow artifact: sys_processor
 * Name: smart_navigator
 * Path: smart_navigator_v2  (accessible at /smart_navigator_v2.do)
 * sys_id: e1135575cff7fa948ace75c42d851cda
 * Instance: zurichandres.service-now.com
 *
 * Serves the sys_ui_page HTML directly, bypassing Jelly/NE rendering.
 * Required because sys_ui_page renders blank in Next Experience (Polaris).
 *
 * Deploy: paste into sys_processor.script field.
 */
(function process(g_request, g_response, g_processor) {
  var pg = new GlideRecord('sys_ui_page');
  if (pg.get('name', 'smart_navigator')) {
    g_processor.writeOutput('text/html; charset=UTF-8', pg.getValue('html'));
  } else {
    g_processor.writeOutput('text/html; charset=UTF-8', '<h1>Smart Navigator page not found</h1>');
  }
})(g_request, g_response, g_processor);
