/**
 * ServiceNow artifact: sys_processor
 * Name: smart_navigator_results
 * Path: smart_navigator_results  (accessible at /smart_navigator_results.do)
 * Instance: zurichandres.service-now.com
 *
 * Serves the Smart Navigator Results page, which shows grouped search
 * results across all tables when "Search everywhere" is clicked.
 *
 * Deploy: paste into sys_processor.script field.
 * Set path to: smart_navigator_results
 */
(function process(g_request, g_response, g_processor) {
  var pg = new GlideRecord('sys_ui_page');
  if (pg.get('name', 'smart_navigator_results')) {
    g_processor.writeOutput('text/html; charset=UTF-8', pg.getValue('html'));
  } else {
    g_processor.writeOutput('text/html; charset=UTF-8', '<h1>Smart Navigator Results page not found</h1><p>Create a sys_ui_page named "smart_navigator_results" and deploy the HTML content.</p>');
  }
})(g_request, g_response, g_processor);
