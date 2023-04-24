document.getElementById('toggleEffect').addEventListener('change', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
  
      // Verifique se a URL não começa com "chrome://"
      if (!url.startsWith('chrome://')) {
        // Adicione um setTimeout para dar tempo ao content script de configurar o listener
        setTimeout(() => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleEffect', enabled: this.checked });
        }, 500);
      } else {
        // Desmarque a caixa de seleção se a URL for inválida
        this.checked = false;
        alert('A extensão não pode ser executada em páginas chrome://');
      }
    }.bind(this));
  });
  // Carregar o estado salvo do efeito de negrito
chrome.storage.sync.get(['isEnabled'], function (result) {
    document.getElementById('toggleEffect').checked = result.isEnabled || false;
});
