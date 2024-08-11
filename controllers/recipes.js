const express = require('express');
const router = express.Router()

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
const Ingredient = require('../models/ingredient.js')


/********************************
***CREATE FUNCTIONALITY START ***
********************************/
router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id
        await newRecipe.save()
        res.redirect(`/recipes/${newRecipe._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})



router.get('/new', (req, res) => {
    res.render('recipes/new.ejs')
})

/********************************
***CREATE FUNCTIONALITY END ***
********************************/
/********************************
***READ FUNCTIONALITY START ***
********************************/
///INDEX//////
router.get('/', async (req, res) => {
    try {
        const foundRecipes = await Recipe.find({})
        res.render('recipes/index.ejs', {
            recipes: foundRecipes
        });
    } catch (error) {
        console.log(error)
        res.redirect('/')
        
    }
});

/////SHOW//////
router.get('/:recipeid', async (req, res) => {
    try {
        const foundRecipe = await Recipe.findOne({_id: req.params.recipeid }).populate('ingredients')
        res.render('recipes/show.ejs', {
            recipe: foundRecipe
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

/********************************
***READ FUNCTIONALITY END ***
********************************/
/********************************
***UPDATE FUNCTIONALITY START ***
********************************/
router.put('/:recipeid', async (req, res) => {
    try {
        let addedIngredient
        if (req.body.newIngredient) {
            addedIngredient = new Ingredient({ name: req.body.newIngredient})
            await addedIngredient.save()
        }
        delete req.body.newIngredient
        const updatedRecipe = await Recipe.findOneAndUpdate({ _id: req.params.recipeid }, {
            name: req.body.name,
            $push: {ingredients: addedIngredient._id}
        }, { new: true})
        res.redirect(`/recipes/${updatedRecipe._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.get('/:recipeid/edit', async (req,res) => {
    try {
        const foundRecipe = await Recipe.findOne({ _id: req.params.recipeid}).populate('ingredients')
        res.render('recipes/edit.ejs', {
            recipe: foundRecipe
        })        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})




/********************************
***UPDATE FUNCTIONALITY END ***
********************************/
/********************************
***DESTROY FUNCTIONALITY START **
********************************/
router.delete('/:recipeid', async (req, res) => {
    try {
        await Recipe.findOneAndDelete({ _id: req.params.recipeid})
        .then((recipe) => {
            res.redirect('/recipes')
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/ingredients/:id', async (req, res) => {
    try {
        await Ingredient.findOneAndDelete({ _id: req.params.id})
        .then((ingredient) => {
            res.redirect('/recipes')
        })
    } catch (error) {
        
    }
})

/********************************
***DESTROY FUNCTIONALITY END ***
********************************/

module.exports = router