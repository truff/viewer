const { ipcRenderer } = require('electron');

ipcRenderer.once('displayCertificateList', (event, list) => {
    list.forEach(addCert);
    //For testing
    //event.sender.send('client-certificate-selected', list[0]);
});

/**
 * Adds a certificate to the certificate list in the cert select dialog.
 * @param {cert} item 
 */
function addCert(item) {
    let subject = item.subjectName;
    let issuer = item.issuerName;
    let list = document.getElementById('certList');
    let template = document.querySelector('#certEntry');
    let clone = document.importNode(template.content, true);
    let certListItem = clone.querySelector('.certlistitem');
    certListItem.addEventListener('click', selectItem);

    certListItem.cert = item;
    certListItem.querySelector('.subject').appendChild(document.createTextNode(subject));
    certListItem.querySelector('.issuer').appendChild(document.createTextNode(issuer));
    certListItem.addEventListener('dblclick', submitHandler);
    let childNode = list.appendChild(clone);
}

/**
 * Call to select a certificate in the certificate list dialog.
 * @param {*} evt 
 */
function selectItem(evt) {
    document.querySelectorAll('.certlistitem').forEach((i) => {
        i.classList.remove('active');
        i.classList.add('unselected')
    });
    evt.currentTarget.classList.remove('unselected');
    evt.currentTarget.classList.add('active');
}

/**
 * Call to get the certificate the user selected.
 */
function getSelectedCert() {
    let selectedItem = document.querySelector('#certList .active');
    return selectedItem ? selectedItem.cert : null;
}

function submitHandler() {
    let cert = getSelectedCert();
    if(cert) {
        ipcRenderer.send('client-certificate-selected', cert);
        window.close();
    }
}

document.querySelector('#submit').addEventListener('click', submitHandler);