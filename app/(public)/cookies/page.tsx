
import React from 'react';

export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Politique de gestion des cookies</h1>
            <div className="prose max-w-none">
                <p className="mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience sur BusinessBook.
                </p>
                <h2 className="text-xl font-semibold mb-3">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="mb-4">
                    Un cookie est un petit fichier texte enregistré sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site.
                </p>
                <h2 className="text-xl font-semibold mb-3">2. Les cookies que nous utilisons</h2>
                <ul className="list-disc pl-5 mb-4">
                    <li>Cookies nécessaires au fonctionnement du site</li>
                    <li>Cookies de performance et d'analyse</li>
                </ul>
                <h2 className="text-xl font-semibold mb-3">3. Gestion de vos préférences</h2>
                <p className="mb-4">
                    Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies.
                </p>
            </div>
        </div>
    );
}
