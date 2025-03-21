


import React from 'react';

import Header from './components/header'; // Asegúrate de tener este componente creado


export default function Informacion() {


    return (

        <div className="min-h-screen">

            <Header />

            <main className="p-8" style={{ backgroundColor: '#feae4b' }}>

                <h2 className="text-3xl font-bold text-center mb-8 text-white">Información</h2>


                <Section title="Sobre Ávila Hiking" image="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/Avila.webp
">

                    <p className="text-gray-700 mb-4">

                        Ávila Hiking es una comunidad dedicada a explorar y disfrutar de las maravillas naturales del Parque Nacional El Ávila. Ofrecemos información detallada sobre las rutas de senderismo, consejos de seguridad y eventos comunitarios.

                    </p>

                </Section>


                <Section title="Misión">

                    <p className="text-gray-700 mb-4">

                        Nuestra misión es promover el senderismo y la apreciación de la naturaleza, fomentando un estilo de vida saludable y respetuoso con el medio ambiente.

                    </p>

                </Section>


                <Section title="Visión">

                    <p className="text-gray-700 mb-4">

                        Aspiramos a ser la comunidad de senderismo más grande y activa de la región, ofreciendo recursos y apoyo a todos los amantes de la naturaleza.

                    </p>

                </Section>


                <Section title="Valores">

                    <ul className="list-disc list-inside text-gray-700">

                        <li>Respeto por la naturaleza</li>

                        <li>Comunidad y colaboración</li>

                        <li>Salud y bienestar</li>

                        <li>Educación y concienciación</li>

                    </ul>

                </Section>


                <Section title="Consejos para Excursionistas" image="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/foto.png">

                    <p className="text-gray-700 mb-4">

                        Antes de salir de excursión, es importante estar bien preparado. Aquí tienes algunos consejos útiles:

                    </p>

                    <ul className="list-disc list-inside text-gray-700 mb-4">

                        <li>Planifica tu ruta con antelación y asegúrate de conocer el terreno.</li>

                        <li>Informa a alguien sobre tu itinerario y la hora estimada de regreso.</li>

                        <li>Lleva suficiente agua y alimentos energéticos.</li>

                        <li>Utiliza un mapa y una brújula o un GPS.</li>

                        <li>Respeta la naturaleza y no dejes basura.</li>

                    </ul>

                </Section>


                <Section title="Tipo de Calzado" image="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/calzado.webp">

                    <p className="text-gray-700 mb-4">

                        El calzado adecuado es esencial para una excursión segura y cómoda. Recomendamos:

                    </p>

                    <ul className="list-disc list-inside text-gray-700 mb-4">

                        <li>Botas de senderismo con buen soporte para el tobillo.</li>

                        <li>Calzado impermeable para mantener los pies secos.</li>

                        <li>Suela antideslizante para mayor tracción en terrenos irregulares.</li>

                    </ul>

                    <p className="text-gray-700 mb-4">

                        Las botas de senderismo proporcionan el soporte necesario para tus tobillos y pies, especialmente en terrenos irregulares. Asegúrate de que sean impermeables para mantener tus pies secos y cómodos.

                    </p>

                </Section>


                <Section title="Recomendaciones de Vestimenta" image="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/dddd.png">

                    <p className="text-gray-700 mb-4">

                        Vestirse adecuadamente puede marcar la diferencia en tu experiencia de senderismo. Aquí tienes algunas recomendaciones:

                    </p>
    
    
                    <ul className="list-disc list-inside text-gray-700 mb-4">
    
    
                        <li>Ropa transpirable y de secado rápido.</li>
    
    
                        <li>Capas de ropa para adaptarse a los cambios de temperatura.</li>
    
    
                        <li>Gorra o sombrero para protegerse del sol.</li>
    
    
                        <li>Chaqueta impermeable en caso de lluvia.</li>
    
    
                    </ul>
    
    
                    <p className="text-gray-700 mb-4">
    
    
                        Utiliza ropa en capas para poder adaptarte a los cambios de temperatura. La ropa transpirable
    
                    </p>
    
                </Section>
    
                <Section title="Qué Hacer y Qué No Hacer en una Excursión" image="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//aas.jpg">
    
                    <p className="text-gray-700 mb-4">
    
                        Para garantizar una excursión segura y agradable, sigue estas pautas:
    
                    </p>
    
                    <h4 className="text-xl font-bold mb-2 text-orange-600">Qué Hacer</h4>
    
                    <ul className="list-disc list-inside text-gray-700 mb-4">
    
                        <li>Respeta la flora y fauna local.</li>
    
                        <li>Sigue los senderos marcados.</li>
    
                        <li>Lleva un botiquín de primeros auxilios.</li>
    
                        <li>Hidrátate regularmente.</li>
    
                    </ul>
    
                    <h4 className="text-xl font-bold mb-2 text-orange-600">Qué No Hacer</h4>
    
                    <ul className="list-disc list-inside text-gray-700 mb-4">
    
                        <li>No te desvíes de los caminos señalizados.</li>
    
                        <li>No dejes basura ni residuos.</li>
    
                        <li>No molestes a los animales.</li>
    
                        <li>No subestimes el clima; prepárate para cambios repentinos.</li>
    
                    </ul>
    
                </Section>
    
            </main>
    
        </div>
    
    );
};

const Section = ({ title, children, image }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-orange-600">{title}</h3>
        {children}
        {image && <img alt={`Imagen de ${title}`} className="w-full h-100 object-cover rounded-lg mb-4" src={image} />}
    </div>
);


