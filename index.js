import express from "express"
import pool from "./db.config.js"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
dotenv.config()


const app = express()

app.use(express.json())
app.use(cors())
//serving static files
app.use(express.static('../public/'))

//get all todos
app.get('/todos', async(req, res, next)=>{

	try {
		const todos = await pool.query("SELECT *  FROM todo")
		res.sendFile('index.html')
		//res.json(todos.rows)
	} catch (error) {
		next(error)
	}
})




//get one todo by id
app.get('/todo/:id', async(req, res, next)=>{
	const {id}  = req.params
	try {
		const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id])
		if(!todo) throw new Error("something went wrong")
		res.json(todo.rows)
	} catch (err) {
		
		next(err)
	}
})

//post a todo
app.post("/todo", async(req, res, next)=>{
try {
	const {todo} = req.body

	const schedule = await pool.query("INSERT INTO todo (todo) VALUES($1) RETURNING * ", [todo])
	res.json(schedule.rows)
} catch (error) {
	next(error)
}
})

//update a todo
app.put("/todo/:id", async(req, res, next)=>{
try {
	const {id}  = req.params
	const {todo} = req.body

	const updateTodo = await pool.query("UPDATE todo SET todo = $1 WHERE id = $2 ", [todo, id])
	res.json(updateTodo.rows)
} catch (error) {
	next(error)
}
})


//delete a todo
app.delete("/todo/:id", async(req, res , next)=>{
try {
	const {id}  = req.params


	const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1 ", [id])
	res.json("delete successfull")
} catch (error) {
	next(error)
}
})

//Error handler
app.use(function(err, req, res, next){
	res.status(err.status || 500).json({
		message: err.message,
		status: "error",
		data: null
		
	})
	
})
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
	console.log(`server running on port ${PORT}`)
})