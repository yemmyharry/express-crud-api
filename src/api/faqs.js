const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

const schema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    video_url: Joi.string().uri()
}); 

const router = express.Router();

// read all

router.get('/', async (req, res, next) => {
    try {
        const items = await faqs.find({});
         res.json(items);
    } catch (error) {
        next(error);
    }
  
})


// create one
router.post('/', async (req, res, next) => {
    try {
       
        const value = await schema.validateAsync(req.body);
        const inserted = await faqs.insert(value)
        res.json(inserted);
    } catch (error) {
        next(error)
    }
})

// read one

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await faqs.findOne({_id:id})
        // if (!item) return next()

          res.json(item);
    } catch (error) {
        next(error);
    }
  
})

// update one
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const value = await schema.validateAsync(req.body)
        const updated = await faqs.update({
            _id:id, 
        }, {
            $set: value
        })
        res.json(updated)
    } catch (error) {
        next(error)
    }
})

// delete one 
router.delete('/:id', async(req, res, next) => {
   try {
       const { id } = req.params
       const item = await faqs.findOneAndDelete({
           _id: id
       })
       res.json({
           message: "Deleted successfully"
       })
   } catch (error) {
       next(error)
   }
})


module.exports = router;