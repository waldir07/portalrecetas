require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe')

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

        const food = { latest }

        res.render('index', { title: 'Cooking-blog - Home', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }



}

/**
 * GET /
 * categories
 */

exports.exploreCategories = async (req, res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber)

        res.render('categories', { title: 'Cooking-blog - Categories', categories })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }



}

/**
 * GET /
 * Homepage
 */

exports.exploreRecipe = async (req, res) => {
    try {

        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }



}

/**
 * GET /
 * categories/:id
 */

exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber)
        console.log(categoryById.category)
        res.render('categoriesAll', { title: 'Cooking-blog - Categories', categoryById })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }



}

/**
 * POST /search
 * 
 */

exports.searchRecipe = async (req, res) => {

    //searchTerm

    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } })
        res.render('search', { title: 'Cooking Blog - Search', recipe })


    } catch (error) {
        res.status(500).send({ message: error.message || 'Error occured' })
    }



}


/**
 * GET /explore-latest
 * 
 */

exports.exploreLatest = async (req, res) => {

    //searchTerm

    try {
        const limitNumber = 20;
        let recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)

        res.render('explore-latest', { title: 'Cooking Blog - ultimas receta', recipe })

    } catch (error) {
        res.status(500).send({ message: error.message || 'Error occured' })
    }



}


/**
 * GET /random-recipe
 * 
 */

exports.randomRecipe = async (req, res) => {

    //searchTerm

    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);

        let recipe = await Recipe.findOne().skip(random).exec();

        res.render('recipe', { title: 'Cooking Blog - ultimas receta', recipe })

    } catch (error) {
        res.status(500).send({ message: error.message || 'Error occured' })
    }



}

exports.submitRecipe = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors ');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Enviar receta', infoErrorsObj, infoSubmitObj })
}

exports.submitRecipeOnPost = async (req, res) => {

    try {


        let imageUploadFile ;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('Sin imagen subida')
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err)
            })
        }


        const newRecipe = new Recipe({
            name:req.body.name,
            description:req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName

        })

        await newRecipe.save();

        req.flash('infoSubmit', 'Subido con éxito');
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }








}








/*async function recipe(){
    try {
        await Recipe.insertMany([
            {
                'name': 'Ceviche',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche2',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche3',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche4',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche5',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche6',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche7',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche8',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche9',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
            {
                'name': 'Ceviche10',
                'description': 'Es el jugo del ceviche. Si queremos servirlo como cóctel, solo debes mezclar el jugo de 6 limones, 2 dientes de ajo molidos, 1 cda. de ají amarillo molido, ½ cda. de ají limo molido y 1 vaso de pisco. Se presenta en vasitos o en copas.',
                'email':'ejemplo123@gmail.com',
                'ingredients':[
                    '1 kg de pescado del día',
                    '2 grs de ajo picado',
                    '50 grs de apio picado (opcional)',
                    '100 grs cebolla cortada a la pluma',
                    '10 grs. de culantro picado',
                    '150 grs de cancha o choclo sancochado',
                    '250 ml de jugo de limón con 2 ml de pisco (opcional)',
                    '100 grs ají fresco picado (limo o verde)',
                    '5 grs de kion rallado (opcional)',
                    '50 grs rocoto en rodajas',
                    '2 cubitos de hielo'
                ],
                'category':'peruana',
                'image':'peruana'
            },
        ])
    } catch (error) {
        console.log(error)
    }
}

recipe()*/