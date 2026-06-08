const menuItems = [
    // Breakfast (4 items)
    {
        id: 1,
        name: "Royal Eggs Benedict",
        category: "breakfast",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80",
        description: "Poached free-range eggs on toasted artisanal brioche with smoked Iberico ham and gold-dusted hollandaise sauce."
    },
    {
        id: 2,
        name: "Truffle Avocado Toast",
        category: "breakfast",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
        description: "Crushed organic avocado, black truffle shavings, heirloom tomatoes, and microgreens on toasted sourdough bread."
    },
    {
        id: 3,
        name: "Golden Waffles with Berries",
        category: "breakfast",
        price: 14.50,
        image: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=600&q=80",
        description: "Crispy Belgian waffles served with fresh organic berries, edible gold leaf, and high-grade maple syrup."
    },
    {
        id: 4,
        name: "Caviar Smoked Salmon Bagel",
        category: "breakfast",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        description: "Toasted everything bagel with Norwegian smoked salmon, whipped chive cream cheese, capers, and premium wild caviar."
    },

    // Lunch (4 items)
    {
        id: 5,
        name: "Saffron Lobster Bisque",
        category: "lunch",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
        description: "A rich, velvety soup made from roasted lobster shells, finished with Persian saffron threads and cognac cream."
    },
    {
        id: 6,
        name: "Taste Haven Wagyu Burger",
        category: "lunch",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        description: "Aged A5 Wagyu beef patty, melted gruyère cheese, caramelized gold onions, and truffle aioli on a brioche bun."
    },
    {
        id: 7,
        name: "Truffle Burrata Salad",
        category: "lunch",
        price: 19.50,
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        description: "Creamy Italian burrata, heirloom cherry tomatoes, wild arugula, pine nuts, and balsamic glaze infused with white truffle."
    },
    {
        id: 8,
        name: "Grilled Mediterranean Sea Bass",
        category: "lunch",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
        description: "Fillet of sea bass grilled with extra virgin olive oil, fresh lemon juice, capers, and a side of sautéed asparagus."
    },

    // Dinner (5 items)
    {
        id: 9,
        name: "Prime Gold-Leaf Ribeye Steak",
        category: "dinner",
        price: 58.00,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        description: "45-day dry-aged prime ribeye steak, seared with herb butter, wrapped in 24k edible gold leaf, served with red wine reduction."
    },
    {
        id: 10,
        name: "Pan-Seared Duck Breast",
        category: "dinner",
        price: 42.00,
        image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80",
        description: "Tender, crispy-skinned duck breast served over sweet potato purée with a tart wild cherry and balsamic reduction."
    },
    {
        id: 11,
        name: "Herb-Crusted Rack of Lamb",
        category: "dinner",
        price: 46.00,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
        description: "New Zealand lamb crusted with fresh rosemary, thyme, Dijon mustard, and sourdough breadcrumbs, served with roasted baby potatoes."
    },
    {
        id: 12,
        name: "Squid Ink Seafood Pasta",
        category: "dinner",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        description: "Handcrafted black squid ink tagliolini tossed with jumbo sea scallops, prawns, mussels, and a light garlic white wine sauce."
    },
    {
        id: 13,
        name: "Wild Mushroom Risotto",
        category: "dinner",
        price: 34.00,
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80",
        description: "Creamy Arborio rice slowly simmered with porcini and chanterelle mushrooms, parmigiano-reggiano, and white truffle oil."
    },

    // Drinks (4 items)
    {
        id: 14,
        name: "Golden Carajillo Cocktail",
        category: "drinks",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
        description: "Premium espresso shaken with Licor 43, orange zest, and garnished with a gold-dusted coffee bean."
    },
    {
        id: 15,
        name: "Smoked Rosemary Old Fashioned",
        category: "drinks",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
        description: "Aged bourbon whiskey, angostura bitters, orange peel, served in a glass smoked with charred fresh rosemary."
    },
    {
        id: 16,
        name: "Sparkling Elderflower Mimosa",
        category: "drinks",
        price: 14.00,
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
        description: "French champagne, elderflower liqueur, fresh organic grapefruit juice, and edible floral garnishes."
    },
    {
        id: 17,
        name: "Taste Haven Premium Espresso",
        category: "drinks",
        price: 6.50,
        image: "https://images.unsplash.com/photo-1510972527409-cef1e7f22495?auto=format&fit=crop&w=600&q=80",
        description: "Single-origin Arabica espresso shot, pulled with dense golden crema, served with an artisanal dark chocolate piece."
    },

    // Desserts (4 items)
    {
        id: 18,
        name: "Gold Dust Chocolate Soufflé",
        category: "desserts",
        price: 16.50,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
        description: "Warm dark Belgian chocolate soufflé with a liquid chocolate center, topped with a dusting of 24k edible gold dust."
    },
    {
        id: 19,
        name: "Classic Pistachio Crème Brûlée",
        category: "desserts",
        price: 14.00,
        image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=600&q=80",
        description: "Rich pistachio-infused egg custard baked with a brittle caramelized sugar crust, served with fresh raspberries."
    },
    {
        id: 20,
        name: "Deconstructed Tiramisu",
        category: "desserts",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
        description: "Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dark cocoa powder, and Kahlúa jelly droplets."
    },
    {
        id: 21,
        name: "Golden Honey Saffron Gelato",
        category: "desserts",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
        description: "House-churned saffron milk gelato swirled with local organic raw honey and topped with roasted pistachios."
    }
];
