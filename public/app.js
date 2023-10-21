const input = document.querySelector('#username');
const enter = document.querySelector('button');
const userz = document.querySelector('.userz');
const users = [];

function validateString(arr) {
    // This function checks if string has spaces.
    for (let char of arr) {
        if (char === ' ') {
            // console.log('char === space:', char === ' ')
            return [];
        }
    }
    return arr;
}

enter.addEventListener('click', (event)=>{
    
    // console.log('input.value', input.value);
    let newInput = input.value;
    let wordCheck = newInput.split('');

    wordCheck = validateString(wordCheck);

    if (wordCheck.length > 0
        && users.includes(newInput) === false) {
        users.push(newInput);
        const user = document.createElement('div');
        user.textContent = newInput;
        userz.appendChild(user);
        
        // console.log('users', users);
    } else {
        if (users.includes(newInput)) {
            console.log('Name already taken.')
        }
        if (wordCheck.length === 0) {
            console.log("No spaces, and don't leave it blank.")
        }
    }

    input.value = '';
})

// fetch('/').then((response)=>{
//     return response;
// })
// .then((users)=>{
//     for (let user of users) {
//         document.body.append(user.name)
//     }
// })

fetch('/users').then((response)=>{
    return response.json();
})
.then((users)=>{
    for (let user of users) {
        document.body.append(user.name)
    }
})