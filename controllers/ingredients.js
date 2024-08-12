const express = require('express');
const router = express.Router()

const User = require('../models/user.js')
const Ingredient = require('../models/ingredient.js')


/*****INDEX FUNCTIONALITY************/
router.get('/', async (req, res) => {
    try {
        const foundIngredients = await Ingredient.find({});
        res.render('ingredients/index.ejs', {
            ingredients: foundIngredients
        })
    } catch (error) {
        console.log(error)
        res.redirect('/recipes')
    }
})

/****CREATE FUNTIONALITY***********/
router.post('/', async (req, res) => {
    try {
        const newIngrdient = await Ingredient(req.body)
        await newIngrdient.save()
        res.redirect('/ingredients')
    } catch (error) {
        console.log(error)
        res.redirect('/recipes')
    }
})


module.exports = router