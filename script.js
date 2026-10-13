(function () {
  var form = document.getElementById('forma');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = form.elements;
    var body = 'Vārds: ' + v.vards.value + '\n' +
               'Kontakti: ' + v.kontakts.value + '\n\n' +
               v.zina.value;
    window.location.href = 'mailto:inoma21@inbox.lv' +
      '?subject=' + encodeURIComponent('Jautājums no mājaslapas') +
      '&body=' + encodeURIComponent(body);
  });
})();
