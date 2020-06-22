import React, {useState, useEffect} from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import Alert from './components/Alert';
import { v4 as uuidv4 } from 'uuid';

//useEffect lets perform side effects
//runs after every render
//first parameter - callback function (runs after render)
//second parameter - array - for letting react know when to run useEffect
//react re-renders when state has changed or props

// const initialExpenses = [
//   {id: uuidv4(), charge:'rent', amount: 1600},
//   {id: uuidv4(), charge:'car payment', amount: 400},
//   {id: uuidv4(), charge:'credit card bill', amount: 1200}

// ];
// console.log(initialExpenses);
const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) :[];

//import useState()
//function returns array [] with two values
// value--the actual value of the state
//value--function for updates/control
//default value

function App() {
  // console.log(useState());
  // const result = useState(initialExpenses);
  // const expenses = result[0];
  // const setExpenses = result[0];
  // console.log(expenses, setExpenses);
//**********************state values************************* */
//all expenses , add expenses
  const [expenses, setExpenses] = useState(initialExpenses);
  // console.log(expenses);
  //single expense
  const [charge , setCharge] = useState("");

  //single amount
  const[amount, setAmount] = useState('');

  //alert
  const [alert, setAlert] = useState({show: false})

  //edit
  const [edit, setEdit] = useState(false)

  //edit item
  const [id, setId] =  useState(0);
  // ****************useEffect ********************************
  useEffect(() => {
    console.log('we called useEffect');
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  //*******************functionality************ */
  //handle charge
const handleCharge = e => {
  // console.log(`charge: ${e.target.value}`);
  setCharge(e.target.value )
}

//handle amount
const handleAmount = e => {
  // console.log(`amount: ${e.target.value}`)
  setAmount(e.target.value)
}

//handle alert
const handleAlert  = ({type, text}) => {
  setAlert({show: true, type, text});
  setTimeout(() => {
    setAlert({show: false})
  }, 3000)
};


//clear all items
const clearItems = () => {
  // console.log('cleared all items');
  setExpenses([]);
  handleAlert({type: 'danger', text: 'all items deleted'})
};


//handle delete  item
const handleDelete  = (id) => {
  // console.log(`item deleted : ${id}`)
  let tempExpenses = expenses.filter(item =>  item.id !== id );
  // console.log(tempExpenses);
  setExpenses(tempExpenses);
  handleDelete({type: 'danger' , text: 'item deleted'});
}


//handle edit  item
const handleEdit  = (id) => {
  // console.log(`item edited : ${id}`)
  let expense = expenses.find(item => item.id === id);
  // console.log(expense)
  let {charge, amount} = expense;
  setCharge(charge);
  setAmount(amount);
  setEdit(true);
  setId(id);
}


//handle submit

const handleSubmit = e => {
  e.preventDefault();
  // console.log(charge,amount);
  if(charge !== '' && amount > 0){
    //check the current state 
    if(edit) {
      let tempExpenses = expenses.map(item => {
        return item.id === id ? {...item, charge, amount}: item 
      });
      setExpenses(tempExpenses);
      setEdit(false);
      handleAlert({type: 'success' , text: 'item edited'})

    }else {
      const singleExpense = {id: uuidv4(), charge , amount};
      setExpenses([...expenses, singleExpense])      //...prevExpense, newExpense
      handleAlert({type: 'success' , text: 'item added'})
    }
    
    setCharge('');   //initialize
    setAmount('');  //initialize 
  }else {
    //handle alert called
    handleAlert({type: 'danger', text:`charge can't be empty value and 
    amount value has to be bigger than zero`})
  }
}



  
  return (
    <>
      {alert.show && <Alert type={alert.type} type={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className = "App">
      <ExpenseForm 
      charge={charge} 
      amount={amount} 
      handleAmount={handleAmount}
      handleCharge={handleCharge}
      handleSubmit = {handleSubmit}
      edit ={edit}
      />
      <ExpenseList expenses= {expenses} 
      handleDelete = {handleDelete}
      handleEdit = {handleEdit}
      clearItems = {clearItems}/>

      </main>
      <h1>
        total spending: <span className="total">
          $ {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          },0)}
        </span>
      </h1>
      </>
  );
}

export default App;
