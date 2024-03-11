const maxSize = 100;
let storedSize = 0;
let storedFiles = [];

async function uploadFiles(){
    let size = 0;
    const pickerOptions = {multiple: true};
    const filesSystemFileHandler = await showOpenFilePicker(pickerOptions);
    const files = await extractFileFromHandler(filesSystemFileHandler);

    files.forEach(element => {
        size+= element.size/1024/1024; //Size in MB
    });

    const error = validateFiles(files, size);
    if(error !== "") {
        alert(error);
        return;
    }

    storedSize += size;
    files.forEach(file => {storedFiles.push({fileName: file.name, fileSize: file.size/1024/1024});});
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