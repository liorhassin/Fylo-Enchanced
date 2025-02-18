const conversionRate = 1024*1024;
const maxSizeBytes = 10 * conversionRate;
const unit = "MB";

let storedSizeBytes;

const InitApp = () => {
    onload = () => {
        storedSizeBytes = parseFloat(localStorage.getItem('storedSizeBytes')) || 0;
        updateView();
        const unitElements = document.querySelectorAll("#unit");
        unitElements.forEach(element => {
            element.textContent = unit;
        });
    };
}

const uploadFiles = async (event) => {
    let newFilesSize = 0;

    const files = event.target.files;
    for(const file of files){
        newFilesSize += file.size;
    }

    const error = validateUpload(files, newFilesSize);
    if(error !== "") {
        alert(error);
        return;
    }

    storedSizeBytes += newFilesSize;
    localStorage.setItem('storedSizeBytes', storedSizeBytes);
    updateView();
}

const validateUpload = (files, size) => {
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

const updateView = () => {
    totalBytesUsed = document.getElementById("total-used");
    totalBytesUsed.innerText = (storedSizeBytes/conversionRate).toFixed(2);

    bytesLeft = document.getElementById("mb-left");
    bytesLeft.innerText = ((maxSizeBytes - storedSizeBytes)/conversionRate).toFixed(2);

    gradientBar = document.querySelector(".gradient-bar");
    gradientBar.style.width = `${(storedSizeBytes/conversionRate).toFixed(2)*10}%`;
}

InitApp();