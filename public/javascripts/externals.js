window.localStorage.clear();
/**
 * Gere l'upload des images
 * @param {*} files 
 * @param {*} navTab 
 * @param {*} navTabContent 
 */
function uploadFile(files, extensions) {
    //Verifier si le format du fichier est correct
    var allowedTypes = extensions,
        files = files.files,
        imgType;
    $ = jQuery;

    for (var i = 0; i < files.length; i++) {
        //Extraction de l'extension du fichier
        imgType = files[i].name.split('.');

        // On utilise toLowerCase() pour éviter les extensions en majuscules
        imgType = imgType[imgType.length - 1].toLowerCase();

        if (allowedTypes.indexOf(imgType) != -1) {

            //LES VARIABLES
            var formData = new FormData(), //L'objet formDATA qui sera soumit comme data dans AJAX
                file, //Le fichier
                reader, //Le lecteur de fichier qui servira à donner l'apperçu du fichier uploadé
                sortie = false; //L'objet de sortie


            //On vérifie si l'input file contient au moins un fichier
            if (files.length > 0) {

                file = files[0]; //On recupère le fichier contenu dans l'objet 'files' de l'input
                sortie = true; //On passe à true la condition de vérification
            }

            //Puis on ajoute le fichier à l'objet formData
            //Ce dernier aura comme key "files" et comme value "le fichier"
            formData.append('myImage', file, file.name);

            //On vérifie la sortie
            if (true) {
                var tempImage = JSON.parse(window.localStorage.getItem("files")) ? JSON.parse(window.localStorage.getItem("files")) : [];


                $.ajax({
                    url: `/api/upload`, //Modif
                    type: 'POST',
                    data: formData,
                    processData: false, // tell jQuery not to process the data
                    contentType: false, // tell jQuery not to set contentType
                    beforeSend: function () { },
                    complete: function () { },
                    success: function (data) {
                        console.log(data);
                        if (data.state) {
                            tempImage.push({ location: `./public/${data.location}`, name: data.name });
                            $("#allFile").append(`<img src="/${data.location}" class="responsive-img" style="width: 250px;">`);

                            window.localStorage.setItem("files", JSON.stringify(tempImage))
                        } else {
                            alert(data.msg)
                        }
                    }
                });
            }
        } else {
            alert("Extension du fichier non valide")
        }

    }

}

function zip() {
    var tempImage = JSON.parse(window.localStorage.getItem("files")) ? JSON.parse(window.localStorage.getItem("files")) : [];
    $.ajax({
        url: `/api/zip`, //Modif
        type: 'POST',
        dataType: 'json',
        data: {
            files: tempImage
        },
        beforeSend: function () { console.log("Début compression...");},
        complete: function () { },
        success: function (data) {
            if (data.state) {
                window.localStorage.clear();
                alert(data.message)
                download(data.result.location)
            } else {
                alert(data.message)
            }
        }
    });
}

function download(adresse_de_mon_fichier){
    // Donne l'url du fichier ici :
    var adresse= adresse_de_mon_fichier.split("./public")[1];
    window.open(adresse,"_blank", null);
    $("#allFile").empty();
}

/**
 * Gere l'upload des images
 * @param {*} files 
 * @param {*} navTab 
 * @param {*} navTabContent 
 */
function dezippe(files, extensions) {
    //Verifier si le format du fichier est correct
    var allowedTypes = extensions,
        files = files.files,
        imgType;
    $ = jQuery;

    for (var i = 0; i < files.length; i++) {
        //Extraction de l'extension du fichier
        imgType = files[i].name.split('.');

        // On utilise toLowerCase() pour éviter les extensions en majuscules
        imgType = imgType[imgType.length - 1].toLowerCase();

        if (allowedTypes.indexOf(imgType) != -1) {

            //LES VARIABLES
            var formData = new FormData(), //L'objet formDATA qui sera soumit comme data dans AJAX
                file, //Le fichier
                reader, //Le lecteur de fichier qui servira à donner l'apperçu du fichier uploadé
                sortie = false; //L'objet de sortie


            //On vérifie si l'input file contient au moins un fichier
            if (files.length > 0) {

                file = files[0]; //On recupère le fichier contenu dans l'objet 'files' de l'input
                sortie = true; //On passe à true la condition de vérification
            }

            //Puis on ajoute le fichier à l'objet formData
            //Ce dernier aura comme key "files" et comme value "le fichier"
            formData.append('myImage', file, file.name);

            //On vérifie la sortie
            if (true) {
                $.ajax({
                    url: `/api/upload`, //Modif
                    type: 'POST',
                    data: formData,
                    processData: false, // tell jQuery not to process the data
                    contentType: false, // tell jQuery not to set contentType
                    beforeSend: function () { },
                    complete: function () { },
                    success: function (data) {
                        if (data.state) {
                            $.ajax({
                                url: `/api/dezip`,
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    zip: `./public/${data.location}`,
                                    name: data.name
                                },
                                beforeSend: function () { console.log("Début décompression...");},
                                complete: function () { console.log("Fin de la décompression"); },
                                success: function (data) {
                                    if (data.state) {
                                        alert(data.message)
                                    } else {
                                        alert(data.message)
                                    }
                                }
                            });
                        } else {
                            alert(data.msg)
                        }
                    }
                });
            }
        } else {
            alert("Extension du fichier non valide")
        }

    }

}