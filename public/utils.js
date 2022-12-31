const alertStatus = (status, message) => {
    alert.innerText = message;
    alert.classList.remove("d-none");
    alert.classList.add("d-initial");
    if(status) {
        alert.classList.add("alert-success");
        alert.classList.remove("alert-danger");
    } else {
        alert.classList.remove("alert-success");
        alert.classList.add("alert-danger");
    }
}

const copyText = (text) => {
    return new Promise((resolve, reject) => {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text copied to clipboard!');
            resolve(true);
        }, function(err) {
            console.error('Error when copying', err);
            reject(true);
        });
    });

}