'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// FinAssist APP

// Data
const account1 = {
  owner: 'Aayush Soni',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 3333,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displaymovements = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
               <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displaymovements(account1.movements);

//Calculating balance in FinAssist app
const displaybalance = function (account) {
  labelBalance.innerHTML = '';

  account.balance = account.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  const curbalance = `
  <p class="balance__value">${account.balance}€</p>
  `;
  labelBalance.insertAdjacentHTML('afterbegin', curbalance);
};
// displaybalance(account1.movements);
//Creating username for FinAssist app
const createusername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
createusername(accounts);
//Displaying deposits
const displaysummary = function (account) {
  // labelSumIn.innerHTML = '';
  // labelSumOut.innerHTML = '';
  const filldepo = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const fillwithdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const intrest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * account.interestRate)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${filldepo}€`;
  labelSumOut.textContent = `${Math.abs(fillwithdrawal)}€`;
  labelSumInterest.textContent = `${intrest}€`;
};
// console.log(displaysummary(account1.movements));

//Update UI
const updateui = function (acc) {
  //Diplay movements
  displaymovements(acc.movements);
  //Disply summary of account
  displaysummary(acc);
  //Display balance of account
  displaybalance(acc);
};

//Login credentials
let currentaccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentaccount = accounts.find(
    (currentaccount = acc => acc.username === inputLoginUsername.value)
  );
  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    //display appcontainer
    containerApp.style.opacity = 100;
    //Clear inputfields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Diplay ui and message
    labelWelcome.textContent = `Welcome Back ${
      currentaccount.owner.split(' ')[0]
    }`;
    updateui(currentaccount);
  } else {
    // containerApp.style.opacity = 50;
    alert(`Please check the \nUsername and pin`);
  }
});

//Transfer amount credntials
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveracc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  // console.log(amount, receiveracc);
  if (
    amount > 0 &&
    receiveracc &&
    currentaccount.balance >= amount &&
    receiveracc?.username !== currentaccount.username
  ) {
    // labelBalance.textContent = `${(currentaccount.balance =
    //   currentaccount.balance - amount)}€`;
    currentaccount.movements.push(-amount);
    receiveracc.movements.push(amount);
    updateui(currentaccount);
    // console.log('Transfered');
  }
});

//Request loanamount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanamount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (
    loanamount > 0 &&
    currentaccount.movements.some(mov => mov > loanamount / 10)
  ) {
    currentaccount.movements.push(loanamount);
    updateui(currentaccount);
  } else {
    alert('Have you seen your face in mirror');
  }
});

//Closing an account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentaccount.username &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentaccount.username
    );
    // console.log(index);
    //Delete caccount
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  } else {
    alert('Wrong User');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//Sorting movement in app
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currentaccount.movements, !sorted);
  sorted = !sorted;
});

// const arr = [12, 3, 5, 6, 5];
// console.log(arr.includes(5));

// const arr = [1, 2, 3, 4];
// arr.splice(3, 1);
// console.log(arr);
// console.log(accounts);
// username(account2.owner);

//Coding challange1
/*
const checkdogs = function (dogsjulia, dogskate) {
  const notdog = dogsjulia.splice(1, 2);
  const correctedarray = notdog.concat(dogskate);
  correctedarray.forEach(function (age, i) {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an ault,and is ${age} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};
checkdogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/
//Coding challage 2
// const averageagedogs = function (dogsages) {
//   const humanagedogs = dogsages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age > 18);
//   const avg =
//     humanagedogs.reduce(function (acc, age) {
//       const acc1 = acc + age;
//       return acc1;
//     }, 0) / humanagedogs.length;
//   console.log(humanagedogs);
//   console.log(avg);
//   // const excludeddogs = humanagedogs.filter();
// };

// averageagedogs([5, 2, 4, 1, 15, 8, 3]);

//coding challange 3
// const averageagedogs = function (dogsages) {
//   const humanagedogs = dogsages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return humanagedogs;
// };
// console.log(averageagedogs([5, 2, 4, 1, 15, 8, 3]));

//Coding challange 4
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //1

// dogs.map(function (cur) {
//   cur.recommendedFood = Math.trunc(cur.weight ** 0.75 * 28);
// });
// //2
// console.log(dogs);
// const sarahdog = dogs.find(mov => mov.owners.includes('Sarah'));
// const eating = function (owner) {
//   if (owner) {
//     owner.curFood > owner.recommendedFood;
//     console.log('Eating too much');
//   } else {
//     console.log('Eating too Little');
//   }
// };
// eating(sarahdog);

//3
// const own1 = dogs
//   .filter(mov => mov.curFood > mov.recommendedFood)
//   .map(mov => mov.owners)
//   .flat(2);
// const own2 = dogs
//   .filter(mov => mov.curFood < mov.recommendedFood)
//   .map(mov => mov.owners)
//   .flat(2);
// console.log(own2);
// console.log(own1);
//4
// const str = console.log(`${own1.join(' and ')} Dogs Eats too much `);
// const str1 = console.log(`${own2.join(' and ')} Dogs Eats too Little `);
5;
// console.log(dogs.some(mov => mov.curFood === mov.recommendedFood));
//6
// const eatingokay = dogs.some(
//   mov =>
//     mov.curFood > mov.recommendedFood * 0.9 &&
//     mov.curFood > mov.recommendedFood * 1.1
// );
// console.log(eatingokay);
// //7
// const eatingokayfood = dogs.filter(
//   mov =>
//     mov.curFood > mov.recommendedFood * 0.9 &&
//     mov.curFood > mov.recommendedFood * 1.1
// );
// console.log(eatingokayfood);
//8
// const dogsshallow = dogs.map(mov => mov.recommendedFood);
// dogsshallow.sort((a, b) => a - b);
// console.log(dogsshallow);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movements = [100, 100, 100, 100, 100, 100, 100];
//cahining
// const usdtoeuro = 1.1;
// const totaldeposit = function (movement) {
//   const convert = movement
//     .filter(mov => mov > 0)
//     .map(move => move * `${usdtoeuro}`)
//     .reduce((acc, mov) => acc + mov);
//   return Math.trunc(convert);
// };
// console.log(totaldeposit(movements));
//..............Map method
// const eurotousd = 1.5;
// const usdconersion = movements.map(function (mov) {
//   return mov * eurotousd;
// });
// const usdconersion = movements.map(mov => mov * eurotousd);
// console.log(usdconersion);

// const movementdiscription = [
//   movements.map((mov, i, arr) => {
//     if (mov > 0) {
//       return `Movement ${i + 1} You deposit ${mov}`;
//     } else {
//       return `Movement ${i + 1} You withdrawl ${mov}`;
//     }
//   }),
// ];
// // console.log(...movementdiscription);
// for (let m of movementdiscription) {
//   console.log(m.join('\n'));
// }

//filter
// const withdrawals = movements.filter(function (mov, i) {
//   if (mov < 0) {
//     console.log(` ${i + 1} : ${mov} `);
//   }
// });
// console.log(withdrawals);

//Reduce method
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);
// console.log(balance);
//Maximum value
// const maxvale = movements.reduce(function (acc, mov) {
//   const acc1 = acc > mov ? acc : mov;
//   return acc1;
// }, 0);
// console.log(maxvale);
// const minimumvalue = movements.reduce(function (acc, mov) {
//   const acc1 = acc < mov ? acc : mov;
//   return acc1;
// }, 0);
// console.log(minimumvalue);

//FLt and Flatmap method
// const arr = [[1, 2, 3], [5, 6, 7], 8, 9];
// const accountmovement = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(accountmovement);
// console.log(...[arr]);

//Sorting an array
// const movements1 = [200, 450, 400, 3000, 650, 130, 70, 1300];
// console.log(movements1.sort());
// const arr2 = [200, 450, 400, 3000, 650, 130, 70, 1300];
// console.log(arr2);
// console.log(arr2.sort());
// const arr1 = [500, 600, -900, 200, -300, 600, 4500];
//Ascending Order
// arr1.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(arr1);
//Descending order
// arr1.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(arr1);

//Some more array methods for creating an array programatically not manually
// const x = new Array(7);
// console.log(x);
// const y = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(y.slice(2, 4));
// const z = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(z.splice(2, 4));
// const k = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(k.fill(2, 4, 6));
// const a = Array.from(
//   { length: 5 },
//   (cur, i) => i * (Math.trunc(Math.random() * 100) + 1)
// );
// console.log(a);

//Array from
// labelBalance.addEventListener('click', function () {
//   const movs = Array.from(document.querySelectorAll('.movements__value'));
//   console.log(
//     ...movs.map(
//       (el, i) => `${i + 1} ${Number(el.textContent.replace('€', ''))} \n`
//     )
//   );
// });
/////////////////////////////////////////////////
//sLICE METHOD
// const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 3));

//Find method
// console.log(accounts);
// const find = accounts.find(acc => acc.owner === 'Steven Thomas Williams');
// console.log(find);

// for (let acc of accounts) {
//   if (acc.owner === 'Steven Thomas Williams') console.log(acc);
// }
//Splice method
// arr.splice(1);
// console.log(arr);
// console.log(arr.splice(3));
// console.log(arr.splice(0));
// console.log(arr);
// console.log(arr.slice(1, 3));
// console.log(arr.splice(1, 3));
// console.log(arr);
// console.log(arr.splice(1, 2));
// console.log(arr);

// //.........Foreach method for array
// movements.forEach(function (movement, i, j) {
//   movement =
//     movement > 0
//       ? console.log(` ${i + 1} you deposited ${movement} From (${j})`)
//       : console.log(
//           ` ${i + 1} you withdrarw ${Math.abs(movement)} From (${j})`
//         );
// });

//.....Foreach for maps and sets
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (cur, i, j) {
//   console.log(`Abbrevation for ${cur} is ${i}`);
// });
