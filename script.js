const maxSize = 10;
let storedSize;
let storedFiles = [];

let total_used;
let mb_left;
let gradient_bar;
document.addEventListener('DOMContentLoaded', () => {
    total_used = document.getElementById("total-used");
    mb_left = document.getElementById("mb-left");
    gradient_bar = document.querySelector(".gradient-bar");
});
window.onload = () => {
    storedSize = parseFloat(localStorage.getItem('storedSize')) || 0;
    updateView();
};

async function uploadFiles(){
    let size = 0;
    const filesSystemFileHandler = await showOpenFilePicker({multiple: true});
    const files = await extractFileFromHandler(filesSystemFileHandler);

    files.forEach(element => {
        size+= element.size/1024/1024;
    });

    const error = validateFiles(files, size);
    if(error !== "") {
        alert(error);
        return;
    }

    storedSize += size;
    files.forEach(file => {storedFiles.push({fileName: file.name, fileSize: file.size/1024/1024});});

    updateView();
    localStorage.setItem('storedSize', storedSize);
}

async function extractFileFromHandler(fileHandlers){
    const files = [];
    for (const fileHandler of fileHandlers) {
        const file = await fileHandler.getFile();
        files.push(file);
    }
    return files;
}

function validateFiles(files, size){
    if(size + storedSize > maxSize) return "Error: Size exceeded maximum!";
    const fileRegex = new RegExp("[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$");
    let error = "Error: Following files format are not supported -> ";
    let unsupportedFileFound = false;
    for(let i = 0; i < files.length; i++) {
        if(!fileRegex.test(files[i].name)){
            error += files[i].name + " | ";
            unsupportedFileFound = true;
        }
    }
    return unsupportedFileFound ? error : "";
}

function updateView(){
    total_used.innerText = storedSize.toFixed(2);
    mb_left.innerText = (maxSize - storedSize).toFixed(2);
    gradient_bar.style.width = `${storedSize.toFixed(2)*10}%`;
}