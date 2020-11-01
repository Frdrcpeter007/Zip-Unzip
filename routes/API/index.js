var express = require('express');
var router = express.Router();
const multer = require('multer');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

// Initialisation Upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	// fileFilter: function (req, file, cb) {
	// 	checkFileType(file, cb);
	// }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

//Pour l'upload
router.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.send({
				state: false,
				msg: err.message
			});
		} else {
			if (req.file == undefined) {
				res.send({
					state: false,
					msg: 'Erreur: Pas de fichier uploader!'
				});
			} else {
				res.send({
					state: true,
					msg: 'Fichier uploader',
					location: `uploads/${req.file.filename}`,
					name: req.file.filename
				});
            }
		}
	});
});

//Pour zipper
router.post("/zip", async (req, res) => {
	var zip = new JSZip(),
        out = 0;
	
	if (req.body.files.length > 0) {
		for (let index = 0; index < req.body.files.length; index++) {
	
			const images = zip.folder("/zip");
			images.file(req.body.files[index].name, fs.readFileSync(req.body.files[index].location), { base64: true });
	
			out++;
	
			if (out == req.body.files.length) {
				// Convertion de l'objet zip en buffer
				const content = await zip.generateAsync({ type: "nodebuffer" });
		
				var nowFile = `./public/zip/monZip_${new Date().getTime()}.zip`;
				// Création du zip
				fs.writeFileSync(nowFile, content);
				res.status(200).send({state: true, message: "Les éléments ont été zipper avec succès !", result: {
					location: `${nowFile}`
				}})
			}
		}
	} else {
		res.status(200).send({state: false, message: "Aucun élément selectionner pour zipper"})
	}

})

router.post("/dezip", async (req, res) => {
	var destination = `${req.body.name.split(".")[0]}`;
	await extract(`${req.body.zip}`, { dir: path.join(__dirname, `public/dezip/${destination}`)});

	res.status(200).send({status: true, message: "Fichier decompressé..."})
})
module.exports = router;