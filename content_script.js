let originalBodyContent = null;

function isAllowedElement(node) {
  const allowedElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'CAPTION', 'LABEL'];
  return node.parentElement && allowedElements.includes(node.parentElement.tagName);
}

function processTextNodes(node) {
  if (
    node.nodeType === Node.TEXT_NODE &&
    node.textContent.trim() !== '' &&
    isAllowedElement(node)
  ) {
    let words = node.textContent.split(' ');
    let result = '';

    words.forEach((word) => {
      let halfLength = Math.ceil(word.length / 2);
      let firstHalf = word.slice(0, halfLength);
      let secondHalf = word.slice(halfLength);
      result += `<span id="neuro-tdah-effect"><strong>${firstHalf}</strong>${secondHalf}</span> `;
    });

    const newElement = document.createElement('span');
    newElement.innerHTML = result.trim();
    node.replaceWith(newElement);
  } else {
    node.childNodes.forEach(child => processTextNodes(child));
  }
}

function removeTextNodesEffect(node) {
  if (node.id === 'neuro-tdah-effect') {
    node.replaceWith(node.textContent);
  } else {
    node.childNodes.forEach((child) => removeTextNodesEffect(child));
  }
}

function applyEffect() {
  if (!window.extensionAlreadyExecuted) {
    window.extensionAlreadyExecuted = true;
    originalBodyContent = document.body.cloneNode(true);
    processTextNodes(document.body);
  }
}

function removeEffect() {
  if (originalBodyContent) {
    document.body.replaceWith(originalBodyContent);
    window.extensionAlreadyExecuted = false;
  }
}


chrome.storage.sync.get(['isEnabled'], function (result) {
  if (result.isEnabled) {
      applyEffect();
  } else {
      removeEffect();
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if ('isEnabled' in changes) {
      if (changes.isEnabled.newValue) {
          applyEffect();
      } else {
          removeEffect();
      }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleEffect') {
    if (request.enabled) {
      applyEffect();
    } else {
      removeEffect();
    }
  }
});
