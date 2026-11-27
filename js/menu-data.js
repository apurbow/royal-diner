const MENU_CATEGORIES = [
    "All",
    "Royal Selection",
    "Rice & Omurice",
    "Steak & Hamburg",
    "Pasta & Oven-Baked",
    "Curry & Stews",
    "Chicken & Seafood",
    "Sides & Salads",
    "Bread & Bakery",
    "Desserts",
    "Drinks"
];

const MENU_ITEMS = [
    {
        id: "royal-mixed-plate",
        name: "Royal Mixed Plate",
        category: "Steak & Hamburg",
        description: "A hearty diner plate with hamburg steak, fried shrimp, a fried egg, and sides.",
        details: "Hamburg steak, crispy fried shrimp, fried egg, vegetables, and a savoury demi-glace sauce.",
        price: 1680,
        image: "img/menu/royal-mixed-plate.jpg",
        royalSelection: true
    },
    {
        id: "royal-demi-glace-omurice",
        name: "Royal Demi-Glace Omurice",
        category: "Rice & Omurice",
        description: "Chicken rice and a soft omelette topped with rich, slow-simmered demi-glace sauce.",
        details: "Seasoned chicken rice, a soft omelette, demi-glace sauce, and a parsley finish.",
        price: 1380,
        image: "img/menu/royal-demi-glace-omurice.jpg",
        royalSelection: true
    },
    {
        id: "slow-cooked-beef-stew",
        name: "Slow-Cooked Beef Stew",
        category: "Curry & Stews",
        description: "Tender beef and vegetables simmered in a deep, glossy brown sauce.",
        details: "Slow-braised beef, carrots, potatoes, onions, and a rich demi-glace-style stew sauce.",
        price: 1580,
        image: "img/menu/slow-cooked-beef-stew.jpg",
        royalSelection: true
    },
    {
        id: "garlic-butter-beef-steak",
        name: "Garlic Butter Beef Steak",
        category: "Steak & Hamburg",
        description: "Grilled beef finished with fragrant garlic butter and a savoury pan sauce.",
        details: "Grilled beef steak, garlic butter, pan sauce, and seasonal vegetables, served with rice.",
        price: 1780,
        image: "img/menu/garlic-butter-beef-steak.jpg",
        royalSelection: true
    },
    {
        id: "royal-seafood-plate",
        name: "Royal Seafood Plate",
        category: "Chicken & Seafood",
        description: "A seafood favourite with fried shrimp, golden fish, and house tartar sauce.",
        details: "Crispy fried shrimp, breaded white fish, shredded cabbage, lemon, and tartar sauce.",
        price: 1780,
        image: "img/menu/royal-seafood-plate.jpg",
        royalSelection: true
    },
    {
        id: "classic-omurice",
        name: "Classic Omurice",
        category: "Rice & Omurice",
        description: "Seasoned chicken rice wrapped in a soft omelette with a light tomato sauce.",
        details: "Chicken rice, a soft omelette, tomato sauce, and a sprinkle of parsley.",
        price: 980,
        image: "img/menu/classic-omurice.jpg",
        royalSelection: false
    },
    {
        id: "cheese-omurice",
        name: "Cheese Omurice",
        category: "Rice & Omurice",
        description: "Soft omelette and chicken rice with melted cheese and tomato sauce.",
        details: "Chicken rice, a soft omelette, melted cheese, and mild tomato sauce.",
        price: 1180,
        image: "img/menu/cheese-omurice.jpg",
        royalSelection: false
    },
    {
        id: "hayashi-rice",
        name: "Hayashi Rice",
        category: "Rice & Omurice",
        description: "Sliced beef and onions in a mellow brown sauce, served over rice.",
        details: "Sliced beef, softened onions, demi-glace-style hayashi sauce, and steamed rice.",
        price: 1180,
        image: "img/menu/hayashi-rice.jpg",
        royalSelection: false
    },
    {
        id: "garlic-beef-rice",
        name: "Garlic Beef Rice",
        category: "Rice & Omurice",
        description: "Sliced beef and rice tossed with savoury garlic sauce.",
        details: "Steamed rice, sliced beef, sautéed onions, garlic soy sauce, and spring onion.",
        price: 1180,
        image: "img/menu/garlic-beef-rice.jpg",
        royalSelection: false
    },
    {
        id: "classic-hamburg-steak",
        name: "Classic Hamburg Steak",
        category: "Steak & Hamburg",
        description: "A juicy hamburg steak served with classic brown sauce.",
        details: "Grilled hamburg steak, brown demi-glace-style sauce, and seasonal vegetables.",
        price: 1080,
        image: "img/menu/classic-hamburg-steak.jpg",
        royalSelection: false
    },
    {
        id: "cheese-hamburg-steak",
        name: "Cheese Hamburg Steak",
        category: "Steak & Hamburg",
        description: "A tender hamburg steak topped with melted cheese and rich brown sauce.",
        details: "Grilled hamburg steak, melted cheese, brown sauce, and seasonal vegetables.",
        price: 1280,
        image: "img/menu/cheese-hamburg-steak.jpg",
        royalSelection: false
    },
    {
        id: "japanese-style-hamburg-steak",
        name: "Japanese-Style Hamburg Steak",
        category: "Steak & Hamburg",
        description: "A grilled hamburg steak topped with grated daikon and ponzu sauce.",
        details: "Grilled hamburg steak, grated daikon, ponzu sauce, and seasonal vegetables.",
        price: 1180,
        image: "img/menu/japanese-style-hamburg-steak.jpg",
        royalSelection: false
    },
    {
        id: "pepper-beef-steak",
        name: "Pepper Beef Steak",
        category: "Steak & Hamburg",
        description: "Grilled beef with cracked black pepper and a savoury steak sauce.",
        details: "Grilled beef, black pepper sauce, and seasonal vegetables, served with rice.",
        price: 1580,
        image: "img/menu/pepper-beef-steak.jpg",
        royalSelection: false
    },
    {
        id: "napolitan-pasta",
        name: "Napolitan Pasta",
        category: "Pasta & Oven-Baked",
        description: "Japanese-style spaghetti with tomato ketchup sauce, sausage, and vegetables.",
        details: "Spaghetti, sausage, onion, green pepper, and a gently sweet tomato sauce.",
        price: 980,
        image: "img/menu/napolitan-pasta.jpg",
        royalSelection: false
    },
    {
        id: "creamy-mushroom-pasta",
        name: "Creamy Mushroom Pasta",
        category: "Pasta & Oven-Baked",
        description: "Creamy pasta with sautéed mushrooms and a touch of black pepper.",
        details: "Spaghetti, mushrooms, cream sauce, black pepper, and grated cheese.",
        price: 1180,
        image: "img/menu/creamy-mushroom-pasta.jpg",
        royalSelection: false
    },
    {
        id: "shrimp-tomato-cream-pasta",
        name: "Shrimp Tomato Cream Pasta",
        category: "Pasta & Oven-Baked",
        description: "Shrimp and pasta coated in a smooth tomato cream sauce.",
        details: "Spaghetti, shrimp, tomato cream sauce, garlic, and parsley.",
        price: 1380,
        image: "img/menu/shrimp-tomato-cream-pasta.jpg",
        royalSelection: false
    },
    {
        id: "classic-carbonara",
        name: "Classic Carbonara",
        category: "Pasta & Oven-Baked",
        description: "Creamy pasta with bacon, egg, cheese, and black pepper.",
        details: "Spaghetti, bacon, egg, grated cheese, and freshly cracked black pepper.",
        price: 1180,
        image: "img/menu/classic-carbonara.jpg",
        royalSelection: false
    },
    {
        id: "beef-lasagna",
        name: "Beef Lasagna",
        category: "Pasta & Oven-Baked",
        description: "Layers of pasta, savoury beef sauce, and golden baked cheese.",
        details: "Pasta sheets, beef tomato sauce, white sauce, and melted cheese, baked until golden.",
        price: 1380,
        image: "img/menu/beef-lasagna.jpg",
        royalSelection: false
    },
    {
        id: "chicken-doria",
        name: "Chicken Doria",
        category: "Pasta & Oven-Baked",
        description: "Chicken and rice baked under creamy white sauce and golden cheese.",
        details: "Seasoned rice, chicken, creamy white sauce, and melted cheese baked in the oven.",
        price: 1180,
        image: "img/menu/chicken-doria.jpg",
        royalSelection: false
    },
    {
        id: "seafood-doria",
        name: "Seafood Doria",
        category: "Pasta & Oven-Baked",
        description: "Seafood and rice baked in a creamy sauce with a golden cheese topping.",
        details: "Rice, shrimp, mixed seafood, creamy white sauce, and baked cheese.",
        price: 1380,
        image: "img/menu/seafood-doria.jpg",
        royalSelection: false
    },
    {
        id: "japanese-beef-curry",
        name: "Japanese Beef Curry",
        category: "Curry & Stews",
        description: "Mild Japanese curry with tender beef and steamed rice.",
        details: "Japanese-style curry sauce, tender beef, onions, and steamed rice.",
        price: 1080,
        image: "img/menu/japanese-beef-curry.jpg",
        royalSelection: false
    },
    {
        id: "chicken-katsu-curry",
        name: "Chicken Katsu Curry",
        category: "Curry & Stews",
        description: "Crispy chicken cutlet served with Japanese curry and rice.",
        details: "Breaded chicken cutlet, Japanese curry sauce, and steamed rice.",
        price: 1280,
        image: "img/menu/chicken-katsu-curry.jpg",
        royalSelection: false
    },
    {
        id: "hamburg-curry",
        name: "Hamburg Curry",
        category: "Curry & Stews",
        description: "A grilled hamburg steak served with rich Japanese curry and rice.",
        details: "Grilled hamburg steak, Japanese curry sauce, and steamed rice.",
        price: 1380,
        image: "img/menu/hamburg-curry.jpg",
        royalSelection: false
    },
    {
        id: "chicken-nanban",
        name: "Chicken Nanban",
        category: "Chicken & Seafood",
        description: "Crispy chicken coated in sweet-sour sauce with creamy tartar sauce.",
        details: "Fried chicken, sweet-sour nanban sauce, tartar sauce, and shredded cabbage.",
        price: 1180,
        image: "img/menu/chicken-nanban.jpg",
        royalSelection: false
    },
    {
        id: "herb-grilled-chicken",
        name: "Herb-Grilled Chicken",
        category: "Chicken & Seafood",
        description: "Grilled chicken seasoned with herbs, garlic, and black pepper.",
        details: "Grilled chicken, herbs, garlic, black pepper, and seasonal vegetables.",
        price: 1180,
        image: "img/menu/herb-grilled-chicken.jpg",
        royalSelection: false
    },
    {
        id: "fried-shrimp-plate",
        name: "Fried Shrimp Plate",
        category: "Chicken & Seafood",
        description: "Golden breaded shrimp with lemon and house tartar sauce.",
        details: "Breaded shrimp, shredded cabbage, lemon wedge, tartar sauce, and rice.",
        price: 1380,
        image: "img/menu/fried-shrimp-plate.jpg",
        royalSelection: false
    },
    {
        id: "salmon-meuniere",
        name: "Salmon Meunière",
        category: "Chicken & Seafood",
        description: "Pan-fried salmon finished with lemon butter sauce.",
        details: "Pan-fried salmon, lemon butter sauce, and seasonal vegetables, served with rice.",
        price: 1480,
        image: "img/menu/salmon-meuniere.jpg",
        royalSelection: false
    },
    {
        id: "house-salad",
        name: "House Salad",
        category: "Sides & Salads",
        description: "A fresh side salad with crisp vegetables and house dressing.",
        details: "Leafy greens, tomato, cucumber, and house dressing.",
        price: 480,
        image: "img/menu/house-salad.jpg",
        royalSelection: false
    },
    {
        id: "caesar-salad",
        name: "Caesar Salad",
        category: "Sides & Salads",
        description: "Crisp greens with Caesar dressing, croutons, and grated cheese.",
        details: "Leafy greens, Caesar dressing, croutons, and grated cheese.",
        price: 580,
        image: "img/menu/caesar-salad.jpg",
        royalSelection: false
    },
    {
        id: "french-fries",
        name: "French Fries",
        category: "Sides & Salads",
        description: "Golden fries served hot with a light sprinkle of salt.",
        details: "Crispy potato fries with salt; ketchup is served on the side.",
        price: 380,
        image: "img/menu/french-fries.jpg",
        royalSelection: false
    },
    {
        id: "onion-rings",
        name: "Onion Rings",
        category: "Sides & Salads",
        description: "Sweet onion rings in a crisp, golden coating.",
        details: "Onion rings in a light seasoned batter, fried until golden.",
        price: 450,
        image: "img/menu/onion-rings.jpg",
        royalSelection: false
    },
    {
        id: "corn-potage",
        name: "Corn Potage",
        category: "Sides & Salads",
        description: "A smooth, gently sweet corn soup served warm.",
        details: "Creamy corn soup with a soft texture and a light black-pepper finish.",
        price: 380,
        image: "img/menu/corn-potage.jpg",
        royalSelection: false
    },
    {
        id: "garlic-toast",
        name: "Garlic Toast",
        category: "Bread & Bakery",
        description: "Toasted bread spread with garlic butter and herbs.",
        details: "Sliced bread, garlic butter, and herbs toasted until crisp at the edges.",
        price: 350,
        image: "img/menu/garlic-toast.jpg",
        royalSelection: false
    },
    {
        id: "dinner-rolls",
        name: "Dinner Rolls",
        category: "Bread & Bakery",
        description: "Soft, lightly browned rolls served warm.",
        details: "A serving of soft bread rolls, warmed before serving.",
        price: 300,
        image: "img/menu/dinner-rolls.jpg",
        royalSelection: false
    },
    {
        id: "classic-butter-toast",
        name: "Classic Butter Toast",
        category: "Bread & Bakery",
        description: "Thick-cut toast served with butter.",
        details: "Thick-cut bread toasted until golden and served with butter.",
        price: 300,
        image: "img/menu/classic-butter-toast.jpg",
        royalSelection: false
    },
    {
        id: "garlic-bread",
        name: "Garlic Bread",
        category: "Bread & Bakery",
        description: "Toasted bread with garlic butter and a savoury finish.",
        details: "Bread, garlic butter, and herbs toasted until golden.",
        price: 350,
        image: "img/menu/garlic-bread.jpg",
        royalSelection: false
    },
    {
        id: "cheese-garlic-toast",
        name: "Cheese Garlic Toast",
        category: "Bread & Bakery",
        description: "Garlic toast topped with melted cheese.",
        details: "Toasted bread, garlic butter, herbs, and melted cheese.",
        price: 450,
        image: "img/menu/cheese-garlic-toast.jpg",
        royalSelection: false
    },
    {
        id: "royal-custard-pudding",
        name: "Royal Custard Pudding",
        category: "Desserts",
        description: "Silky custard pudding topped with rich caramel sauce.",
        details: "Classic egg custard with a smooth texture and glossy caramel sauce.",
        price: 480,
        image: "img/menu/royal-custard-pudding.jpg",
        royalSelection: false
    },
    {
        id: "chocolate-lava-cake",
        name: "Chocolate Lava Cake",
        category: "Desserts",
        description: "Rich chocolate cake for a simple, satisfying finish.",
        details: "A slice of chocolate cake served on its own.",
        price: 580,
        image: "img/menu/chocolate-lava-cake.jpg",
        royalSelection: false
    },
    {
        id: "new-york-cheesecake",
        name: "New York Cheesecake",
        category: "Desserts",
        description: "Classic baked cheesecake with a creamy texture.",
        details: "A slice of baked cheesecake with a smooth cream-cheese filling.",
        price: 620,
        image: "img/menu/new-york-cheesecake.jpg",
        royalSelection: false
    },
    {
        id: "apple-pie-ice-cream",
        name: "Apple Pie with Ice Cream",
        category: "Desserts",
        description: "Warm apple pie served with a scoop of vanilla ice cream.",
        details: "Baked apple pie with cinnamon apple filling and vanilla ice cream.",
        price: 680,
        image: "img/menu/apple-pie-ice-cream.jpg",
        royalSelection: false
    },
    {
        id: "seasonal-parfait",
        name: "Seasonal Parfait",
        category: "Desserts",
        description: "A layered parfait with cream, fruit, and a sweet topping.",
        details: "Seasonal fruit, ice cream, cream, and a rotating dessert topping.",
        price: 780,
        image: "img/menu/seasonal-parfait.jpg",
        royalSelection: false
    },
    {
        id: "matcha-tiramisu",
        name: "Matcha Tiramisu",
        category: "Desserts",
        description: "Creamy tiramisu with the earthy flavour of Japanese matcha.",
        details: "Layers of mascarpone cream and matcha-soaked sponge, finished with matcha powder.",
        price: 680,
        image: "img/menu/matcha-tiramisu.jpg",
        royalSelection: false
    },
    {
        id: "vanila-swiss-roll",
        name: "Swiss Roll",
        category: "Desserts",
        description: "Soft sponge cake rolled around a light cream filling.",
        details: "A slice of soft rolled sponge cake with a smooth whipped-cream centre.",
        price: 520,
        image: "img/menu/vanila-swiss-roll.jpg",
        royalSelection: false
    },
    {
        id: "cola",
        name: "Cola",
        category: "Drinks",
        description: "Classic chilled cola served over ice.",
        details: "Chilled cola served in a glass with ice.",
        price: 350,
        image: "img/menu/cola.jpg",
        royalSelection: false
    },
    {
        id: "ginger-ale",
        name: "Ginger Ale",
        category: "Drinks",
        description: "A crisp, lightly spiced ginger soda served chilled.",
        details: "Chilled ginger ale served in a glass, with ice on request.",
        price: 350,
        image: "img/menu/ginger-ale.jpg",
        royalSelection: false
    },
    {
        id: "melon-soda",
        name: "Melon Soda",
        category: "Drinks",
        description: "Sweet melon-flavoured soda served cold.",
        details: "Chilled melon soda served over ice.",
        price: 380,
        image: "img/menu/melon-soda.jpg",
        royalSelection: false
    },
    {
        id: "melon-soda-float",
        name: "Melon Soda Float",
        category: "Drinks",
        description: "Melon soda topped with a scoop of vanilla ice cream.",
        details: "Chilled melon soda, vanilla ice cream, and a cherry garnish.",
        price: 550,
        image: "img/menu/melon-soda-float.jpg",
        royalSelection: false
    },
    {
        id: "grape-juice",
        name: "Grape Juice",
        category: "Drinks",
        description: "A chilled glass of sweet grape juice.",
        details: "Grape juice served cold, with ice on request.",
        price: 380,
        image: "img/menu/grape-juice.jpg",
        royalSelection: false
    },
    {
        id: "orange-juice",
        name: "Orange Juice",
        category: "Drinks",
        description: "Refreshing orange juice served chilled.",
        details: "Orange juice served cold, with ice on request.",
        price: 380,
        image: "img/menu/orange-juice.jpg",
        royalSelection: false
    },
    {
        id: "apple-juice",
        name: "Apple Juice",
        category: "Drinks",
        description: "Sweet, refreshing apple juice served chilled.",
        details: "Apple juice served cold, with ice on request.",
        price: 380,
        image: "img/menu/apple-juice.jpg",
        royalSelection: false
    },
    {
        id: "lemon-squash",
        name: "Lemon Squash",
        category: "Drinks",
        description: "A sparkling lemon drink with a bright citrus taste.",
        details: "Lemon syrup and sparkling water served over ice.",
        price: 450,
        image: "img/menu/lemon-squash.jpg",
        royalSelection: false
    },
    {
        id: "iced-tea",
        name: "Iced Tea",
        category: "Drinks",
        description: "Fresh black tea served chilled.",
        details: "Chilled black tea served plain; lemon is available on request.",
        price: 350,
        image: "img/menu/iced-tea.jpg",
        royalSelection: false
    },
    {
        id: "hot-tea",
        name: "Hot Tea",
        category: "Drinks",
        description: "A warm cup of black tea.",
        details: "Black tea served hot with milk or lemon on request.",
        price: 350,
        image: "img/menu/hot-tea.jpg",
        royalSelection: false
    },
    {
        id: "oolong-tea",
        name: "Oolong Tea",
        category: "Drinks",
        description: "A refreshing unsweetened Chinese tea served chilled.",
        details: "Chilled oolong tea with a clean, lightly roasted flavour.",
        price: 350,
        image: "img/menu/oolong-tea.jpg",
        royalSelection: false
    },
    {
        id: "hot-coffee",
        name: "Hot Coffee",
        category: "Drinks",
        description: "Freshly brewed coffee served hot.",
        details: "A cup of hot brewed coffee.",
        price: 400,
        image: "img/menu/hot-coffee.jpg",
        royalSelection: false
    },
    {
        id: "iced-coffee",
        name: "Iced Coffee",
        category: "Drinks",
        description: "Freshly brewed coffee served chilled over ice.",
        details: "Chilled brewed coffee served over ice.",
        price: 400,
        image: "img/menu/iced-coffee.jpg",
        royalSelection: false
    },
    {
        id: "matcha-latte",
        name: "Matcha Latte",
        category: "Drinks",
        description: "Matcha blended with milk for a smooth, earthy drink.",
        details: "Matcha green tea and milk served hot or iced.",
        price: 500,
        image: "img/menu/matcha-latte.jpg",
        royalSelection: false
    },
    {
        id: "draft-beer",
        name: "Draft Beer",
        category: "Drinks",
        description: "A chilled glass of draft beer with a smooth, foamy head.",
        details: "Draft beer served cold in a beer glass.",
        price: 580,
        image: "img/menu/draft-beer.jpg",
        royalSelection: false
    },
    {
        id: "house-wine",
        name: "House Wine",
        category: "Drinks",
        description: "A glass of house wine selected to pair with diner favourites.",
        details: "House red wine served in a standard wine glass.",
        price: 600,
        image: "img/menu/house-wine.jpg",
        royalSelection: false
    },
    {
        id: "whisky-highball",
        name: "Whisky Highball",
        category: "Drinks",
        description: "A refreshing whisky and soda highball served over ice.",
        details: "Whisky and chilled soda water over ice, with a lemon garnish.",
        price: 580,
        image: "img/menu/whisky-highball.jpg",
        royalSelection: false
    }
];
