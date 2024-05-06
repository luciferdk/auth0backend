import { Prisma, PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient()
const app = express()

app.use(express.json())

//user Signup endPoint
app.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
      },
    })

    res.json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//user Login endPoint
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    // Check if the password is correct
    if (!(await bcrypt.compare(password, existingUser.password))) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    res.json({ message: 'Login successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


const Port:number = 8080
app.listen(Port, () => {
  console.log(`Server is running on port\t ${Port}`)
})