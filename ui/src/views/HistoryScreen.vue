<template>
  <div class="work-screen-container">
    <div class="work-screen">
      <b-jumbotron class="custom-jumbotron">
        <template #header>
          <!-- <h1>Work Screen {{ name }}</h1> -->
        </template>
      </b-jumbotron>
      <h2 class="section-title">Orders</h2>
      <b-button @click="refresh" class="custom-button refresh-button">Refresh</b-button>
      <div v-if="customer" class="table-responsive">
        <b-table responsive :items="customer.orders" :fields="customerOrderHeaders" class="custom-table"></b-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CustomerWithOrders, Ingredient } from "../data";

interface Props {
  customerId: string
}

const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer = ref<CustomerWithOrders | null>(null);
const possibleIngredients = ref<Ingredient[]>([]);
const customerOrderHeaders = ref([
  { key: '_id' },
  { key: 'state' },
  { key: 'operatorId' },
  { key: 'customerId' },
  { key: 'ice' },
  { key: 'sweetness' },
  { 
    key: 'ingredientIds',
    label: 'Ingredients',
    formatter: (value: string[]) => value.map(id => possibleIngredients.value.find(v => v._id === id)?.name || '').filter(v => v !== "").join(", ")
  }
]);

async function refresh() {
  try {
    const ingredients = await fetch("/api/possible-ingredientIds");
    possibleIngredients.value = await ingredients.json();
    const customerData = await fetch("/api/customer/" + encodeURIComponent(props.customerId));
    customer.value = await customerData.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

onMounted(refresh);
</script>

<style scoped>
.work-screen-container {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.work-screen {
  margin: 10px;
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

.custom-button {
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
  background-color: #009efd;
  color: white;
}

.custom-button:hover {
  transform: scale(1.05);
  background-color: #FF69B4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.refresh-button {
  background-color: #4CAF50;
}

.table-responsive {
  margin-top: 20px;
}

.custom-table {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>