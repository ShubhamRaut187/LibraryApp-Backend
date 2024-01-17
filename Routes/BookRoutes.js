const {Router} = require('express');

// Middlewares
const {Authentication} = require('../Middlewares/Authentication')
const {CreatorAuthorization} = require('../Middlewares/CreatorAuthorization')
const {ViewerAuthorization} = require('../Middlewares/ViewerAuthorization')
const {ViewAllAuthorization} = require('../Middlewares/ViewAllAuthorization')

// Data Model
const {Bookmodel} = require('../Data Models/Book.model');

const BookRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Author:
 *                 type: string
 *               Category:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             example:
 *               Message: Book added successfully
 *               Book:
 *                 Title: Sample Book
 *                 Author: John Doe
 *                 Category: Fiction
 *       '204':
 *         description: All input fields are mandatory
 *         content:
 *           application/json:
 *             example:
 *               Message: All input fields are mandatory.
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */



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
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: New
 *         in: query
 *         description: Filter new books
 *         schema:
 *           type: string
 *       - name: Old
 *         in: query
 *         description: Filter old books
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of books
 *         content:
 *           application/json:
 *             example:
 *               Books:
 *                 - Title: Sample Book
 *                   Author: John Doe
 *                   Category: Fiction
 *               - Title: Another Book
 *                   Author: Jane Doe
 *                   Category: Mystery
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */

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
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }

})

/**
 * @swagger
 * /books/{uid}:
 *   get:
 *     summary: Get books of a specific user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of books
 *         content:
 *           application/json:
 *             example:
 *               Message: Books of user123
 *               Books:
 *                 - Title: Sample Book
 *                   Author: John Doe
 *                   Category: Fiction
 *               - Title: Another Book
 *                   Author: Jane Doe
 *                   Category: Mystery
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */


// Get Viewer Specific Books
BookRoutes.get('/:uid',Authentication,ViewerAuthorization,async(req,res)=>{
    const {uid} = req.params;
    try {
        const Books = await Bookmodel.find({CreatorID:uid});
        res.status(200).send({'Message':`Books of ${uid}`,'Books':Books});
    } catch (error) {
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

/**
 * @swagger
 * /books/singlebook/{id}:
 *   get:
 *     summary: Get a single book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Book details
 *         content:
 *           application/json:
 *             example:
 *               Message: Book details for book123
 *               Book:
 *                 Title: Sample Book
 *                 Author: John Doe
 *                 Category: Fiction
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */

// Get Single book
BookRoutes.get('/singlebook/:id',Authentication,CreatorAuthorization,async(req,res)=>{
    const {id} = req.params;
    try {
        const Book = await Bookmodel.findOne({_id:id});
        // console.log(Book);
        res.status(200).send({'Message':`Books ${id}`,'Book':Book});
    } catch (error) {
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

/**
 * @swagger
 * /books/update/{id}:
 *   patch:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Author:
 *                 type: string
 *               Category:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             example:
 *               Message: Book updated successfully
 *               Book:
 *                 Title: Updated Book
 *                 Author: John Doe
 *                 Category: Fiction
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */


// Update Book
BookRoutes.patch('/update/:id',Authentication,CreatorAuthorization,async(req,res)=>{
    const {id} = req.params;
    const Data = req.body;
    try {
        const Updated_Book = await Bookmodel.findOneAndUpdate({_id:id},Data,{new:true});
        res.status(200).send({'Message':`Book updated`,'Book':Updated_Book});
    } catch (error) {
        // console.log(error);
        res.status(500).send({'Message':'Something went wrong please try again.'});
    }
})

/**
 * @swagger
 * /books/delete/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               Message: Book deleted successfully
 *               Book:
 *                 Title: Deleted Book
 *                 Author: John Doe
 *                 Category: Fiction
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               Message: Not authorized
 *       '500':
 *         description: Something went wrong, please try again
 *         content:
 *           application/json:
 *             example:
 *               Message: Something went wrong, please try again
 */


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