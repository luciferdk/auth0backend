import { Prisma, PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from 'bcryptjs';
// const jsonStringify = require('safe-json-stringify');


const prisma = new PrismaClient()
const app = express()
const Port: number = 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json())


//user User data store endPoint
// Create a new user
app.post('/createUser', async (req, res) => {
  try {
    const { fullName, phoneNumber, message, date, time } = req.body;

    const user = await prisma.customer.create({
      data: {
        fullName,
        phoneNumber,
        message,
        date,
        time
      },
    });
    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// New endpoint to fetch one users details
app.get('/showUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.customer.findUnique({
      where: {
        id: Number(id), // Assuming id is a number, convert it to number
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// New endpoint to fetch all users
app.get('/showAllUser', async (req, res) => {
  try {
    const users = await prisma.customer.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/* // Update an existing user
app.put('/updateUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const updatedUser = await prisma.customer.update({
      where: {
        id: parseInt(id), // Assuming id is a number, convert to number
      },
      data: {

      },
    });
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}); */



//user Signup endPoint
app.post('/user/signup', async (req: Request, res: Response) => {
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
app.post('/user/login', async (req: Request, res: Response) => {
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
});



//worker Signup endPoint
app.post('/worker/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if the user already exists
    const existingUser = await prisma.worker.findUnique({
      where: {
        username,
      },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Create the new user
    const newUser = await prisma.worker.create({
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

//worker Login endPoint
app.post('/worker/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    // Check if the user exists
    const existingUser = await prisma.worker.findUnique({
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



app.listen(Port, () => {
  console.log(`Server is running on port\t ${Port}`)
})