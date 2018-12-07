
# PROJECT NAME
Recipeasy
---

Name: Jordan Mess

Date: 12/7/18

Project Topic: A crowdsourced recipe application allowing users to interact and segment different recipe data

URL: https://mysterious-inlet-20264.herokuapp.com/

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: name       `Type: String
- `Field 2`: meal       `Type: String
- `Field 3`: author     `Type: String
- `Field 4`: diffLevel       `Type: String
- `Field 5`: ingredients        `Type: [String]
- `Field 5`: servSize       `Type: Number
- `Field 5`: time        `Type: Number



Schema: 
```javascript
 name: {
        type: String,
        required: true
    },
    meal: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'dessert'],
        required: true
    },
    author: {
        type: String,
        required: true
    },
    diffLevel: {
        type: String,
        enum: ['easy', 'med', 'hard'],
        required: true
    },
    ingredients: [String],
    time: {
        formType: Number,
    },
    servSize: {
        type: Number,
        required: true
    }
```

### 2. Add New Data

HTML form route: /add

POST endpoint route: `/api/recipe`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/recipe',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'spaghetti',
        meal: 'dinner',
        author: 'jordanmess',
        diffLevel: 'easy',
        ingredients: ["pasta","sauce"],
        time: 30,
        servSize: 4
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/recipes`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Add -> `  /add  `
2. Search by Ingredient -> `  /ing  `
3. Random Recipe -> `  /random  `
4. Quick n' Easy -> `  /easy  `
5. Search by Meal -> `  /meal/:mt  `
   a) breakfast -> `/meal/breakfast
   a) lunch -> `/meal/breakfast
   a) dinner -> `/meal/breakfast
   a) dessert -> `/meal/breakfast

