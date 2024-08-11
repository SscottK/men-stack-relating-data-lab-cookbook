const express = require('express');
const router = express.Router()

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')


/********************************
***CREATE FUNCTIONALITY START ***
********************************/
router.post('/recipes', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id
        await newRecipe.save()
        res.redirect('/recipes/:id')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})



router.get('/recipes/new', (req, res) => {
    res.render('new.ejs')
})

/********************************
***CREATE FUNCTIONALITY END ***
********************************/
/********************************
***READ FUNCTIONALITY START ***
********************************/
///INDEX//////
router.get('/recipes', async (req, res) => {
    try {
        const foundRecipes = await Recipe.find({})
        res.locals('index.ejs', {
            recipes: foundRecipes
        });
    } catch (error) {
        console.log(error)
        res.redirect('/')
        
    }
});

/////SHOW//////
router.get('recipes/recipeid', async (req, res) => {
    try {
        const foundRecipe = await Recipe.findOne({_id: req.params.recipeid }).populate('ingredients')
        res.locals('/recipes/show.ejs', {
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
router.put('/recipes/:recipeid', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findOne({ _id: req.params.recipeid }, req.body, { new: true})
        res.redirect(`/recipes/${updatedRecipe._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.get('/recipes/:recipeid/edit', async (req,res) => {
    try {
        const foundRecipe = await Recipe.findOne({ _id: req.params.recipeid})
        res.render('/recipes/edit.ejs')        
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
router.delete('/recipes/:recipeid', async (req, res) => {
    try {
        const deletedRecipe =  await Recipe.findOneAndDelete({ _id: req.params.recipeid})
        deletedRecipe.ingredients.forEach((ingredient) => {
            ingredient.deletOne()
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})



/********************************
***DESTROY FUNCTIONALITY END ***
********************************/

module.exports = router