const button = $('#metamaskConnectionButton');
const handle = err => {
    if (err.code == -32002) {
        return showToastMessage('A request is already pending, please don\'t try to abuse platform.', 'danger');
    } else if (err.code == 4001) {
        button.prop('disabled', false);
        return showToastMessage('Rejected by user please try again', 'danger');
    } else {
        console.error(err);
        return showToastMessage('An internal error has occurred pleas contact developers.', 'danger');
    }
}

(async () => {
    button.on('click', async function() {
        button.prop('disabled', true);
        
        const web3 = new Web3(window.ethereum);
        
        if (web3.eth?.currentProvider?.isMetaMask) {
            web3.eth.requestAccounts().then(accounts => {
                if (accounts.length == 0) {
                    return showToastMessage('No wallets found, please try again or try refreshing disconnecting website from wallet and add again.', 'warning');
                } else {
                    let account = accounts[0];
                    let message = 'By clicking "Sign" your wallet will be added to your TwittyCord account. This process will verify ownership of your wallet, but won\'t make any transactions.';

                    web3.eth.personal.sign(message, account).then(signature => {
                        $.ajax({
                            url: '/auth/metamask/authenticate',
                            method: 'POST',
                            data: { signature, address: account, message },
                            success: (response) => {
                                if (response.success) {
                                    showToastMessage(response.message, 'success');
                                    setTimeout(() => { window.location.reload() }, 2000);
                                } else {
                                    button.prop('disabled', false);
                                    return showToastMessage(response.message, 'danger');
                                }
                            }
                        })
                    }).catch(handle);
                }
            }).catch(handle);
        }
    })
})();