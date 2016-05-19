const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const menu = new Menu();
menu.append(new MenuItem({
    label: 'Cut',
    role: 'cut',
    accelerator: 'CmdOrCtrl+X'
}));
menu.append(new MenuItem({
    label: 'Copy',
    role: 'copy',
    accelerator: 'CmdOrCtrl+C'
}));
menu.append(new MenuItem({
    label: 'Paste',
    role: 'paste',
    accelerator: 'CmdOrCtrl+V'
}));

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);

