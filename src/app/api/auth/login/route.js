import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../../../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Tous les champs sont obligatoires' }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return NextResponse.json(
            {
                message: 'Connexion réussie',
                user: { id: user._id, name: user.name, email: user.email },
                token,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
    }
}
