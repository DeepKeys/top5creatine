/* Click-id passthrough: a paid click that lands on top5creatine.be must keep its
   Google / Meta click id when the visitor continues to dosys.co, otherwise the
   store cannot attribute the order. On landing we read the ids (and Google's own
   utm_* set) from the URL, keep them in sessionStorage so they survive browsing
   between our own pages, and append them to every link that points at dosys.co.
   The link's own utm_content (which button was clicked) is kept. */
(function () {
  var IDS = ['gclid', 'gbraid', 'wbraid', 'gad_source', 'gad_campaignid', 'fbclid'];
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
  var STORE = 'top5_click';
  var params = new URLSearchParams(window.location.search);
  var found = {};
  IDS.concat(UTMS).forEach(function (k) {
    var v = params.get(k);
    if (v) found[k] = v;
  });
  var hasId = IDS.some(function (k) { return found[k]; });
  try {
    if (hasId) {
      sessionStorage.setItem(STORE, JSON.stringify(found));
    } else {
      var saved = sessionStorage.getItem(STORE);
      if (saved) found = JSON.parse(saved) || {};
    }
  } catch (e) { /* storage blocked: still decorate from the current URL */ }
  if (!IDS.some(function (k) { return found[k]; })) return;

  function decorate(a) {
    var u;
    try { u = new URL(a.href); } catch (e) { return; }
    if (u.hostname !== 'dosys.co' && u.hostname !== 'www.dosys.co') return;
    IDS.forEach(function (k) { if (found[k]) u.searchParams.set(k, found[k]); });
    if (found.utm_source) {
      UTMS.forEach(function (k) { if (found[k]) u.searchParams.set(k, found[k]); });
    }
    a.href = u.toString();
  }
  document.querySelectorAll('a[href]').forEach(decorate);
})();
