/* require.config({
    "packages": ["cart", "store"]
});
let data = require('./data.json')
console.log(data) */
var data;
const fetchData = async() => {
    // return await fetch('./src/data.json').then(res => res.json()).then(data => data)

}
let test = Promise.resolve(fetch('./src/data.json').then(res => res.json()))
let test2 = test.then(res => console.log(res))

// console.log(test.then(res => {return res}))
// Promise.resolve(fetchData)
// if(data)

console.log(test2)
data = fetchData()

// console.log(data)