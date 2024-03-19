const conversionRate = 1024*1024;
const maxSizeBytes = 10 * conversionRate;
const unit = "MB";

let storedSizeBytes;
let totalBytesUsed;
let bytesLeft;
let gradientBar;

InitApp();

function InitApp(){
    document.addEventListener('DOMContentLoaded', () => {
        totalBytesUsed = document.getElementById("total-used");
        bytesLeft = document.getElementById("mb-left");
        gradientBar = document.querySelector(".gradient-bar");
    });
    
    window.onload = () => {
        storedSizeBytes = parseFloat(localStorage.getItem('storedSizeBytes')) || 0;
        updateView();
        let unitElements = document.querySelectorAll("#unit");
        unitElements.forEach(function(unitElement) {
            unitElement.textContent = unit;
        });
    };
}

async function uploadFiles(){
    let newFilesSize = 0;
    const filesSystemFileHandler = await showOpenFilePicker({multiple: true});
    const files = await extractFileFromHandler(filesSystemFileHandler);

    files.forEach(element => {
        newFilesSize += element.size;
    });

    const error = validateUpload(files, newFilesSize);
    if(error !== "") {
        alert(error);
        return;
    }

    storedSizeBytes += newFilesSize;
    localStorage.setItem('storedSizeBytes', storedSizeBytes);
    updateView();
}

async function extractFileFromHandler(fileHandlers){
    const files = [];
    for (const fileHandler of fileHandlers) {
        const file = await fileHandler.getFile();
        files.push(file);
    }
    return files;
}

function validateUpload(files, size){
    if(size + storedSizeBytes > maxSizeBytes) return "Error: Size exceeded maximum!";

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
    totalBytesUsed.innerText = (storedSizeBytes/conversionRate).toFixed(2);
    bytesLeft.innerText = ((maxSizeBytes - storedSizeBytes)/conversionRate).toFixed(2);
    gradientBar.style.width = `${(storedSizeBytes/conversionRate).toFixed(2)*10}%`;
}