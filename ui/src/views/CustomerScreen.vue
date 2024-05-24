<template>
  <div class="main-container">
    <div class="customer">
      <div class="content">
        <b-jumbotron class="custom-jumbotron">
          <template #header>
            <h1>Welcome, {{ name }}</h1>
          </template>
        </b-jumbotron>

        <div class="button-group">
          <b-button class="custom-button refresh-button" @click="refresh">Refresh</b-button>
          <RouterLink :to="{ path: `/history/${customerId}` }">
            <b-button class="custom-button history-button">History Order</b-button>
          </RouterLink>
        </div>

        <h2 class="section-title">Preset</h2>
        <div class="button-group">
          <b-button
            class="custom-button preset-button"
            v-for="drink in drinkNames"
            :key="drink"
            @click="selectDrink(drink)"
          >
            {{ drink }}
          </b-button>
        </div>

        <h2 class="section-title">Draft Order</h2>
        <p class="bold-text">Check the ingredients you want:</p>
        <div class="card-group">
          <div
            v-for="ig in possibleIngredients"
            :key="ig['_id']"
            class="ingredient-card"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span class="ingredient-name"><b>{{ ig.name }}</b></span>
              <b-button
                class="custom-button ingredient-button"
                @click="onAddIngredients(ig['name'])"
              >
                Add
              </b-button>
            </div>
          </div>
        </div>

        <div>
          <b-form-group>
            <template #label>
              <strong class="text-danger">Ice Level</strong>
            </template>
            <b-form-spinbutton v-model="ice" :min="0" :max="100" :step="25" class="custom-button"></b-form-spinbutton>
          </b-form-group>
          <b-form-group>
            <template #label>
              <strong class="text-danger">Sweetness Level</strong>
            </template>
            <b-form-spinbutton v-model="sweetness" :min="0" :max="100" :step="25" class="custom-button"></b-form-spinbutton>
          </b-form-group>
        </div>

        <h2 class="section-title">List of Added Ingredients:</h2>
        <div class="button-group">
          <b-badge
            v-for="ig in selectedIngredients"
            :key="ig['_id']"
            variant="primary"
            class="ingredient-button"
          >
            {{ ig.name }}
            <b-button
              class="custom-button remove-button"
              @click="onRemoveIngredients(ig['_id'])"
            >
              &times;
            </b-button>
          </b-badge>
        </div>

        <div class="button-group">
          <b-button class="custom-button save-button" @click="save">Save</b-button>
          <b-button
            class="custom-button submit-button"
            @click="showSubmit"
          >
            Submit
          </b-button>
        </div>
        <div class="note bold-red-note">Note: must save before submitting</div>
      </div>
      <!-- <div class="sidebar">
        <LLMChat
          :possibleIngredients="possibleIngredients"
          @wordClick="onAddIngredients"
        ></LLMChat>
      </div> -->
    </div>
  </div>

  <b-modal v-model="showDialog" title="Submit" class="custom-jumbotron">
    <div>
      <b-table
        responsive
        :items="selectedIngredients"
        :fields="sumbitTableFields"
        class="custom-button"
      ></b-table>
    </div>

    <p>Ice: {{ ice }}%</p>
    <p>Sweetness: {{ sweetness }}%</p>
    <p class="total-cost">Total Price: {{ totalPrice }}</p>

    <template #modal-footer>
      <b-button
        variant="secondary"
        @click="showDialog = false"
        class="custom-button close-button"
      >
        Close
      </b-button>
      <b-button
        variant="primary"
        @click="submit"
        class="custom-button submit-button"
      >
        Submit
      </b-button>
    </template>
  </b-modal>
</template>


<script setup lang="ts">
import {onMounted, ref, computed, Ref} from 'vue'
import { CustomerWithOrders, Ingredient, DrinkIngredients } from "../data"
import { BvTableFieldArray } from "bootstrap-vue";
// import LLMChat from './LLMChat.vue';


// props
interface Props {
  customerId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer: Ref<CustomerWithOrders | null> = ref(null)

const name = computed(() => customer.value?.name || props.customerId)
const possibleIngredients: Ref<Ingredient[]> = ref([])
const selectedIngredients: Ref<Ingredient[]> = ref([])
// The name of the default ingredient
const drinkNames: Ref<string[]> = ref(["Milk Tea", "Juice"]);

// Preset drink ingredients
const drinkIngredients: Ref<DrinkIngredients> = ref({});
// Dialog display
const showDialog = ref(false)
// Sweetness
const sweetness = ref(50)
// Ice level
const ice = ref(50)
const sumbitTableFields: Ref<BvTableFieldArray> = ref([
  {
    key: '_id'
  },
  {
    key: 'name'
  },
  {
    key: 'cost'
  },
 
])
  // generate by chatgpt
  const totalPrice: Ref<number> = computed(() => {
  return selectedIngredients.value.reduce((total, ingredient) => {
  
    return total + (ingredient.cost || 0);
  }, 0);
});



async function refresh() {
  selectedIngredients.value = []  
  const result = await (await fetch("/api/possible-ingredientIds")).json()
  console.log(result);
  
  possibleIngredients.value = result
  console.log(getRandomCombinations(result, 2));
  drinkNames.value.forEach((name) => {
    const data= getRandomCombinations(result, 2);
    console.log(name,data);
    
    drinkIngredients.value[name] = result.filter((ig: { _id: string; }) => data.includes(ig._id) );
  });

  console.log(drinkIngredients.value);
  
 
}
onMounted(refresh)

async function save() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredientIds: selectedIngredients.value.map(ig => ig._id), sweetness: sweetness.value, ice: ice.value})
    }
  )
}

async function submit() {
 
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
  showDialog.value = false
}
const showSubmit=()=>{
  showDialog.value = true
}
// generate by chatgpt
const onAddIngredients = (name: string) => {
  console.log(possibleIngredients.value);
  
  const ingredient = possibleIngredients.value.find(ig => ig.name === name);
  if (ingredient === undefined) {
    return;
  }
  selectedIngredients.value.push({ ...ingredient });
}

const onRemoveIngredients = (_id:String)=>{
  const index = selectedIngredients.value.findIndex(ig => ig._id === _id)
  if(index === -1){
    return
  }
  selectedIngredients.value.splice(index, 1)
}
// Randomly select count combinations from the original data, each combination contains a name and corresponding ID
const getRandomCombinations = (data: Ingredient[], count:number) =>{
  const selected = [];
  while (selected.length < count) {
    const randomIndex = Math.floor(Math.random() * data.length);
    selected.push( data[randomIndex]._id);
  }
  return selected;
}
const selectDrink=(drink:string)=>{


  selectedIngredients.value = [...selectedIngredients.value,  ...drinkIngredients.value[drink]  ]

}
</script>

<style scoped>
.main-container {
  background-color: rgba(255, 255, 255, 0.85); /* White with 85% opacity */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: auto;
  max-width: 1200px; /* Adjust based on layout needs */
}

.customer {
  display: flex;
  flex-direction: row;
}

.content,
.sidebar {
  flex: 1;
  padding: 20px;
}

.custom-jumbotron {
  background: linear-gradient(135deg, #009efd, #FF69B4);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #007bff;
}

.button-group,
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.ingredient-name {
  margin-right: 20px;
}

.ingredient-button,
.custom-button {
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
  transform: scale(1.0);
  background-color: #009efd;
  color: white;
}

.ingredient-button:hover,
.custom-button:hover {
  transform: scale(1.05);
  background-color: #FF69B4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.refresh-button,
.save-button {
  background-color: #4CAF50;
}

.history-button,
.submit-button {
  background-color: #FFC107;
}

.ingredient-card {
  transition: transform 0.2s ease-in-out;
  width: calc(40% - 30px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ingredient-card:hover {
  transform: scale(1.05);
}

.remove-button {
  background-color: #dc3545 !important;
}

.close-button {
  background-color: #6c757d !important;
}

.bold-text {
  font-weight: bold;
}

.bold-red-note {
  font-weight: bold;
  color: red; /* Or use a specific shade of red if you have a color palette */
}

@media (max-width: 768px) {
  .ingredient-card {
    width: calc(50% - 10px);
  }

  .customer {
    flex-direction: column;
  }

  .content, .sidebar {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .ingredient-card {
    width: 100%;
  }
}
</style>
