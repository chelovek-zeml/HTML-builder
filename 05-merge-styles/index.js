 const fs = require('fs');
 const path = require('path');
 const pathStyles = path.join(__dirname, 'styles');
 const pathProject = path.join(__dirname, 'project-dist');
 var content = '';
 
 async function createBundleStyles() {
    const cssFiles = await fs.promises.readdir(pathStyles, {withFileTypes: true}, (err) => {  
        if (err) {
            throw err;
        }
    });
   
    
    for(let file of cssFiles) {
        const pathFileStyles = path.join(pathStyles, file.name);
        
        if (path.extname(file.name) === '.css') {
            const tempContent = fs.createReadStream(path.join(pathFileStyles), "utf-8");
            tempContent.on("data", (chunk) => {
                content = content + chunk;
                fs.writeFile(path.join(pathProject, 'bundle.css'), content, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            });   
        }
    }
 }
 createBundleStyles();