"use client";

import Link from "next/link";

export default function Register() {
    async function handleRegister(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Erreur :", error.message);
                return alert("Erreur : " + error.message);
            }

            const data = await response.json();
            console.log("Succès :", data);
            alert("Inscription réussie !");
            window.location.href = "/jobs";
        } catch (error) {
            console.error("Erreur serveur :", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>
                <form onSubmit={handleRegister} className="space-y-4 text-black">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adresse e-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        S'inscrire
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Déjà un compte ?{" "}
                    <Link href="/auth/login" className="text-indigo-600 hover:underline">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}
