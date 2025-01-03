import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import du module JWT
import UserModel from '../../../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Tous les champs sont obligatoires' }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'L\'email est déjà utilisé' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        const response = NextResponse.json(
            {
                message: 'Utilisateur créé avec succès',
                user: { id: user._id, name: user.name, email: user.email },
                token,
            },
            { status: 201 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: 60 * 60, 
            path: '/', 
        });

        return response;

    } catch (error) {
        return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
    }
}
