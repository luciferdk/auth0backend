"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//user Signup endPoint
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Check if the user already exists
        const existingUser = yield prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        // Create the new user
        const newUser = yield prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName,
            },
        });
        res.json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
//user Login endPoint
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check if the user exists
        const existingUser = yield prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (!existingUser) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        // Check if the password is correct
        if (!(yield bcryptjs_1.default.compare(password, existingUser.password))) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.json({ message: 'Login successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
