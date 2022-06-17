const ipcRenderer = require("electron").ipcRenderer;
const generatePassword = () => {
ipcRenderer.send(
    "generatePassword", 
    document.querySelector(".keyWord").value

);

};

ipcRenderer.on("recievePassword", (event, data) => {
   const passwordTag = document.querySelector('#password')
   passwordTag.innerText = data;
});