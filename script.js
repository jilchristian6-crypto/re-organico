"use strict";

/* =====================================================
   DATOS GENERALES DE LA TIENDA
===================================================== */

const TIENDA = {
    nombre: "Re Orgánico",
    whatsapp: "56939303727",
    whatsappVisible: "+56 9 3930 3727",
    whatsappSecundario: "56979291371",
    whatsappSecundarioVisible: "+56 9 7929 1371",
    correo: "Contacto.reorganico@gmail.com",
    instagram: "@reorganico",
    instagramUrl: "https://www.instagram.com/reorganico/",
    despachos: "Rutas Re Orgánico + envíos a todo Chile",
    transportistas: "Starken · Blue Express · CorreosChile",
    pagos: "Rutas: efectivo o transferencia · Despachos: solo transferencia"
};

const CLAVE_CARRITO = "reOrganico_carrito_v4";

const PRODUCTOS_RESPALDO = [
    {
        "id": "bolsa-pequena-36x40-my14",
        "nombre": "Bolsa compostable pequeña 36 × 40 cm",
        "precio": 6969,
        "categoria": "bolsas",
        "descripcion": "Bolsa Bio Eco blanca, biodegradable y compostable. Ideal para compras pequeñas. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🛍️",
        "etiqueta": "Pequeña",
        "estado": "disponible",
        "orden": 1,
        "medida": "36 × 40 cm",
        "micras": 14,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 6969,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "bolsas",
                "precio": 32667,
                "detalle": "1 caja: 500 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-mediana-42x50-my14",
        "nombre": "Bolsa compostable mediana 42 × 50 cm MY14",
        "precio": 10627,
        "categoria": "bolsas",
        "descripcion": "Bolsa Bio Eco blanca, biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🛍️",
        "etiqueta": "Mediana",
        "estado": "disponible",
        "orden": 2,
        "medida": "42 × 50 cm",
        "micras": 14,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 10627,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "bolsas",
                "precio": 49813,
                "detalle": "1 caja: 500 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-mediana-42x50-my21",
        "nombre": "Bolsa compostable mediana 42 × 50 cm MY21",
        "precio": 15939,
        "categoria": "bolsas",
        "descripcion": "Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🌎",
        "etiqueta": "Salvemos el Planeta",
        "estado": "disponible",
        "orden": 3,
        "medida": "42 × 50 cm",
        "micras": 21,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 15939,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "bolsas",
                "precio": 76463,
                "detalle": "1 caja: 500 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-grande-48x55-my22",
        "nombre": "Bolsa compostable grande 48 × 55 cm MY22",
        "precio": 20799,
        "categoria": "bolsas",
        "descripcion": "Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🌿",
        "etiqueta": "Grande",
        "estado": "disponible",
        "orden": 4,
        "medida": "48 × 55 cm",
        "micras": 22,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 20799,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "bolsas",
                "precio": 100525,
                "detalle": "1 caja: 500 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-grande-48x60-my20",
        "nombre": "Bolsa compostable grande 48 × 60 cm MY20",
        "precio": 21239,
        "categoria": "bolsas",
        "descripcion": "Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🌿",
        "etiqueta": "Grande",
        "estado": "disponible",
        "orden": 5,
        "medida": "48 × 60 cm",
        "micras": 20,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 21239,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "bolsas",
                "precio": 102655,
                "detalle": "1 caja: 500 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-extra-grande-55x65-my25",
        "nombre": "Bolsa compostable extra grande 55 × 65 cm MY25",
        "precio": 32104,
        "categoria": "bolsas",
        "descripcion": "Bolsa Biomade “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "♻️",
        "etiqueta": "Extra grande",
        "estado": "disponible",
        "orden": 6,
        "medida": "55 × 65 cm",
        "micras": 25,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 32104,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 300,
                "unidad": "bolsas",
                "precio": 93098,
                "detalle": "1 caja: 300 bolsas"
            }
        ]
    },
    {
        "id": "bolsa-taco-25x35-my14",
        "nombre": "Bolsa compostable tipo taco 25 × 35 cm MY14",
        "precio": 6055,
        "categoria": "bolsas",
        "descripcion": "Bolsa compostable tipo taco. Venta mínima: 1 pack de 100 bolsas.",
        "emoji": "🛍️",
        "etiqueta": "Taco",
        "estado": "disponible",
        "orden": 7,
        "medida": "25 × 35 cm",
        "micras": 14,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "bolsas",
                "precio": 6055,
                "detalle": "1 pack: 100 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2700,
                "unidad": "bolsas",
                "precio": 155220,
                "detalle": "1 caja: 2.700 bolsas"
            }
        ]
    },
    {
        "id": "rollo-basura-50x60-my16",
        "nombre": "Bolsa de basura compostable blanca en rollo 50 × 60 cm MY16",
        "precio": 4486,
        "categoria": "rollos",
        "descripcion": "Bolsa de basura compostable blanca en rollo. Cada rollo trae 25 bolsas.",
        "emoji": "🗑️",
        "etiqueta": "Rollo",
        "estado": "disponible",
        "orden": 8,
        "medida": "50 × 60 cm",
        "micras": 16,
        "presentaciones": [
            {
                "id": "rollo",
                "nombre": "Rollo",
                "unidades": 25,
                "unidad": "bolsas",
                "precio": 4486,
                "detalle": "1 rollo: 25 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 600,
                "unidad": "bolsas",
                "precio": 104073,
                "detalle": "1 caja: 24 rollos: 600 bolsas",
                "rollos": 24
            }
        ]
    },
    {
        "id": "rollo-basura-70x90-my20",
        "nombre": "Bolsa de basura compostable blanca en rollo 70 × 90 cm MY20",
        "precio": 9903,
        "categoria": "rollos",
        "descripcion": "Bolsa de basura compostable blanca en rollo. Cada rollo trae 20 bolsas.",
        "emoji": "🗑️",
        "etiqueta": "Rollo",
        "estado": "disponible",
        "orden": 9,
        "medida": "70 × 90 cm",
        "micras": 20,
        "presentaciones": [
            {
                "id": "rollo",
                "nombre": "Rollo",
                "unidades": 20,
                "unidad": "bolsas",
                "precio": 9903,
                "detalle": "1 rollo: 20 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 200,
                "unidad": "bolsas",
                "precio": 95736,
                "detalle": "1 caja: 10 rollos: 200 bolsas",
                "rollos": 10
            }
        ]
    },
    {
        "id": "rollo-camiseta-34x50-my11",
        "nombre": "Bolsa compostable tipo camiseta en rollo 34 × 50 cm MY11",
        "precio": 17148,
        "categoria": "rollos",
        "descripcion": "Bolsa compostable tipo camiseta en rollo. Cada rollo contiene 200 bolsas.",
        "emoji": "🧻",
        "etiqueta": "200 por rollo",
        "estado": "disponible",
        "orden": 10,
        "medida": "34 × 50 cm",
        "micras": 11,
        "presentaciones": [
            {
                "id": "rollo",
                "nombre": "Rollo",
                "unidades": 200,
                "unidad": "bolsas",
                "precio": 17148,
                "detalle": "1 rollo: 200 bolsas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1200,
                "unidad": "bolsas",
                "precio": 99446,
                "detalle": "1 caja: 6 rollos: 1.200 bolsas",
                "rollos": 6
            }
        ]
    },
    {
        "id": "papel-compost-25x37",
        "nombre": "Papel compost Biomade 25 × 37 cm",
        "precio": 117139,
        "categoria": "papel",
        "descripcion": "Papel compost Biomade. Caja de 10 kg con aproximadamente 2.200 unidades.",
        "emoji": "📄",
        "etiqueta": "Caja 10 kg",
        "estado": "disponible",
        "orden": 11,
        "medida": "25 × 37 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "caja-10kg",
                "nombre": "Caja 10 kg",
                "unidades": 2200,
                "unidad": "unidades aprox.",
                "precio": 117139,
                "detalle": "1 caja de 10 kg ≈ 2.200 unidades"
            }
        ]
    },
    {
        "id": "papel-compost-37x50",
        "nombre": "Papel compost Biomade 37 × 50 cm",
        "precio": 117139,
        "categoria": "papel",
        "descripcion": "Papel compost Biomade. Caja de 10 kg con aproximadamente 1.100 unidades.",
        "emoji": "📄",
        "etiqueta": "Caja 10 kg",
        "estado": "disponible",
        "orden": 12,
        "medida": "37 × 50 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "caja-10kg",
                "nombre": "Caja 10 kg",
                "unidades": 1100,
                "unidad": "unidades aprox.",
                "precio": 117139,
                "detalle": "1 caja de 10 kg ≈ 1.100 unidades"
            }
        ]
    },
    {
        "id": "papel-compost-50x75",
        "nombre": "Papel compost Biomade 50 × 75 cm",
        "precio": 117139,
        "categoria": "papel",
        "descripcion": "Papel compost Biomade. Caja de 10 kg con aproximadamente 550 unidades.",
        "emoji": "📄",
        "etiqueta": "Caja 10 kg",
        "estado": "disponible",
        "orden": 13,
        "medida": "50 × 75 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "caja-10kg",
                "nombre": "Caja 10 kg",
                "unidades": 550,
                "unidad": "unidades aprox.",
                "precio": 117139,
                "detalle": "1 caja de 10 kg ≈ 550 unidades"
            }
        ]
    },
{
        "id": "pulpa-fast-food-191x136-ydb001",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 191 × 136 mm",
        "precio": 6817,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato rectangular pequeño alto. Código YDB001. Venta mínima: 1 pack de 25 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 14,
        "medida": "191 × 136 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "contenedores",
                "precio": 6817,
                "detalle": "1 pack: 25 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "contenedores",
                "precio": 123560,
                "detalle": "1 caja: 500 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-251x162-ydb0030",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 251 × 162 mm",
        "precio": 20557,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato rectangular grande. Código YDB0030. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 15,
        "medida": "251 × 162 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 20557,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "contenedores",
                "precio": 186302,
                "detalle": "1 caja: 500 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-240x160-ydb040",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 240 × 160 mm",
        "precio": 21880,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato rectangular. Código YDB040. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 16,
        "medida": "240 × 160 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 21880,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 250,
                "unidad": "contenedores",
                "precio": 99144,
                "detalle": "1 caja: 250 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-153x147-ydb003",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 153 × 147 mm",
        "precio": 7754,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato cuadrado. Código YDB003. Venta mínima: 1 pack de 25 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 17,
        "medida": "153 × 147 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "contenedores",
                "precio": 7754,
                "detalle": "1 pack: 25 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "contenedores",
                "precio": 140542,
                "detalle": "1 caja: 500 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-172x113-ydb004",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 172 × 113 mm",
        "precio": 12220,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato pequeño bajo. Código YDB004. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 18,
        "medida": "172 × 113 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 12220,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "contenedores",
                "precio": 221485,
                "detalle": "1 caja: 1.000 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-145x141-ydb024",
        "nombre": "Contenedor con tapa de pulpa de celulosa para sándwich 145 × 141 mm",
        "precio": 12220,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa para sándwich. Código YDB024. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥪",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 19,
        "medida": "145 × 141 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 12220,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "contenedores",
                "precio": 110743,
                "detalle": "1 caja: 500 contenedores"
            }
        ]
    },
    {
        "id": "pulpa-fast-food-218x207-ydb026",
        "nombre": "Contenedor con tapa de pulpa de celulosa Fast Food 218 × 207 mm",
        "precio": 25858,
        "categoria": "contenedores",
        "descripcion": "Contenedor compostable de pulpa de celulosa con tapa, formato cuadrado grande bajo. Código YDB026. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "Pulpa celulosa",
        "estado": "disponible",
        "orden": 20,
        "medida": "218 × 207 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 25858,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 250,
                "unidad": "contenedores",
                "precio": 117170,
                "detalle": "1 caja: 250 contenedores"
            }
        ]
    },
    {
        "id": "bambu-pote-ensalada-1200-1bg055",
        "nombre": "Pote ensalada Bio-Eco bambú 1.200 cc",
        "precio": 34540,
        "categoria": "contenedores",
        "descripcion": "Pote redondo de bambú para ensalada, capacidad 1.200 cc. Código 1BG055. Venta mínima: 1 pack de 50 potes.",
        "emoji": "🥗",
        "etiqueta": "Bambú",
        "estado": "disponible",
        "orden": 21,
        "medida": "1.200 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "potes",
                "precio": 34540,
                "detalle": "1 pack: 50 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 300,
                "unidad": "potes",
                "precio": 187814,
                "detalle": "1 caja: 300 potes"
            }
        ]
    },
    {
        "id": "bambu-tapa-cpla-1200-1bg056",
        "nombre": "Tapa transparente C-PLA para pote de 1.200 cc",
        "precio": 23449,
        "categoria": "tapas",
        "descripcion": "Tapa transparente C-PLA compatible con el pote Bio-Eco bambú 1BG055 de 1.200 cc. Código 1BG056. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥣",
        "etiqueta": "C-PLA",
        "estado": "disponible",
        "orden": 22,
        "medida": "1.200 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 23449,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 300,
                "unidad": "tapas",
                "precio": 127502,
                "detalle": "1 caja: 300 tapas"
            }
        ]
    },
    {
        "id": "bambu-pote-ensalada-750-1bg052",
        "nombre": "Pote ensalada Bio-Eco bambú 750 cc",
        "precio": 23946,
        "categoria": "contenedores",
        "descripcion": "Pote redondo de bambú para ensalada, capacidad 750 cc. Código 1BG052. Venta mínima: 1 pack de 50 potes.",
        "emoji": "🥗",
        "etiqueta": "Bambú",
        "estado": "disponible",
        "orden": 23,
        "medida": "750 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "potes",
                "precio": 23946,
                "detalle": "1 pack: 50 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 300,
                "unidad": "potes",
                "precio": 130205,
                "detalle": "1 caja: 300 potes"
            }
        ]
    },
    {
        "id": "bambu-tapa-cpla-750-1bg053",
        "nombre": "Tapa transparente C-PLA para pote de 750 cc",
        "precio": 17667,
        "categoria": "tapas",
        "descripcion": "Tapa transparente C-PLA compatible con el pote Bio-Eco bambú 1BG052 de 750 cc. Código 1BG053. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥣",
        "etiqueta": "C-PLA",
        "estado": "disponible",
        "orden": 24,
        "medida": "750 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 17667,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 300,
                "unidad": "tapas",
                "precio": 96065,
                "detalle": "1 caja: 300 tapas"
            }
        ]
    },
    {
        "id": "bambu-soup-bucket-500-1bg606",
        "nombre": "Soup Bucket compostable Bio-Eco bambú + PLA 500 cc",
        "precio": 10764,
        "categoria": "contenedores",
        "descripcion": "Pote tipo soup bucket compostable de bambú + PLA, capacidad 500 cc. Código 1BG606. Venta mínima: 1 pack de 25 potes.",
        "emoji": "🍲",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 25,
        "medida": "500 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "potes",
                "precio": 10764,
                "detalle": "1 pack: 25 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "potes",
                "precio": 195105,
                "detalle": "1 caja: 500 potes"
            }
        ]
    },
    {
        "id": "bambu-tapa-soup-bucket-500-1bg607",
        "nombre": "Tapa para Soup Bucket bambú + PLA 500 cc",
        "precio": 10064,
        "categoria": "tapas",
        "descripcion": "Tapa compatible con Soup Bucket Bio-Eco de 500 cc. Código 1BG607. Venta mínima: 1 pack de 25 tapas.",
        "emoji": "🥣",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 26,
        "medida": "500 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "tapas",
                "precio": 10064,
                "detalle": "1 pack: 25 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "tapas",
                "precio": 182417,
                "detalle": "1 caja: 500 tapas"
            }
        ]
    },
    {
        "id": "vaso-biopla-200-1vp185",
        "nombre": "Vaso Kristal BioPLA 200 cc",
        "precio": 8033,
        "categoria": "vasos",
        "descripcion": "Vaso transparente BioPLA de 200 cc. Código 1VP185. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "🥤",
        "etiqueta": "BioPLA",
        "estado": "disponible",
        "orden": 27,
        "medida": "200 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 8033,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1250,
                "unidad": "vasos",
                "precio": 183733,
                "detalle": "1 caja: 1.250 vasos"
            }
        ]
    },
    {
        "id": "vaso-biopla-400-1vp184",
        "nombre": "Vaso Kristal BioPLA 400 cc",
        "precio": 9954,
        "categoria": "vasos",
        "descripcion": "Vaso transparente BioPLA de 400 cc. Código 1VP184. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "🥤",
        "etiqueta": "BioPLA",
        "estado": "disponible",
        "orden": 28,
        "medida": "400 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 9954,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "vasos",
                "precio": 180418,
                "detalle": "1 caja: 1.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-biopla-500-1vp180",
        "nombre": "Vaso Kristal BioPLA 500 cc",
        "precio": 11946,
        "categoria": "vasos",
        "descripcion": "Vaso transparente BioPLA de 500 cc. Código 1VP180. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "🥤",
        "etiqueta": "BioPLA",
        "estado": "disponible",
        "orden": 29,
        "medida": "500 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 11946,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 800,
                "unidad": "vasos",
                "precio": 173210,
                "detalle": "1 caja: 800 vasos"
            }
        ]
    },
    {
        "id": "tapa-domo-biopla-400-1vp189",
        "nombre": "Tapa domo BioPLA para vaso 400 cc Ø85 mm",
        "precio": 7925,
        "categoria": "tapas",
        "descripcion": "Tapa domo transparente BioPLA para vaso de 400 cc, disponible con o sin perforación. Código 1VP189. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥤",
        "etiqueta": "Tapa domo",
        "estado": "disponible",
        "orden": 30,
        "medida": "Ø85 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 7925,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 600,
                "unidad": "tapas",
                "precio": 86189,
                "detalle": "1 caja: 600 tapas"
            }
        ]
    },
    {
        "id": "tapa-plana-biopla-400-1vp191",
        "nombre": "Tapa plana BioPLA para vaso 400 cc Ø85 mm",
        "precio": 7660,
        "categoria": "tapas",
        "descripcion": "Tapa plana transparente BioPLA para vaso de 400 cc con corte cruz. Código 1VP191. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥤",
        "etiqueta": "Tapa plana",
        "estado": "disponible",
        "orden": 31,
        "medida": "Ø85 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 7660,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 800,
                "unidad": "tapas",
                "precio": 111067,
                "detalle": "1 caja: 800 tapas"
            }
        ]
    },
    {
        "id": "tapa-domo-biopla-500-1vp176",
        "nombre": "Tapa domo BioPLA para vaso 500 cc Ø95 mm",
        "precio": 8936,
        "categoria": "tapas",
        "descripcion": "Tapa domo transparente BioPLA para vaso de 500 cc, disponible con o sin perforación. Código 1VP176. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥤",
        "etiqueta": "Tapa domo",
        "estado": "disponible",
        "orden": 32,
        "medida": "Ø95 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 8936,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 800,
                "unidad": "tapas",
                "precio": 129578,
                "detalle": "1 caja: 800 tapas"
            }
        ]
    },
    {
        "id": "tapa-plana-biopla-500-1vp177",
        "nombre": "Tapa plana BioPLA para vaso 500 cc Ø95 mm",
        "precio": 8722,
        "categoria": "tapas",
        "descripcion": "Tapa plana transparente BioPLA para vaso de 500 cc con corte cruz. Código 1VP177. Venta mínima: 1 pack de 50 tapas.",
        "emoji": "🥤",
        "etiqueta": "Tapa plana",
        "estado": "disponible",
        "orden": 33,
        "medida": "Ø95 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tapas",
                "precio": 8722,
                "detalle": "1 pack: 50 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 800,
                "unidad": "tapas",
                "precio": 126472,
                "detalle": "1 caja: 800 tapas"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-2-5oz-1bg668",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 2,5 oz / 75 cc",
        "precio": 7214,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 2,5 oz, capacidad aproximada 75 cc. Código 1BG668. Venta mínima: 1 pack de 100 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 34,
        "medida": "2,5 oz / 75 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "vasos",
                "precio": 7214,
                "detalle": "1 pack: 100 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2000,
                "unidad": "vasos",
                "precio": 130758,
                "detalle": "1 caja: 2.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-4oz-1bg669",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 4 oz / 120 cc",
        "precio": 4337,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 4 oz, capacidad 120 cc. Código 1BG669. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 35,
        "medida": "4 oz / 120 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 4337,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2000,
                "unidad": "vasos",
                "precio": 157221,
                "detalle": "1 caja: 2.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-7oz-1bg670",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 7 oz / 200 cc",
        "precio": 5607,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 7 oz, capacidad 200 cc. Código 1BG670. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 36,
        "medida": "7 oz / 200 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 5607,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2000,
                "unidad": "vasos",
                "precio": 203264,
                "detalle": "1 caja: 2.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-8oz-1bg672",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 8 oz / 250 cc",
        "precio": 6764,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 8 oz, capacidad 250 cc. Código 1BG672. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 37,
        "medida": "8 oz / 250 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 6764,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "vasos",
                "precio": 122590,
                "detalle": "1 caja: 1.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-10oz-1bg674",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 10 oz / 300 cc",
        "precio": 9742,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 10 oz, capacidad 300 cc. Código 1BG674. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 38,
        "medida": "10 oz / 300 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 9742,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "vasos",
                "precio": 176570,
                "detalle": "1 caja: 1.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-bambu-12oz-1bg676",
        "nombre": "Vaso papel bambú + PLA Bio-Eco 12 oz / 350 cc",
        "precio": 10745,
        "categoria": "vasos",
        "descripcion": "Vaso de papel bambú + PLA Bio-Eco de 12 oz, capacidad 350 cc. Código 1BG676. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 39,
        "medida": "12 oz / 350 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 10745,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "vasos",
                "precio": 187113,
                "detalle": "1 caja: 1.000 vasos"
            }
        ]
    },
    {
        "id": "vaso-papel-blanco-16oz-1bg039",
        "nombre": "Vaso papel blanco + PLA Bio-Eco 16 oz / 470 cc",
        "precio": 13356,
        "categoria": "vasos",
        "descripcion": "Vaso de papel blanco + PLA Bio-Eco de 16 oz, capacidad aproximada 470 cc. Código 1BG039. Venta mínima: 1 pack de 50 vasos.",
        "emoji": "☕",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 40,
        "medida": "16 oz / 470 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "vasos",
                "precio": 13356,
                "detalle": "1 pack: 50 vasos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "vasos",
                "precio": 242074,
                "detalle": "1 caja: 1.000 vasos"
            }
        ]
    },
    {
        "id": "tapa-pico-dm80-1bg3358",
        "nombre": "Tapa con pico C-PLA Bio-Eco DM80 para vaso 8 oz",
        "precio": 12733,
        "categoria": "tapas",
        "descripcion": "Tapa C-PLA Bio-Eco con pico DM80 para vaso de 8 oz. Código 1BG3358. Venta mínima: 1 pack de 100 tapas.",
        "emoji": "🥤",
        "etiqueta": "C-PLA",
        "estado": "disponible",
        "orden": 41,
        "medida": "DM80 / 8 oz",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "tapas",
                "precio": 12733,
                "detalle": "1 pack: 100 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "tapas",
                "precio": 125616,
                "detalle": "1 caja: 1.000 tapas"
            }
        ]
    },
    {
        "id": "tapa-pico-dm90-1bg359",
        "nombre": "Tapa con pico C-PLA Bio-Eco DM90 para vasos 10, 12 y 16 oz",
        "precio": 13090,
        "categoria": "tapas",
        "descripcion": "Tapa C-PLA Bio-Eco con pico DM90 compatible con vasos de 10, 12 y 16 oz. Código 1BG359. Venta mínima: 1 pack de 100 tapas.",
        "emoji": "🥤",
        "etiqueta": "C-PLA",
        "estado": "disponible",
        "orden": 42,
        "medida": "DM90 / 10-16 oz",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "tapas",
                "precio": 13090,
                "detalle": "1 pack: 100 tapas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "tapas",
                "precio": 129413,
                "detalle": "1 caja: 1.000 tapas"
            }
        ]
    },
    {
        "id": "pote-helado-bambu-160-1bg174",
        "nombre": "Pote helado Bio-Eco bambú + PLA 160 cc",
        "precio": 36446,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco de bambú + PLA, capacidad 160 cc. Código 1BG174. Venta mínima: 1 pack de 200 potes.",
        "emoji": "🍨",
        "etiqueta": "Bambú + PLA",
        "estado": "disponible",
        "orden": 43,
        "medida": "160 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-200",
                "nombre": "Pack",
                "unidades": 200,
                "unidad": "potes",
                "precio": 36446,
                "detalle": "1 pack: 200 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1400,
                "unidad": "potes",
                "precio": 231207,
                "detalle": "1 caja: 1.400 potes"
            }
        ]
    },
    {
        "id": "pote-helado-blanco-80-1bg090",
        "nombre": "Pote helado Bio-Eco blanco + PLA 80 cc",
        "precio": 43260,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco blanco + PLA, capacidad 80 cc. Código 1BG090. Venta mínima: 1 pack de 250 potes.",
        "emoji": "🍨",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 44,
        "medida": "80 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-250",
                "nombre": "Pack",
                "unidades": 250,
                "unidad": "potes",
                "precio": 43260,
                "detalle": "1 pack: 250 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2250,
                "unidad": "potes",
                "precio": 352838,
                "detalle": "1 caja: 2.250 potes"
            }
        ]
    },
    {
        "id": "pote-helado-blanco-120-1bg092",
        "nombre": "Pote helado Bio-Eco blanco + PLA 120 cc",
        "precio": 46644,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco blanco + PLA, capacidad 120 cc. Código 1BG092. Venta mínima: 1 pack de 250 potes.",
        "emoji": "🍨",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 45,
        "medida": "120 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-250",
                "nombre": "Pack",
                "unidades": 250,
                "unidad": "potes",
                "precio": 46644,
                "detalle": "1 pack: 250 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2000,
                "unidad": "potes",
                "precio": 338170,
                "detalle": "1 caja: 2.000 potes"
            }
        ]
    },
    {
        "id": "pote-helado-blanco-160-1bg094",
        "nombre": "Pote helado Bio-Eco blanco + PLA 160 cc",
        "precio": 42490,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco blanco + PLA, capacidad 160 cc. Código 1BG094. Venta mínima: 1 pack de 200 potes.",
        "emoji": "🍨",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 46,
        "medida": "160 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-200",
                "nombre": "Pack",
                "unidades": 200,
                "unidad": "potes",
                "precio": 42490,
                "detalle": "1 pack: 200 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1400,
                "unidad": "potes",
                "precio": 269544,
                "detalle": "1 caja: 1.400 potes"
            }
        ]
    },
    {
        "id": "pote-helado-blanco-200-1bg096",
        "nombre": "Pote helado Bio-Eco blanco + PLA 200 cc",
        "precio": 42935,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco blanco + PLA, capacidad 200 cc. Código 1BG096. Venta mínima: 1 pack de 200 potes.",
        "emoji": "🍨",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 47,
        "medida": "200 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-200",
                "nombre": "Pack",
                "unidades": 200,
                "unidad": "potes",
                "precio": 42935,
                "detalle": "1 pack: 200 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1400,
                "unidad": "potes",
                "precio": 269092,
                "detalle": "1 caja: 1.400 potes"
            }
        ]
    },
    {
        "id": "pote-helado-blanco-230-1bg097",
        "nombre": "Pote helado Bio-Eco blanco + PLA 230 cc",
        "precio": 46034,
        "categoria": "heladeria",
        "descripcion": "Pote para helado Bio-Eco blanco + PLA, capacidad 230 cc. Código 1BG097. Venta mínima: 1 pack de 180 potes.",
        "emoji": "🍨",
        "etiqueta": "Blanco + PLA",
        "estado": "disponible",
        "orden": 48,
        "medida": "230 cc",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-180",
                "nombre": "Pack",
                "unidades": 180,
                "unidad": "potes",
                "precio": 46034,
                "detalle": "1 pack: 180 potes"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1260,
                "unidad": "potes",
                "precio": 292029,
                "detalle": "1 caja: 1.260 potes"
            }
        ]
    },
    {
        "id": "tenedor-pla-16-5-1vp220",
        "nombre": "Tenedor Bio-Eco PLA 16,5 cm",
        "precio": 5457,
        "categoria": "cubiertos",
        "descripcion": "Tenedor compostable Bio-Eco PLA de 16,5 cm. Código 1VP220. Venta mínima: 1 pack de 50 tenedores.",
        "emoji": "🍴",
        "etiqueta": "PLA",
        "estado": "disponible",
        "orden": 49,
        "medida": "16,5 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "tenedores",
                "precio": 5457,
                "detalle": "1 pack: 50 tenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "tenedores",
                "precio": 98907,
                "detalle": "1 caja: 1.000 tenedores"
            }
        ]
    },
    {
        "id": "cuchillo-pla-16-5-1vp224",
        "nombre": "Cuchillo Bio-Eco PLA 16,5 cm",
        "precio": 5457,
        "categoria": "cubiertos",
        "descripcion": "Cuchillo compostable Bio-Eco PLA de 16,5 cm. Código 1VP224. Venta mínima: 1 pack de 50 cuchillos.",
        "emoji": "🍴",
        "etiqueta": "PLA",
        "estado": "disponible",
        "orden": 50,
        "medida": "16,5 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "cuchillos",
                "precio": 5457,
                "detalle": "1 pack: 50 cuchillos"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "cuchillos",
                "precio": 98907,
                "detalle": "1 caja: 1.000 cuchillos"
            }
        ]
    },
    {
        "id": "cuchara-pla-15-1vp222",
        "nombre": "Cuchara Bio-Eco PLA 15 cm",
        "precio": 5457,
        "categoria": "cubiertos",
        "descripcion": "Cuchara compostable Bio-Eco PLA de 15 cm. Código 1VP222. Venta mínima: 1 pack de 50 cucharas.",
        "emoji": "🥄",
        "etiqueta": "PLA",
        "estado": "disponible",
        "orden": 51,
        "medida": "15 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "cucharas",
                "precio": 5457,
                "detalle": "1 pack: 50 cucharas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 1000,
                "unidad": "cucharas",
                "precio": 98907,
                "detalle": "1 caja: 1.000 cucharas"
            }
        ]
    },
    {
        "id": "pack-tenedor-servilleta-1vp125",
        "nombre": "Pack Bio-Eco PLA tenedor + servilleta",
        "precio": 5955,
        "categoria": "cubiertos",
        "descripcion": "Set en bolsita con tenedor y servilleta Bio-Eco PLA. Código 1VP125. Venta mínima: 1 pack de 25 sets.",
        "emoji": "🍴",
        "etiqueta": "En bolsita",
        "estado": "disponible",
        "orden": 52,
        "medida": null,
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "sets",
                "precio": 5955,
                "detalle": "1 pack: 25 sets"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 500,
                "unidad": "sets",
                "precio": 107938,
                "detalle": "1 caja: 500 sets"
            }
        ]
    },
    {
        "id": "pack-bis-servilleta-1vp126",
        "nombre": "Pack Bio-Eco PLA tenedor + cuchillo + servilleta",
        "precio": 9156,
        "categoria": "cubiertos",
        "descripcion": "Set en bolsita con tenedor, cuchillo y servilleta Bio-Eco PLA. Código 1VP126. Venta mínima: 1 pack de 25 sets.",
        "emoji": "🍴",
        "etiqueta": "En bolsita",
        "estado": "disponible",
        "orden": 53,
        "medida": null,
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "sets",
                "precio": 9156,
                "detalle": "1 pack: 25 sets"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 250,
                "unidad": "sets",
                "precio": 82978,
                "detalle": "1 caja: 250 sets"
            }
        ]
    },
    {
        "id": "pack-tris-servilleta-1vp129",
        "nombre": "Pack Bio-Eco PLA tenedor + cuchillo + cuchara + servilleta",
        "precio": 13736,
        "categoria": "cubiertos",
        "descripcion": "Set en bolsita con tenedor, cuchillo, cuchara y servilleta Bio-Eco PLA. Código 1VP129. Venta mínima: 1 pack de 25 sets.",
        "emoji": "🍴",
        "etiqueta": "En bolsita",
        "estado": "disponible",
        "orden": 54,
        "medida": null,
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-25",
                "nombre": "Pack",
                "unidades": 25,
                "unidad": "sets",
                "precio": 13736,
                "detalle": "1 pack: 25 sets"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 250,
                "unidad": "sets",
                "precio": 124481,
                "detalle": "1 caja: 250 sets"
            }
        ]
    },
    {
        "id": "paletita-helado-pla-10cm-1bg153",
        "nombre": "Paletita para helado PLA Bio-Eco 10 cm",
        "precio": 24607,
        "categoria": "heladeria",
        "descripcion": "Paletita compostable para helado PLA Bio-Eco de 10 cm. Código 1BG153. Venta mínima: 1 pack de 500 paletitas.",
        "emoji": "🍦",
        "etiqueta": "Accesorio helado",
        "estado": "disponible",
        "orden": 55,
        "medida": "10 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-500",
                "nombre": "Pack",
                "unidades": 500,
                "unidad": "paletitas",
                "precio": 24607,
                "detalle": "1 pack: 500 paletitas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 5000,
                "unidad": "paletitas",
                "precio": 223004,
                "detalle": "1 caja: 5.000 paletitas"
            }
        ]
    },
    {
        "id": "cucharita-helado-pla-10-5-1vp226",
        "nombre": "Cucharita Bio-Eco PLA 10,5 cm",
        "precio": 5979,
        "categoria": "heladeria",
        "descripcion": "Cucharita compostable Bio-Eco PLA de 10,5 cm, ideal para helados y postres. Código 1VP226. Venta mínima: 1 pack de 100 cucharitas.",
        "emoji": "🥄",
        "etiqueta": "Accesorio helado",
        "estado": "disponible",
        "orden": 56,
        "medida": "10,5 cm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-100",
                "nombre": "Pack",
                "unidades": 100,
                "unidad": "cucharitas",
                "precio": 5979,
                "detalle": "1 pack: 100 cucharitas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 2000,
                "unidad": "cucharitas",
                "precio": 108365,
                "detalle": "1 caja: 2.000 cucharitas"
            }
        ]
    },
    {
        "id": "bombilla-pla-blanca-1can41",
        "nombre": "Bombilla Bio-Eco PLA sin fuelle blanca Ø6 × 210 mm",
        "precio": 3619,
        "categoria": "bombillas",
        "descripcion": "Bombilla compostable Bio-Eco PLA sin fuelle, color blanco. Código 1CAN41. Venta mínima: 1 pack de 150 bombillas.",
        "emoji": "🥤",
        "etiqueta": "Blanca",
        "estado": "disponible",
        "orden": 57,
        "medida": "Ø6 × 210 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-150",
                "nombre": "Pack",
                "unidades": 150,
                "unidad": "bombillas",
                "precio": 3619,
                "detalle": "1 pack: 150 bombillas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 3450,
                "unidad": "bombillas",
                "precio": 75436,
                "detalle": "1 caja: 3.450 bombillas"
            }
        ]
    },
    {
        "id": "bombilla-pla-negra-1can60",
        "nombre": "Bombilla Bio-Eco PLA sin fuelle negra Ø6 × 210 mm",
        "precio": 3969,
        "categoria": "bombillas",
        "descripcion": "Bombilla compostable Bio-Eco PLA sin fuelle, color negro. Código 1CAN60. Venta mínima: 1 pack de 150 bombillas.",
        "emoji": "🥤",
        "etiqueta": "Negra",
        "estado": "disponible",
        "orden": 58,
        "medida": "Ø6 × 210 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-150",
                "nombre": "Pack",
                "unidades": 150,
                "unidad": "bombillas",
                "precio": 3969,
                "detalle": "1 pack: 150 bombillas"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 3450,
                "unidad": "bombillas",
                "precio": 82723,
                "detalle": "1 caja: 3.450 bombillas"
            }
        ]
    },
    {
        "id": "contenedor-pla-tapa-250-20500",
        "nombre": "Contenedor rectangular PLA compostable + tapa 250 cc",
        "precio": 18098,
        "categoria": "contenedores",
        "descripcion": "Contenedor rectangular PLA compostable con tapa, capacidad 250 cc. Código 20500. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "PLA + tapa",
        "estado": "disponible",
        "orden": 59,
        "medida": "126 × 117 × 40 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 18098,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 700,
                "unidad": "contenedores",
                "precio": 229624,
                "detalle": "1 caja: 700 contenedores"
            }
        ]
    },
    {
        "id": "contenedor-pla-tapa-370-20502",
        "nombre": "Contenedor rectangular PLA compostable + tapa 370 cc",
        "precio": 18415,
        "categoria": "contenedores",
        "descripcion": "Contenedor rectangular PLA compostable con tapa, capacidad 370 cc. Código 20502. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "PLA + tapa",
        "estado": "disponible",
        "orden": 60,
        "medida": "126 × 117 × 56 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 18415,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 700,
                "unidad": "contenedores",
                "precio": 233647,
                "detalle": "1 caja: 700 contenedores"
            }
        ]
    },
    {
        "id": "contenedor-pla-tapa-500-20504",
        "nombre": "Contenedor rectangular PLA compostable + tapa 500 cc",
        "precio": 19215,
        "categoria": "contenedores",
        "descripcion": "Contenedor rectangular PLA compostable con tapa, capacidad 500 cc. Código 20504. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "PLA + tapa",
        "estado": "disponible",
        "orden": 61,
        "medida": "135 × 125 × 56 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 19215,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 600,
                "unidad": "contenedores",
                "precio": 208959,
                "detalle": "1 caja: 600 contenedores"
            }
        ]
    },
    {
        "id": "contenedor-pla-tapa-750-20506",
        "nombre": "Contenedor rectangular PLA compostable + tapa 750 cc",
        "precio": 28712,
        "categoria": "contenedores",
        "descripcion": "Contenedor rectangular PLA compostable con tapa, capacidad 750 cc. Código 20506. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "PLA + tapa",
        "estado": "disponible",
        "orden": 62,
        "medida": "188 × 143 × 52 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 28712,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 400,
                "unidad": "contenedores",
                "precio": 208164,
                "detalle": "1 caja: 400 contenedores"
            }
        ]
    },
    {
        "id": "contenedor-pla-tapa-1000-20508",
        "nombre": "Contenedor rectangular PLA compostable + tapa 1.000 cc",
        "precio": 34502,
        "categoria": "contenedores",
        "descripcion": "Contenedor rectangular PLA compostable con tapa, capacidad 1.000 cc. Código 20508. Venta mínima: 1 pack de 50 contenedores.",
        "emoji": "🥡",
        "etiqueta": "PLA + tapa",
        "estado": "disponible",
        "orden": 63,
        "medida": "188 × 143 × 67 mm",
        "micras": null,
        "presentaciones": [
            {
                "id": "pack-50",
                "nombre": "Pack",
                "unidades": 50,
                "unidad": "contenedores",
                "precio": 34502,
                "detalle": "1 pack: 50 contenedores"
            },
            {
                "id": "caja",
                "nombre": "Caja completa",
                "unidades": 400,
                "unidad": "contenedores",
                "precio": 250142,
                "detalle": "1 caja: 400 contenedores"
            }
        ]
    },
    {
        "id": "vermicompostera-4-niveles",
        "nombre": "Vermicompostera de 4 niveles",
        "precio": 21000,
        "categoria": "compostaje",
        "descripcion": "Casa para lombrices californianas, diseñada para producir humus de lombriz a partir de residuos orgánicos.",
        "emoji": "🪱",
        "etiqueta": "4 niveles",
        "estado": "disponible",
        "orden": 0,
        "medida": "4 niveles",
        "micras": null,
        "presentaciones": [
            {
                "id": "unidad",
                "nombre": "Unidad",
                "unidades": 1,
                "unidad": "vermicompostera",
                "precio": 21000,
                "detalle": "1 unidad: vermicompostera de 4 niveles"
            }
        ]
    }
];

const PRODUCTOS_EXCLUSIVOS_SITIO = new Set([
    "vermicompostera-4-niveles"
]);

const CORRECCIONES_PRODUCTOS = {
    "bolsa-taco-25x35-my14": {
        nombre: "Bolsa compostable tipo taco 25 × 35 cm MY14",
        descripcion: "Bolsa compostable tipo taco. Venta mínima: 1 pack de 100 bolsas."
    },
    "rollo-basura-50x60-my16": {
        nombre: "Bolsa de basura compostable blanca en rollo 50 × 60 cm MY16",
        descripcion: "Bolsa de basura compostable blanca en rollo. Cada rollo trae 25 bolsas."
    },
    "rollo-basura-70x90-my20": {
        nombre: "Bolsa de basura compostable blanca en rollo 70 × 90 cm MY20",
        descripcion: "Bolsa de basura compostable blanca en rollo. Cada rollo trae 20 bolsas."
    },
    "rollo-camiseta-34x50-my11": {
        nombre: "Bolsa compostable tipo camiseta en rollo 34 × 50 cm MY11",
        descripcion: "Bolsa compostable tipo camiseta en rollo. Cada rollo contiene 200 bolsas."
    }
};

function normalizarProducto(producto) {
    const correccion = CORRECCIONES_PRODUCTOS[producto?.id];
    return correccion ? { ...producto, ...correccion } : producto;
}

const CATEGORIAS = {
    compostaje: "Compostaje",
    bolsas: "Bolsas Compostables Tipo Camiseta",
    rollos: "Bolsas Compostables En Rollo",
    papel: "Papel Compostable",
    contenedores: "Contenedores Compostables",
    vasos: "Vasos Compostables",
    tapas: "Tapas Compostables",
    heladeria: "Heladería Compostable",
    cubiertos: "Cubiertos Compostables",
    bombillas: "Bombillas Compostables"
};

const ESTADOS = {
    disponible: "Disponible",
    ultimas: "Últimas unidades",
    pedido: "A pedido",
    agotado: "Agotado"
};

const FONDOS = {
    compostaje: "linear-gradient(145deg, #eaf4e4, #b8d2a9)",
    bolsas: "linear-gradient(145deg, #e8f5e9, #a8d5aa)",
    rollos: "linear-gradient(145deg, #edf4e6, #bed3a4)",
    papel: "linear-gradient(145deg, #f5efe3, #d7c9aa)",
    contenedores: "linear-gradient(145deg, #eef7e9, #c6ddb6)",
    vasos: "linear-gradient(145deg, #eef8f3, #b9ddcf)",
    tapas: "linear-gradient(145deg, #f0f6ed, #cadcbf)",
    heladeria: "linear-gradient(145deg, #fff6e8, #eed9b4)",
    cubiertos: "linear-gradient(145deg, #f5f5ef, #d8d8c8)",
    bombillas: "linear-gradient(145deg, #edf7f0, #b9d7c2)"
};

let productos = PRODUCTOS_RESPALDO
    .map((producto) => normalizarProducto({ ...producto }))
    .sort((a, b) => {
        const porOrden = (Number(a.orden) || 0) - (Number(b.orden) || 0);
        return porOrden || a.nombre.localeCompare(b.nombre, "es");
    });
let carrito = cargarCarrito();
let categoriaActiva = "todos";
const PRODUCTOS_POR_PAGINA = 6;
let cantidadProductosVisibles = PRODUCTOS_POR_PAGINA;
let productoModalId = null;
let presentacionModalId = null;
let cantidadModal = 1;
let temporizadorToast = null;
let clienteSupabase = null;

const elementos = {
    encabezado: document.getElementById("encabezado"),
    botonMenu: document.getElementById("boton-menu"),
    menu: document.getElementById("menu"),
    listaProductos: document.getElementById("lista-productos"),
    buscador: document.getElementById("buscador-productos"),
    limpiarBusqueda: document.getElementById("limpiar-busqueda"),
    contadorProductos: document.getElementById("contador-productos"),
    accionesCatalogo: document.getElementById("acciones-catalogo"),
    verMasProductos: document.getElementById("ver-mas-productos"),
    verMenosProductos: document.getElementById("ver-menos-productos"),
    filtros: document.getElementById("filtros-productos"),
    sinResultados: document.getElementById("sin-resultados"),
    contadorCarrito: document.getElementById("contador-carrito"),
    carrito: document.getElementById("carrito"),
    carritoLista: document.getElementById("carrito-lista"),
    carritoVacio: document.getElementById("carrito-vacio"),
    carritoTotal: document.getElementById("carrito-total"),
    modalProducto: document.getElementById("modal-producto"),
    modalProductoVisual: document.getElementById("modal-producto-visual"),
    modalProductoCategoria: document.getElementById("modal-producto-categoria"),
    modalProductoTitulo: document.getElementById("modal-producto-titulo"),
    modalProductoDescripcion: document.getElementById("modal-producto-descripcion"),
    modalProductoPrecio: document.getElementById("modal-producto-precio"),
    modalProductoDatos: document.getElementById("modal-producto-datos"),
    modalPresentacion: document.getElementById("modal-presentacion"),
    modalPresentacionResumen: document.getElementById("modal-presentacion-resumen"),
    modalCantidadLabel: document.getElementById("modal-cantidad-label"),
    modalCantidadAyuda: document.getElementById("modal-cantidad-ayuda"),
    modalCantidadValor: document.getElementById("modal-cantidad-valor"),
    modalCantidadRestar: document.getElementById("modal-cantidad-restar"),
    modalCantidadSumar: document.getElementById("modal-cantidad-sumar"),
    modalCantidadTotal: document.getElementById("modal-cantidad-total"),
    modalAgregarCarrito: document.getElementById("modal-agregar-carrito"),
    formularioConsulta: document.getElementById("formulario-consulta"),
    productoConsulta: document.getElementById("producto-consulta"),
    modalPedido: document.getElementById("modal-pedido"),
    formularioPedido: document.getElementById("formulario-pedido"),
    pedidoResumenMini: document.getElementById("pedido-resumen-mini"),
    pedidoNombre: document.getElementById("pedido-nombre"),
    pedidoTelefono: document.getElementById("pedido-telefono"),
    pedidoTipoEntrega: document.getElementById("pedido-tipo-entrega"),
    pedidoRuta: document.getElementById("pedido-ruta"),
    pedidoRegion: document.getElementById("pedido-region"),
    pedidoComuna: document.getElementById("pedido-comuna"),
    pedidoDireccion: document.getElementById("pedido-direccion"),
    pedidoEmpresa: document.getElementById("pedido-empresa"),
    pedidoPago: document.getElementById("pedido-pago"),
    pedidoObservaciones: document.getElementById("pedido-observaciones"),
    mensajePedido: document.getElementById("mensaje-pedido"),
    confirmarPedido: document.getElementById("confirmar-pedido"),
    tipoEntrega: document.getElementById("tipo-entrega"),
    rutaEntrega: document.getElementById("ruta-entrega"),
    regionCliente: document.getElementById("region-cliente"),
    comunaCliente: document.getElementById("comuna-cliente"),
    empresaEnvio: document.getElementById("empresa-envio"),
    pagoConsulta: document.getElementById("pago-consulta"),
    volverArriba: document.getElementById("volver-arriba"),
    toast: document.getElementById("toast")
};

inicializar();

async function inicializar() {
    aplicarDatosTienda();
    actualizarCamposEntrega();
    inicializarCarruselPortada();
    inicializarEventos();
    inicializarAnimaciones();
    actualizarNavegacion();
    renderizarCatalogo();
    renderizarCarrito();
    renderizarSelectorProductos();

    clienteSupabase = crearClienteSupabase();

    if (clienteSupabase) {
        await cargarProductosDesdeSupabase();
    }
}

function inicializarCarruselPortada() {
    const carrusel = document.getElementById("hero-carrusel");
    if (!carrusel) return;

    const diapositivas = [...carrusel.querySelectorAll("[data-hero-diapositiva]")];
    const indicadores = [...carrusel.querySelectorAll("[data-hero-indice]")];
    const anterior = carrusel.querySelector("[data-hero-anterior]");
    const siguiente = carrusel.querySelector("[data-hero-siguiente]");
    const estado = document.getElementById("hero-carrusel-estado");
    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let indiceActual = 0;
    let temporizador = null;
    let toqueInicialX = null;

    function mostrarDiapositiva(indice, anunciar = true) {
        indiceActual = (indice + diapositivas.length) % diapositivas.length;

        diapositivas.forEach((diapositiva, posicion) => {
            const activa = posicion === indiceActual;
            diapositiva.classList.toggle("activa", activa);
            diapositiva.setAttribute("aria-hidden", activa ? "false" : "true");
        });

        indicadores.forEach((indicador, posicion) => {
            indicador.setAttribute("aria-current", posicion === indiceActual ? "true" : "false");
        });

        if (estado && anunciar) {
            estado.textContent = `Foto ${indiceActual + 1} de ${diapositivas.length}`;
        }
    }

    function detenerReproduccion() {
        window.clearInterval(temporizador);
        temporizador = null;
    }

    function iniciarReproduccion() {
        detenerReproduccion();
        if (movimientoReducido.matches || document.hidden) return;

        temporizador = window.setInterval(() => {
            mostrarDiapositiva(indiceActual + 1, false);
        }, 5000);
    }

    function cambiarManual(indice) {
        mostrarDiapositiva(indice);
        iniciarReproduccion();
    }

    anterior?.addEventListener("click", () => cambiarManual(indiceActual - 1));
    siguiente?.addEventListener("click", () => cambiarManual(indiceActual + 1));

    indicadores.forEach((indicador) => {
        indicador.addEventListener("click", () => cambiarManual(Number(indicador.dataset.heroIndice)));
    });

    carrusel.addEventListener("mouseenter", detenerReproduccion);
    carrusel.addEventListener("mouseleave", iniciarReproduccion);
    carrusel.addEventListener("focusin", detenerReproduccion);
    carrusel.addEventListener("focusout", () => {
        window.setTimeout(() => {
            if (!carrusel.contains(document.activeElement)) iniciarReproduccion();
        }, 0);
    });

    carrusel.addEventListener("touchstart", (evento) => {
        toqueInicialX = evento.changedTouches[0]?.clientX ?? null;
    }, { passive: true });

    carrusel.addEventListener("touchend", (evento) => {
        if (toqueInicialX === null) return;
        const toqueFinalX = evento.changedTouches[0]?.clientX ?? toqueInicialX;
        const desplazamiento = toqueFinalX - toqueInicialX;
        toqueInicialX = null;

        if (Math.abs(desplazamiento) < 45) return;
        cambiarManual(indiceActual + (desplazamiento < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) detenerReproduccion();
        else iniciarReproduccion();
    });

    movimientoReducido.addEventListener?.("change", iniciarReproduccion);
    mostrarDiapositiva(0, false);
    iniciarReproduccion();
}

function crearClienteSupabase() {
    const configuracion = window.REORGANICO_SUPABASE;

    if (
        !configuracion ||
        !configuracion.url ||
        !configuracion.anonKey ||
        configuracion.url.includes("PEGA_AQUI") ||
        configuracion.anonKey.includes("PEGA_AQUI") ||
        !window.supabase
    ) {
        console.info("Supabase aún no está configurado. Se muestra el catálogo de respaldo.");
        return null;
    }

    return window.supabase.createClient(configuracion.url, configuracion.anonKey);
}

async function cargarProductosDesdeSupabase() {
    const { data, error } = await clienteSupabase
        .from("productos")
        .select("id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones,imagen_path")
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

    if (error) {
        console.error("No fue posible cargar el catálogo:", error);
        mostrarToast("No se pudo actualizar el catálogo. Se muestra una copia local.");
        return;
    }

    if (Array.isArray(data) && data.length > 0) {
        const productosRemotos = data.map((producto) => normalizarProducto(producto));
        const idsRemotos = new Set(productosRemotos.map((producto) => producto.id));
        const productosLocales = PRODUCTOS_RESPALDO
            .filter((producto) => PRODUCTOS_EXCLUSIVOS_SITIO.has(producto.id) && !idsRemotos.has(producto.id))
            .map((producto) => normalizarProducto({ ...producto }));

        productos = [...productosRemotos, ...productosLocales].sort((a, b) => {
            const porOrden = (Number(a.orden) || 0) - (Number(b.orden) || 0);
            return porOrden || a.nombre.localeCompare(b.nombre, "es");
        });
        limpiarCarritoDesactualizado();
        renderizarCatalogo();
        renderizarCarrito();
        renderizarSelectorProductos();
    }
}

function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        console.warn("No se pudo cargar el carrito:", error);
        return [];
    }
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function limpiarCarritoDesactualizado() {
    const idsDisponibles = new Set(productos.map((producto) => producto.id));
    const carritoLimpio = carrito.filter((item) => idsDisponibles.has(item.id));

    if (carritoLimpio.length !== carrito.length) {
        carrito = carritoLimpio;
        guardarCarrito();
    }
}

function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);
}

function escaparHTML(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function fondoProducto(producto) {
    return FONDOS[producto.categoria] || FONDOS.bolsas;
}

function obtenerUrlPublicaProducto(path) {
    if (!path || !clienteSupabase) return "";

    const { data } = clienteSupabase.storage
        .from("productos")
        .getPublicUrl(path);

    return data?.publicUrl || "";
}

function activarFallbackImagenesProductos(contenedor) {
    contenedor.querySelectorAll("[data-producto-imagen]").forEach((imagen) => {
        imagen.addEventListener("error", () => {
            const emoji = document.createElement("span");
            emoji.className = "producto-emoji";
            emoji.setAttribute("aria-hidden", "true");
            emoji.textContent = imagen.dataset.emoji || "🌿";
            imagen.replaceWith(emoji);
        }, { once: true });
    });
}

function mostrarToast(mensaje) {
    elementos.toast.textContent = mensaje;
    elementos.toast.classList.add("visible");

    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => {
        elementos.toast.classList.remove("visible");
    }, 2600);
}

function construirEnlaceWhatsApp(mensaje) {
    return `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

function aplicarDatosTienda() {
    document.getElementById("dato-whatsapp").textContent = TIENDA.whatsappVisible;
    document.getElementById("dato-whatsapp-secundario").textContent = TIENDA.whatsappSecundarioVisible;
    document.getElementById("dato-correo").textContent = TIENDA.correo;
    document.getElementById("dato-instagram").textContent = TIENDA.instagram;
    document.getElementById("dato-despachos").textContent = `${TIENDA.despachos} · ${TIENDA.transportistas}`;
    document.getElementById("dato-pagos").textContent = TIENDA.pagos;

    const mensajeGeneral = `Hola, quiero consultar por los productos de ${TIENDA.nombre}.`;
    const enlaceWhatsApp = construirEnlaceWhatsApp(mensajeGeneral);
    const enlaceSecundario = `https://wa.me/${TIENDA.whatsappSecundario}?text=${encodeURIComponent(mensajeGeneral)}`;

    document.getElementById("enlace-whatsapp-contacto").href = enlaceWhatsApp;
    document.getElementById("enlace-whatsapp-dato").href = enlaceWhatsApp;
    document.getElementById("enlace-whatsapp-secundario").href = enlaceSecundario;
    document.getElementById("enlace-correo-contacto").href = `mailto:${TIENDA.correo}`;
    document.getElementById("enlace-whatsapp-pie").href = enlaceWhatsApp;
    document.getElementById("whatsapp-flotante").href = enlaceWhatsApp;
    document.getElementById("enlace-instagram-contacto").href = TIENDA.instagramUrl;
    document.getElementById("enlace-instagram-pie").href = TIENDA.instagramUrl;
}

function alternarCampo(id, campo, habilitado) {
    const contenedor = document.getElementById(id);
    contenedor.classList.toggle("campo-deshabilitado", !habilitado);
    campo.disabled = !habilitado;
}

function actualizarPagoSegunEntrega(selectPago, esRuta) {
    const opcionEfectivo = selectPago.querySelector('option[value="efectivo"]');

    if (!opcionEfectivo) return;

    opcionEfectivo.disabled = !esRuta;
    opcionEfectivo.hidden = !esRuta;

    if (!esRuta) {
        selectPago.value = "transferencia";
    }
}

function actualizarCamposEntrega() {
    const esRuta = elementos.tipoEntrega.value === "ruta";

    alternarCampo("campo-ruta-entrega", elementos.rutaEntrega, esRuta);
    alternarCampo("campo-region", elementos.regionCliente, !esRuta);
    alternarCampo("campo-comuna", elementos.comunaCliente, !esRuta);
    alternarCampo("campo-empresa-envio", elementos.empresaEnvio, !esRuta);

    elementos.rutaEntrega.required = esRuta;
    elementos.regionCliente.required = !esRuta;
    elementos.comunaCliente.required = !esRuta;
    actualizarPagoSegunEntrega(elementos.pagoConsulta, esRuta);

    if (esRuta) {
        elementos.regionCliente.value = "";
        elementos.comunaCliente.value = "";
        elementos.empresaEnvio.value = "Por coordinar";
    } else {
        elementos.rutaEntrega.value = "";
    }
}

function productosFiltrados() {
    const busqueda = elementos.buscador.value.toLowerCase().trim();

    return productos.filter((producto) => {
        const coincideCategoria =
            categoriaActiva === "todos" || producto.categoria === categoriaActiva;

        const contenido = `${producto.nombre} ${producto.descripcion} ${CATEGORIAS[producto.categoria] || ""}`
            .toLowerCase();

        return coincideCategoria && contenido.includes(busqueda);
    });
}

function obtenerPresentaciones(producto) {
    if (Array.isArray(producto?.presentaciones) && producto.presentaciones.length > 0) {
        return producto.presentaciones.map((presentacion, indice) => ({
            id: String(presentacion.id || `presentacion-${indice + 1}`),
            nombre: String(presentacion.nombre || "Presentación"),
            unidades: Number(presentacion.unidades) || 1,
            unidad: String(presentacion.unidad || "unidades"),
            precio: Number(presentacion.precio) || Number(producto.precio) || 0,
            detalle: String(presentacion.detalle || "").replace(/\s*=\s*/g, ": "),
            rollos: Number(presentacion.rollos) || null
        }));
    }

    return [{
        id: "base",
        nombre: "Presentación",
        unidades: 1,
        unidad: "unidad",
        precio: Number(producto?.precio) || 0,
        detalle: ""
    }];
}

function obtenerPresentacion(producto, presentacionId) {
    const presentaciones = obtenerPresentaciones(producto);
    return presentaciones.find((item) => item.id === presentacionId) || presentaciones[0];
}

function presentacionPrincipal(producto) {
    return obtenerPresentaciones(producto)[0];
}

function pluralPresentacion(nombre, cantidad) {
    if (cantidad === 1) return nombre;
    const normalizado = String(nombre || "presentación").toLowerCase();
    if (normalizado.includes("caja")) return "cajas";
    if (normalizado.includes("pack")) return "packs";
    if (normalizado.includes("rollo")) return "rollos";
    return "presentaciones";
}

function unidadesTotales(item) {
    return Number(item.presentacion?.unidades || 1) * Number(item.cantidad || 0);
}

function resumenPresentacion(presentacion) {
    return presentacion.detalle || `${presentacion.nombre}: ${presentacion.unidades} ${presentacion.unidad}`;
}

function resumenCantidadItem(item) {
    const cantidad = Number(item.cantidad) || 0;
    const unidades = unidadesTotales(item);
    return `${cantidad} ${pluralPresentacion(item.presentacion.nombre, cantidad)}: ${new Intl.NumberFormat("es-CL").format(unidades)} ${item.presentacion.unidad}`;
}

function renderizarCatalogo() {
    const filtrados = productosFiltrados();
    const visibles = filtrados.slice(0, cantidadProductosVisibles);

    elementos.listaProductos.innerHTML = visibles
        .map((producto) => crearTarjetaProducto(producto))
        .join("");
    activarFallbackImagenesProductos(elementos.listaProductos);

    elementos.sinResultados.hidden = filtrados.length !== 0;
    elementos.contadorProductos.textContent =
        filtrados.length === 1
            ? "1 Producto Encontrado"
            : `${filtrados.length} Productos Encontrados`;

    if (elementos.accionesCatalogo && elementos.verMasProductos && elementos.verMenosProductos) {
        const quedanProductos = visibles.length < filtrados.length;
        const sePuedeMostrarMenos = cantidadProductosVisibles > PRODUCTOS_POR_PAGINA && filtrados.length > 0;

        elementos.accionesCatalogo.hidden = !quedanProductos && !sePuedeMostrarMenos;
        elementos.verMasProductos.hidden = !quedanProductos;
        elementos.verMenosProductos.hidden = !sePuedeMostrarMenos;

        if (quedanProductos) {
            const restantes = filtrados.length - visibles.length;
            elementos.verMasProductos.textContent =
                restantes > PRODUCTOS_POR_PAGINA
                    ? "Ver Más Productos"
                    : `Ver ${restantes} Producto${restantes === 1 ? "" : "s"} Más`;
        }
    }

    actualizarBotonLimpiar();
}

function crearTarjetaProducto(producto) {
    const agotado = producto.estado === "agotado";
    const etiqueta = producto.etiqueta
        ? `<span class="producto-etiqueta">${escaparHTML(producto.etiqueta)}</span>`
        : "";
    const principal = presentacionPrincipal(producto);
    const datos = [
        producto.medida ? `📏 ${escaparHTML(producto.medida)}` : "",
        producto.micras ? `💪 MY${Number(producto.micras)}` : "",
        resumenPresentacion(principal)
    ].filter(Boolean).join(" · ");
    const urlImagen = obtenerUrlPublicaProducto(producto.imagen_path);
    const visual = urlImagen
        ? `<img
                class="producto-imagen"
                src="${escaparHTML(urlImagen)}"
                alt="${escaparHTML(producto.nombre)}"
                data-producto-imagen
                data-emoji="${escaparHTML(producto.emoji)}"
                loading="lazy"
                decoding="async"
           >`
        : `<span class="producto-emoji" aria-hidden="true">${escaparHTML(producto.emoji)}</span>`;

    return `
        <article class="producto revelar visible" data-id="${escaparHTML(producto.id)}">
            <div class="producto-visual" style="--fondo-producto: ${fondoProducto(producto)}">
                ${etiqueta}
                <span class="estado-producto ${escaparHTML(producto.estado)}">${ESTADOS[producto.estado] || "Disponible"}</span>
                ${visual}
            </div>

            <div class="producto-informacion">
                <span class="producto-categoria">${CATEGORIAS[producto.categoria] || "Producto"}</span>
                <h3>${escaparHTML(producto.nombre)}</h3>
                <p>${escaparHTML(producto.descripcion)}</p>
                <p class="producto-presentacion-clara"><strong>${datos}</strong></p>

                <div class="producto-acciones">
                    <div class="producto-precio">
                        <span>${obtenerPresentaciones(producto).length > 1 ? "Desde" : "Precio"}</span>
                        <strong>${formatearPrecio(principal.precio)}</strong>
                    </div>

                    <button class="boton-detalle" type="button" data-accion="detalle" data-id="${escaparHTML(producto.id)}">
                        Ver presentaciones
                    </button>

                    <button class="boton-agregar" type="button" data-accion="agregar" data-id="${escaparHTML(producto.id)}" ${agotado ? "disabled" : ""}>
                        ${agotado ? "Agotado" : "Agregar mínimo"}
                    </button>
                </div>
            </div>
        </article>
    `;
}

function actualizarBotonLimpiar() {
    elementos.limpiarBusqueda.style.visibility = elementos.buscador.value ? "visible" : "hidden";
}

function renderizarSelectorProductos() {
    const valorActual = elementos.productoConsulta.value;
    const listaFiltrada = productosFiltrados();

    elementos.productoConsulta.innerHTML = `
        <option value="">Selecciona Un Producto</option>
        ${listaFiltrada
            .map(
                (producto) =>
                    `<option value="${escaparHTML(producto.nombre)}">${escaparHTML(producto.nombre)}</option>`
            )
            .join("")}
    `;

    if ([...elementos.productoConsulta.options].some((opcion) => opcion.value === valorActual)) {
        elementos.productoConsulta.value = valorActual;
    } else {
        elementos.productoConsulta.value = "";
    }
}

function actualizarDetallePresentacionModal() {
    const producto = productos.find((item) => item.id === productoModalId);
    if (!producto) return;

    const presentacion = obtenerPresentacion(producto, presentacionModalId);
    presentacionModalId = presentacion.id;
    cantidadModal = Math.max(1, Math.min(99, Number(cantidadModal) || 1));

    const nombreCantidad = pluralPresentacion(presentacion.nombre, cantidadModal);
    const unidades = Number(presentacion.unidades || 1) * cantidadModal;
    const total = Number(presentacion.precio || 0) * cantidadModal;
    const unidadTexto = presentacion.unidad || "unidades";

    elementos.modalProductoPrecio.textContent = formatearPrecio(total);
    elementos.modalPresentacionResumen.innerHTML = `
        <strong>${escaparHTML(resumenPresentacion(presentacion))}</strong>
        <span>Precio por ${escaparHTML(presentacion.nombre.toLowerCase())}: ${formatearPrecio(presentacion.precio)}</span>
    `;

    elementos.modalCantidadLabel.textContent = `Cantidad de ${nombreCantidad}`;
    elementos.modalCantidadAyuda.textContent = `Cada ${presentacion.nombre.toLowerCase()} contiene ${new Intl.NumberFormat("es-CL").format(presentacion.unidades)} ${unidadTexto}.`;
    elementos.modalCantidadValor.textContent = cantidadModal;
    elementos.modalCantidadRestar.disabled = cantidadModal <= 1;
    elementos.modalCantidadTotal.innerHTML = `
        <strong>${cantidadModal} ${escaparHTML(nombreCantidad)} = ${new Intl.NumberFormat("es-CL").format(unidades)} ${escaparHTML(unidadTexto)}</strong>
        <span>Total: ${formatearPrecio(total)}</span>
    `;

    if (!elementos.modalAgregarCarrito.disabled) {
        elementos.modalAgregarCarrito.textContent = `Agregar ${cantidadModal} ${nombreCantidad} a la cotización`;
    }

    elementos.modalPresentacion.querySelectorAll("[data-presentacion]").forEach((boton) => {
        const activo = boton.dataset.presentacion === presentacion.id;
        boton.classList.toggle("activo", activo);
        boton.setAttribute("aria-checked", activo ? "true" : "false");
    });
}

function abrirDetalleProducto(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    productoModalId = id;
    elementos.modalProductoVisual.style.setProperty("--fondo-producto", fondoProducto(producto));
    elementos.modalProductoVisual.replaceChildren();

    const urlImagen = obtenerUrlPublicaProducto(producto.imagen_path);
    if (urlImagen) {
        const imagen = document.createElement("img");
        imagen.className = "modal-producto-imagen";
        imagen.src = urlImagen;
        imagen.alt = producto.nombre;
        imagen.addEventListener("error", () => {
            elementos.modalProductoVisual.textContent = producto.emoji;
        }, { once: true });
        elementos.modalProductoVisual.append(imagen);
    } else {
        elementos.modalProductoVisual.textContent = producto.emoji;
    }
    elementos.modalProductoCategoria.textContent = CATEGORIAS[producto.categoria] || "Producto";
    elementos.modalProductoTitulo.textContent = producto.nombre;
    elementos.modalProductoDescripcion.textContent = producto.descripcion;
    elementos.modalProductoDatos.textContent = [
        producto.medida ? `Medida: ${producto.medida}` : "",
        producto.micras ? `Micras: MY${Number(producto.micras)}` : ""
    ].filter(Boolean).join(" · ");

    const presentaciones = obtenerPresentaciones(producto);
    presentacionModalId = presentaciones[0].id;
    cantidadModal = 1;
    elementos.modalPresentacion.innerHTML = presentaciones.map((presentacion, indice) => `
        <button
            type="button"
            class="presentacion-opcion${indice === 0 ? " activo" : ""}"
            data-presentacion="${escaparHTML(presentacion.id)}"
            role="radio"
            aria-checked="${indice === 0 ? "true" : "false"}"
        >
            <span class="presentacion-opcion-cabecera">
                <strong>${escaparHTML(presentacion.nombre)}</strong>
                <b>${formatearPrecio(presentacion.precio)}</b>
            </span>
            <span class="presentacion-opcion-detalle">${escaparHTML(resumenPresentacion(presentacion))}</span>
        </button>
    `).join("");
    actualizarDetallePresentacionModal();

    elementos.modalAgregarCarrito.disabled = producto.estado === "agotado";
    elementos.modalAgregarCarrito.textContent =
        producto.estado === "agotado" ? "Producto agotado" : "Agregar esta presentación";

    abrirModal(elementos.modalProducto);
}

function abrirModal(modal) {
    modal.classList.add("activo");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("bloqueado");
}

function cerrarModal(modal) {
    modal.classList.remove("activo");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.activo, .carrito.activo")) {
        document.body.classList.remove("bloqueado");
    }
}

function crearClaveCarrito(id, presentacionId) {
    return `${id}::${presentacionId}`;
}

function agregarAlCarrito(id, presentacionId = null, cantidad = 1) {
    const producto = productos.find((item) => item.id === id);
    if (!producto || producto.estado === "agotado") return;

    const presentacion = obtenerPresentacion(producto, presentacionId || presentacionPrincipal(producto).id);
    const cantidadAgregar = Math.max(1, Math.min(99, Number(cantidad) || 1));
    const clave = crearClaveCarrito(id, presentacion.id);
    const item = carrito.find((productoCarrito) => crearClaveCarrito(productoCarrito.id, productoCarrito.presentacionId || "base") === clave);

    if (item) {
        item.cantidad += cantidadAgregar;
    } else {
        carrito.push({ id, presentacionId: presentacion.id, cantidad: cantidadAgregar });
    }

    guardarCarrito();
    renderizarCarrito();
    const nombreCantidad = pluralPresentacion(presentacion.nombre, cantidadAgregar);
    mostrarToast(`${producto.nombre}: ${cantidadAgregar} ${nombreCantidad} agregado${cantidadAgregar === 1 ? "" : "s"}`);
}

function cambiarCantidad(clave, cambio) {
    const item = carrito.find((productoCarrito) => crearClaveCarrito(productoCarrito.id, productoCarrito.presentacionId || "base") === clave);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter((productoCarrito) => crearClaveCarrito(productoCarrito.id, productoCarrito.presentacionId || "base") !== clave);
    }

    guardarCarrito();
    renderizarCarrito();
}

function eliminarDelCarrito(clave) {
    carrito = carrito.filter((item) => crearClaveCarrito(item.id, item.presentacionId || "base") !== clave);
    guardarCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    mostrarToast("Cotización vaciada");
}

function obtenerDetalleCarrito() {
    return carrito
        .map((item) => {
            const producto = productos.find((productoActual) => productoActual.id === item.id);
            if (!producto) return null;
            const presentacion = obtenerPresentacion(producto, item.presentacionId || "base");
            return {
                ...producto,
                cantidad: item.cantidad,
                presentacion,
                claveCarrito: crearClaveCarrito(producto.id, presentacion.id)
            };
        })
        .filter(Boolean);
}

function calcularTotal() {
    return obtenerDetalleCarrito().reduce(
        (total, item) => total + Number(item.presentacion.precio) * item.cantidad,
        0
    );
}

function renderizarCarrito() {
    const detalle = obtenerDetalleCarrito();
    const cantidadTotal = detalle.reduce((total, item) => total + item.cantidad, 0);

    elementos.contadorCarrito.textContent = cantidadTotal;
    elementos.carritoVacio.hidden = detalle.length !== 0;
    elementos.carritoLista.hidden = detalle.length === 0;

    elementos.carritoLista.innerHTML = detalle
        .map(
            (item) => `
                <article class="carrito-item">
                    <div class="carrito-item-visual" style="--fondo-producto: ${fondoProducto(item)}">
                        ${escaparHTML(item.emoji)}
                    </div>

                    <div class="carrito-item-info">
                        <h3>${escaparHTML(item.nombre)}</h3>
                        <span><strong>${escaparHTML(item.presentacion.nombre)}</strong> · ${escaparHTML(resumenPresentacion(item.presentacion))}</span>
                        <span>${formatearPrecio(item.presentacion.precio)} por ${escaparHTML(item.presentacion.nombre.toLowerCase())}</span>
                        <small>${escaparHTML(resumenCantidadItem(item))}</small>

                        <div class="control-cantidad">
                            <button type="button" data-carrito="restar" data-key="${escaparHTML(item.claveCarrito)}" aria-label="Restar una presentación">−</button>
                            <strong>${item.cantidad}</strong>
                            <button type="button" data-carrito="sumar" data-key="${escaparHTML(item.claveCarrito)}" aria-label="Agregar una presentación">+</button>
                        </div>
                    </div>

                    <button class="carrito-item-eliminar" type="button" data-carrito="eliminar" data-key="${escaparHTML(item.claveCarrito)}" aria-label="Eliminar producto">×</button>
                </article>
            `
        )
        .join("");

    elementos.carritoTotal.textContent = formatearPrecio(calcularTotal());
    document.getElementById("enviar-pedido").disabled = detalle.length === 0;
    document.getElementById("vaciar-carrito").disabled = detalle.length === 0;
}

function abrirCarrito() {
    elementos.carrito.classList.add("activo");
    elementos.carrito.setAttribute("aria-hidden", "false");
    document.body.classList.add("bloqueado");
}

function cerrarCarrito() {
    elementos.carrito.classList.remove("activo");
    elementos.carrito.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.activo")) {
        document.body.classList.remove("bloqueado");
    }
}

function abrirFormularioPedido() {
    const detalle = obtenerDetalleCarrito();

    if (detalle.length === 0) {
        mostrarToast("Agrega productos antes de continuar");
        return;
    }

    if (!clienteSupabase) {
        mostrarToast("No hay conexión con la base de datos");
        return;
    }

    elementos.mensajePedido.textContent = "";
    renderizarResumenPedido();
    actualizarCamposPedido();
    cerrarCarrito();
    abrirModal(elementos.modalPedido);

    const contenidoPedido = elementos.modalPedido.querySelector(".modal-pedido-contenido");
    if (contenidoPedido) contenidoPedido.scrollTop = 0;

    setTimeout(() => {
        elementos.pedidoNombre.focus({ preventScroll: true });
        if (contenidoPedido) contenidoPedido.scrollTop = 0;
    }, 100);
}

function renderizarResumenPedido() {
    const detalle = obtenerDetalleCarrito();

    elementos.pedidoResumenMini.innerHTML = `
        <div class="pedido-resumen-cabecera">
            <strong>${detalle.length === 1 ? "1 producto" : `${detalle.length} productos`}</strong>
            <span>${formatearPrecio(calcularTotal())}</span>
        </div>
        <ul>
            ${detalle
                .map(
                    (item) => `
                        <li>
                            <span>
                                ${escaparHTML(item.nombre)}<br>
                                <small>${escaparHTML(resumenCantidadItem(item))}</small>
                            </span>
                            <strong>${formatearPrecio(item.presentacion.precio * item.cantidad)}</strong>
                        </li>
                    `
                )
                .join("")}
        </ul>
    `;
}

function actualizarCamposPedido() {
    const esRuta = elementos.pedidoTipoEntrega.value === "ruta";

    alternarCampo("pedido-campo-ruta", elementos.pedidoRuta, esRuta);
    alternarCampo("pedido-campo-region", elementos.pedidoRegion, !esRuta);
    alternarCampo("pedido-campo-comuna", elementos.pedidoComuna, !esRuta);
    alternarCampo("pedido-campo-empresa", elementos.pedidoEmpresa, !esRuta);

    elementos.pedidoRuta.required = esRuta;
    elementos.pedidoRegion.required = !esRuta;
    elementos.pedidoComuna.required = !esRuta;
    elementos.pedidoDireccion.required = true;
    actualizarPagoSegunEntrega(elementos.pedidoPago, esRuta);

    if (esRuta) {
        elementos.pedidoRegion.value = "";
        elementos.pedidoComuna.value = "";
        elementos.pedidoEmpresa.value = "Por coordinar";
    } else {
        elementos.pedidoRuta.value = "";
    }
}

function normalizarTelefonoChile(telefono) {
    let digitos = String(telefono || "").replace(/\D/g, "");

    if (digitos.startsWith("00")) digitos = digitos.slice(2);
    if (digitos.startsWith("0")) digitos = digitos.slice(1);
    if (digitos.length === 9) digitos = `56${digitos}`;

    return digitos;
}

async function guardarPedidoYWhatsApp(evento) {
    evento.preventDefault();

    const detalle = obtenerDetalleCarrito();
    const nombre = elementos.pedidoNombre.value.trim();
    const telefono = elementos.pedidoTelefono.value.trim();
    const telefonoNormalizado = normalizarTelefonoChile(telefono);
    const tipoEntrega = elementos.pedidoTipoEntrega.value;
    const esRuta = tipoEntrega === "ruta";
    const ruta = esRuta ? elementos.pedidoRuta.value : "";
    const region = esRuta ? "Valparaíso" : elementos.pedidoRegion.value;
    const comuna = esRuta ? ruta : elementos.pedidoComuna.value.trim();
    const direccion = elementos.pedidoDireccion.value.trim();
    const empresa = esRuta ? "Ruta Re Orgánico" : elementos.pedidoEmpresa.value;
    const formaPago = elementos.pedidoPago.value;
    const observaciones = elementos.pedidoObservaciones.value.trim();

    elementos.mensajePedido.textContent = "";
    elementos.mensajePedido.classList.remove("error", "exito");

    if (detalle.length === 0) {
        elementos.mensajePedido.textContent = "El carrito está vacío.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (nombre.length < 2 || telefonoNormalizado.length < 10) {
        elementos.mensajePedido.textContent = "Revisa tu nombre y número de teléfono.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (esRuta && !ruta) {
        elementos.mensajePedido.textContent = "Selecciona una localidad de nuestras rutas.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (!esRuta && (!region || !comuna)) {
        elementos.mensajePedido.textContent = "Selecciona tu región y escribe tu comuna.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (!direccion) {
        elementos.mensajePedido.textContent = "Escribe la dirección o sucursal de destino.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (!clienteSupabase) {
        elementos.mensajePedido.textContent = "No fue posible conectar con la base de datos.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    if (!window.turnstile) {
        elementos.mensajePedido.textContent = "La verificación de seguridad todavía está cargando. Espera unos segundos e inténtalo nuevamente.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    const tokenTurnstile = window.turnstile.getResponse();

    if (!tokenTurnstile) {
        elementos.mensajePedido.textContent = "Completa la verificación de seguridad antes de enviar la cotización.";
        elementos.mensajePedido.classList.add("error");
        return;
    }

    elementos.confirmarPedido.disabled = true;
    elementos.confirmarPedido.textContent = "Verificando seguridad...";

    const items = detalle.map((item) => ({
        producto_id: item.id,
        presentacion_id: item.presentacion.id,
        cantidad: item.cantidad
    }));

    const pedidoProtegido = {
        nombre,
        telefono: telefonoNormalizado,
        tipo_entrega: tipoEntrega,
        region: region || null,
        comuna: comuna || null,
        direccion: direccion || null,
        empresa_envio: empresa || null,
        forma_pago: formaPago,
        observaciones: observaciones || null,
        items
    };

    const { data: verificacionTurnstile, error: errorTurnstile } =
        await clienteSupabase.functions.invoke("verificar-turnstile", {
            body: {
                token: tokenTurnstile,
                pedido: pedidoProtegido
            }
        });

    if (errorTurnstile || !verificacionTurnstile?.success) {
        console.error("Turnstile rechazó la cotización:", errorTurnstile, verificacionTurnstile);
        elementos.confirmarPedido.disabled = false;
        elementos.confirmarPedido.textContent = "Guardar cotización y abrir WhatsApp";
        elementos.mensajePedido.textContent =
            verificacionTurnstile?.error ||
            "No pudimos completar la verificación de seguridad. Inténtalo nuevamente.";
        elementos.mensajePedido.classList.add("error");
        window.turnstile.reset();
        return;
    }

    elementos.confirmarPedido.disabled = false;
    elementos.confirmarPedido.textContent = "Guardar cotización y abrir WhatsApp";

    const pedidoGuardado = verificacionTurnstile.pedido;

    if (!pedidoGuardado?.codigo) {
        console.error("El servidor no devolvió el código de la cotización.");
        elementos.mensajePedido.textContent = "No se pudo guardar la cotización. Inténtalo nuevamente.";
        elementos.mensajePedido.classList.add("error");
        window.turnstile.reset();
        return;
    }

    const lineas = detalle.map(
        (item) =>
            `• ${item.nombre} | ${resumenCantidadItem(item)} | ${formatearPrecio(item.presentacion.precio * item.cantidad)}`
    );

    const mensaje = [
        `Hola, solicité una cotización en ${TIENDA.nombre}.`,
        `Código: ${pedidoGuardado.codigo}`,
        "",
        `Nombre: ${nombre}`,
        `Teléfono: +${telefonoNormalizado}`,
        `Entrega: ${esRuta ? "Ruta Re Orgánico" : "Despacho por transportista"}`,
        esRuta ? `Localidad: ${ruta}` : `Región: ${region}`,
        !esRuta ? `Comuna: ${comuna}` : "",
        `Dirección o sucursal: ${direccion}`,
        `Transporte: ${empresa}`,
        `Forma de pago preferida: ${formaPago === "efectivo" ? "Efectivo" : "Transferencia"}`,
        "",
        "Productos:",
        ...lineas,
        "",
        `Total referencial: ${formatearPrecio(pedidoGuardado.total_referencial)}`,
        observaciones ? `Observaciones: ${observaciones}` : "",
        "",
        "Quedo atento(a) a la confirmación de stock, valor del despacho y total final."
    ]
        .filter(Boolean)
        .join("\n");

    elementos.mensajePedido.textContent = `Cotización ${pedidoGuardado.codigo} guardada correctamente.`;
    elementos.mensajePedido.classList.add("exito");

    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    elementos.formularioPedido.reset();
    if (window.turnstile) window.turnstile.reset();
    actualizarCamposPedido();

    mostrarToast(`Cotización ${pedidoGuardado.codigo} guardada`);

    setTimeout(() => {
        window.location.href = construirEnlaceWhatsApp(mensaje);
    }, 350);
}

function enviarConsulta(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre-cliente").value.trim();
    const producto = elementos.productoConsulta.value;
    const tipoEntrega = elementos.tipoEntrega.value;
    const esRuta = tipoEntrega === "ruta";
    const ruta = esRuta ? elementos.rutaEntrega.value : "";
    const region = esRuta ? "Valparaíso" : elementos.regionCliente.value;
    const comuna = esRuta ? ruta : elementos.comunaCliente.value.trim();
    const empresa = esRuta ? "Ruta Re Orgánico" : elementos.empresaEnvio.value;
    const formaPago = elementos.pagoConsulta.value;
    const adicional = document.getElementById("mensaje-consulta").value.trim();

    if (!nombre || !producto) {
        mostrarToast("Completa tu nombre y selecciona un producto");
        return;
    }

    if (esRuta && !ruta) {
        mostrarToast("Selecciona una localidad de nuestras rutas");
        return;
    }

    if (!esRuta && (!region || !comuna)) {
        mostrarToast("Selecciona tu región y escribe tu comuna");
        return;
    }

    const mensaje = [
        `Hola, quiero realizar una consulta en ${TIENDA.nombre}.`,
        "",
        `Nombre: ${nombre}`,
        `Producto: ${producto}`,
        `Forma de entrega: ${esRuta ? "Ruta Re Orgánico" : "Despacho por transportista"}`,
        esRuta ? `Localidad: ${ruta}` : `Región: ${region}`,
        !esRuta ? `Comuna: ${comuna}` : "",
        `Transporte: ${empresa}`,
        `Forma de pago preferida: ${formaPago === "efectivo" ? "Efectivo" : "Transferencia"}`,
        adicional ? `Mensaje adicional: ${adicional}` : "",
        "",
        "Quedo atento(a) a la confirmación de stock, valor del despacho y total final."
    ]
        .filter(Boolean)
        .join("\n");

    window.open(construirEnlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
}

function inicializarEventos() {
    elementos.botonMenu.addEventListener("click", () => {
        const activo = elementos.menu.classList.toggle("activo");
        elementos.botonMenu.setAttribute("aria-expanded", String(activo));
    });

    elementos.menu.addEventListener("click", (evento) => {
        if (evento.target.matches("a")) {
            elementos.menu.classList.remove("activo");
            elementos.botonMenu.setAttribute("aria-expanded", "false");
        }
    });

    elementos.buscador.addEventListener("input", () => {
        cantidadProductosVisibles = PRODUCTOS_POR_PAGINA;
        renderizarCatalogo();
        renderizarSelectorProductos();
    });

    elementos.limpiarBusqueda.addEventListener("click", () => {
        elementos.buscador.value = "";
        elementos.buscador.focus();
        cantidadProductosVisibles = PRODUCTOS_POR_PAGINA;
        renderizarCatalogo();
        renderizarSelectorProductos();
    });

    elementos.filtros.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-categoria]");
        if (!boton) return;

        categoriaActiva = boton.dataset.categoria;
        cantidadProductosVisibles = PRODUCTOS_POR_PAGINA;
        elementos.filtros.querySelectorAll(".filtro").forEach((filtro) => {
            filtro.classList.toggle("activo", filtro === boton);
        });
        renderizarCatalogo();
        renderizarSelectorProductos();
    });

    if (elementos.verMasProductos) {
        elementos.verMasProductos.addEventListener("click", () => {
            cantidadProductosVisibles += PRODUCTOS_POR_PAGINA;
            renderizarCatalogo();
        });
    }

    if (elementos.verMenosProductos) {
        elementos.verMenosProductos.addEventListener("click", () => {
            cantidadProductosVisibles = Math.max(
                PRODUCTOS_POR_PAGINA,
                cantidadProductosVisibles - PRODUCTOS_POR_PAGINA
            );
            renderizarCatalogo();

            const seccionProductos = document.getElementById("productos");
            if (seccionProductos) {
                seccionProductos.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    elementos.listaProductos.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        if (boton.dataset.accion === "detalle") abrirDetalleProducto(boton.dataset.id);
        if (boton.dataset.accion === "agregar") agregarAlCarrito(boton.dataset.id);
    });

    document.getElementById("abrir-carrito").addEventListener("click", abrirCarrito);
    const botonHeroCarrito = document.getElementById("hero-abrir-carrito");
    if (botonHeroCarrito) {
        botonHeroCarrito.addEventListener("click", abrirCarrito);
    }
    document.getElementById("cerrar-carrito").addEventListener("click", cerrarCarrito);
    document.getElementById("cerrar-carrito-fondo").addEventListener("click", cerrarCarrito);
    document.getElementById("enviar-pedido").addEventListener("click", abrirFormularioPedido);
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);

    elementos.carritoLista.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-carrito]");
        if (!boton) return;

        const { carrito: accion, key } = boton.dataset;
        if (accion === "sumar") cambiarCantidad(key, 1);
        if (accion === "restar") cambiarCantidad(key, -1);
        if (accion === "eliminar") eliminarDelCarrito(key);
    });

    elementos.modalAgregarCarrito.addEventListener("click", () => {
        if (productoModalId) agregarAlCarrito(productoModalId, presentacionModalId, cantidadModal);
    });

    elementos.modalCantidadRestar.addEventListener("click", () => {
        cantidadModal = Math.max(1, cantidadModal - 1);
        actualizarDetallePresentacionModal();
    });

    elementos.modalCantidadSumar.addEventListener("click", () => {
        cantidadModal = Math.min(99, cantidadModal + 1);
        actualizarDetallePresentacionModal();
    });

    elementos.modalPresentacion.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-presentacion]");
        if (!boton) return;
        presentacionModalId = boton.dataset.presentacion;
        cantidadModal = 1;
        actualizarDetallePresentacionModal();
    });


    const filtrosGaleria = document.getElementById("galeria-filtros");
    if (filtrosGaleria) {
        filtrosGaleria.addEventListener("click", (evento) => {
            const boton = evento.target.closest("[data-galeria]");
            if (!boton) return;

            const tipo = boton.dataset.galeria;
            filtrosGaleria.querySelectorAll("[data-galeria]").forEach((item) => {
                item.classList.toggle("activo", item === boton);
            });

            document.querySelectorAll("#galeria-trabajo [data-media]").forEach((item) => {
                const mostrar = tipo === "todos" || item.dataset.media === tipo;
                item.classList.toggle("oculto", !mostrar);
            });
        });
    }

    document.querySelectorAll('[data-cerrar-modal="producto"]').forEach((boton) => {
        boton.addEventListener("click", () => cerrarModal(elementos.modalProducto));
    });

    document.querySelectorAll('[data-cerrar-modal="pedido"]').forEach((boton) => {
        boton.addEventListener("click", () => cerrarModal(elementos.modalPedido));
    });

    elementos.pedidoTipoEntrega.addEventListener("change", actualizarCamposPedido);
    elementos.formularioPedido.addEventListener("submit", guardarPedidoYWhatsApp);
    elementos.tipoEntrega.addEventListener("change", actualizarCamposEntrega);
    elementos.formularioConsulta.addEventListener("submit", enviarConsulta);

    document.querySelectorAll(".pregunta-boton").forEach((boton) => {
        boton.addEventListener("click", () => {
            const pregunta = boton.closest(".pregunta");
            const yaActiva = pregunta.classList.contains("activa");

            document.querySelectorAll(".pregunta").forEach((item) => {
                item.classList.remove("activa");
                item.querySelector(".pregunta-boton").setAttribute("aria-expanded", "false");
            });

            if (!yaActiva) {
                pregunta.classList.add("activa");
                boton.setAttribute("aria-expanded", "true");
            }
        });
    });

    elementos.volverArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", actualizarNavegacion, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && clienteSupabase) {
            cargarProductosDesdeSupabase();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") return;
        cerrarModal(elementos.modalProducto);
        cerrarModal(elementos.modalPedido);
        cerrarCarrito();
    });
}

function inicializarAnimaciones() {
    const elementosAnimados = document.querySelectorAll(".revelar");

    if (!("IntersectionObserver" in window)) {
        elementosAnimados.forEach((elemento) => elemento.classList.add("visible"));
        return;
    }

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    elementosAnimados.forEach((elemento) => observador.observe(elemento));
}

function actualizarNavegacion() {
    elementos.encabezado.classList.toggle("con-scroll", window.scrollY > 35);
    elementos.volverArriba.classList.toggle("visible", window.scrollY > 500);

    const enlaces = [...document.querySelectorAll('.menu a[href^="#"]')];
    const posicion = window.scrollY + 180;
    let enlaceActivo = null;

    enlaces.forEach((enlace) => {
        const seccion = document.querySelector(enlace.getAttribute("href"));
        if (!seccion) return;

        const inicio = seccion.offsetTop;
        const final = inicio + seccion.offsetHeight;

        if (posicion >= inicio && posicion < final) enlaceActivo = enlace;
    });

    enlaces.forEach((enlace) => enlace.classList.toggle("enlace-activo", enlace === enlaceActivo));
}
