const {Router} = require('express');

// Middlewares
const {Authentication} = require('../Middlewares/Authentication')
const {CreatorAuthorization} = require('../Middlewares/CreatorAuthorization')
const {ViewerAuthorization} = require('../Middlewares/ViewerAuthorization')
const {ViewAllAuthorization} = require('../Middlewares/ViewAllAuthorization')

// Data Model
const {Bookmodel} = require('../Data Models/Book.model');

const BookRoutes = Router();

// Create Book
BookRoutes.post('/',Authentication,CreatorAuthorization,async(req,res)=>{
    const{Title,Author,Category,CreatorID} = req.body;
    
    if(!Title || !Author || !Category || !CreatorID){
        // console.log('no');
        res.status(204).send({'Message':'All input fields are mandatory.'});
        return
    }
    try {
        const New_Book = new Bookmodel({
            Title,
            Author,
            Category,
            CreatorID:req.userID
        });
        await New_Book.save();
        res.status(201).send({'Message':'Book added successfully.','Book':New_Book});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

// Get All Book
BookRoutes.get('/',Authentication,ViewAllAuthorization,async(req,res)=>{
    const {New,Old} = req.query;
    
    try {
        let operation;

        if(New === '1'){
            const minutes = new Date(Date.now() - 10 * 60 *1000);
            operation = {CreatedTime :{$gte : minutes}};
        }
        if(Old === '1'){
            const minutes = new Date(Date.now() - 10 * 60 *1000);
            operation = {CreatedTime :{$lt : minutes}};
        }
    
        const Books = operation ? await Bookmodel.find(operation) : await Bookmodel.find({});
        res.status(200).send({'Books':Books});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }

})

// Get Viewer Specific Books
BookRoutes.get('/:uid',Authentication,ViewerAuthorization,async(req,res)=>{
    const {uid} = req.params;
    try {
        const Books = await Bookmodel.find({CreatorID:uid});
        res.status(200).send({'Message':`Books of ${uid}`,'Books':Books});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

// Update Book
BookRoutes.patch('/update/:id',Authentication,CreatorAuthorization,async(req,res)=>{
    const {id} = req.params;
    const Data = req.body;
    try {
        const Updated_Book = await Bookmodel.findOneAndUpdate({_id:id},Data,{new:true});
        res.status(200).send({'Message':`Book updated`,'Book':Updated_Book});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

// Delete Book
BookRoutes.delete('/delete/:id',Authentication,CreatorAuthorization,async(req,res)=>{
    const {id} = req.params;
    try {
        const Deleted_Book = await Bookmodel.findOneAndDelete({_id:id});
        res.status(200).send({'Message':`Book deleted`,'Book':Deleted_Book});
    } catch (error) {
        console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})


module.exports = {
    BookRoutes
}