const data = [
    [ 'age > 30 ', ' installed_days < 5' ],
    [ 'age > 18 ', ' installed_days < 5' ],
    [ 'age > 14 ', ' installed_days < 7' ],
    [ 'age > 21 ', ' installed_days < 7' ],
]

const da =  [ 'age < 21 ', ' installed_days < 7' ]
// for (const condition of da) {
//     // Use a regular expression to extract the numeric value
//     const match = condition.match(">");
//     console.log(match);
//     // Check if a match was found
//     if (match) {
//       const value = match[0]; // The first matching group is the numeric value
//       console.log(value); // This will print '30' and '5' respectively
//     }
//   }

if(da[0].includes("<")){
    console.log(parseInt(da[0].split("<")[1]))
    console.log((da[0].split("<")[0]))

}



// let validOffer = []
// if(rule[0].includes(">")){
//     // console.log(parseInt(rule[0].split(">")[1]))
//     console.log(parseInt(rule[0].split(">")[1]))
//     if()

// }else{
//     // console.log(parseInt(rule[0].split("<")[1]))
//     console.log(parseInt(rule[0].split("<")[1]))

// }
  

  
  
// parseInt(rule[0].split(">")[1])
  
