<template>
  <div class="smoothie-status-container">
    <b-jumbotron class="custom-jumbotron">
      <template #header>
        <h1>Smoothie Status</h1>
      </template>
    </b-jumbotron>

    <b-button @click="refresh" class="custom-button refresh-button">Refresh</b-button>
    
    <div class="table-responsive">
      <b-table :items="orders" :fields="customerOrderHeaders" class="custom-table"></b-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Ingredient, Order } from "../data";

const orders = ref<Order[]>([]);
const possibleIngredients = ref<Ingredient[]>([]);

const customerOrderHeaders = ref([
  { key: '_id' },
  { key: 'state' },
  { key: 'operatorId' },
  { key: 'customerId' },
  {
    key: 'ingredientIds',
    label: 'Ingredients',
    formatter: (value: string[]) => value.map(id => {
      let r = possibleIngredients.value.find(v => v._id == id);
      return r ? r.name : '';
    }).filter(name => name !== "").join(", ")
  }
]);

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredientIds")).json();
  orders.value = await (await fetch("/api/orders")).json();
}

onMounted(refresh);
</script>

<style scoped>
.smoothie-status-container {
  margin: 10px;
  max-width: 800px;
}

.custom-jumbotron {
  background: linear-gradient(135deg, #009efd, #FF69B4);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.custom-button {
  background-color: #009efd;
  color: white;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
}

.custom-button:hover {
  transform: scale(1.05);
  background-color: #FF69B4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.refresh-button {
  background-color: #4CAF50; /* Using a green color to signify refreshing as a positive, safe action */
}

.table-responsive {
  margin-top: 20px;
}

.custom-table {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
