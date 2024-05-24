import { MongoClient } from 'mongodb'
import {Operator, Customer, Ingredient} from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const operators: Operator[] = [
  {
    _id: "jim",
    name: "Jim",
    password: "123456", 
  },
  {
    _id: "mary",
    name: "Mary",
    password: "123456",
  },
]

const customers: Customer[] = [
  {
    _id: "alice",
    name: "Alice",
    password: "123456",
  },
  {
    _id: "bob",
    name: "Bob",
    password: "123456",
  },
]

const ingredients: Ingredient[] = [
  { _id: "i1", name: "Banana", cost: 1 },
{ _id: "i2", name: "Strawberry", cost: 3 },
{ _id: "i3", name: "Blueberry", cost: 4 },
{ _id: "i4", name: "Mango", cost: 2 },
{ _id: "i5", name: "Pineapple", cost: 3 },
{ _id: "i6", name: "Spinach", cost: 2 },
{ _id: "i7", name: "Kale", cost: 3 },
{ _id: "i8", name: "Almond Milk", cost: 4 },
{ _id: "i9", name: "Greek Yogurt", cost: 3 },
{ _id: "i10", name: "Honey", cost: 2 }
  ];

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  db.collection("orders").createIndex(
    { customerId: 1 }, 
    { unique: true, partialFilterExpression: { state: "draft" } }
  )

  // add data
  console.log("inserting customers", await db.collection("customers").insertMany(customers as any))
  console.log("inserting operators", await db.collection("operators").insertMany(operators as any))
  console.log("inserting ingredients", await db.collection("possibleIngredients").insertMany(ingredients as any))

  process.exit(0)
}

main()
