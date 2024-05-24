<template>
  <div class="work-screen-container">
    <div class="work-screen">
      <b-jumbotron class="custom-jumbotron">
        <template #header>
          <h1>Work Screen for <strong>{{ name }}</strong></h1>
        </template>
      </b-jumbotron>
      <h2 class="section-title">Orders</h2>
      <b-button @click="refresh" class="custom-button refresh-button">Refresh</b-button>
      <div class="table-responsive">
        <b-table responsive :items="orders" :fields="fields" class="custom-table">
          <template #cell(operatorId)="cellScope">
            <span v-if="cellScope.value">
              {{ cellScope.value }}
              <b-button @click="updateOrder(cellScope.item._id, 'done')" v-if="cellScope.value === operatorId && cellScope.item.state !== 'done'" class="custom-button action-button">
                Done
              </b-button>
            </span>
            <b-button v-else @click="updateOrder(cellScope.item._id, 'blending')" class="custom-button action-button">
              Start Blending
            </b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { Ingredient, Operator, Order } from "../data";

interface Props {
  operatorId: string
}

const props = withDefaults(defineProps<Props>(), {
  operatorId: "",
})

const operator = ref<Operator | null>(null);
const orders = ref<Order[]>([]);
const name = computed(() => operator.value?.name || props.operatorId);
const possibleIngredients = ref<Ingredient[]>([]);

async function refresh() {
  possibleIngredients.value = await (await fetch("/api/possible-ingredientIds")).json();
  if (props.operatorId) {
    operator.value = await (await fetch("/api/operator/" + encodeURIComponent(props.operatorId))).json();
  }
  orders.value = await (await fetch("/api/orders/")).json();
}

onMounted(refresh);

const fields = ["_id", "customerId", "state", "ice", "sweetness", {
  key: 'ingredientIds',
  label: "ingredients",
  formatter: (value: string[]) => value.map(id => {
    let r = possibleIngredients.value.find(v => v._id == id);
    if (r === undefined) {
      return '';
    } else {
      return r.name;
    }
  }).filter(value => value != "").join(", ")
}, "operatorId"]

async function updateOrder(orderId: string, state: string) {
  await fetch(
    "/api/order/" + encodeURIComponent(orderId), {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ operatorId: props.operatorId, state })
    }
  );
  await refresh();
}
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

.custom-button,
.action-button {
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
  background-color: #009efd;
  color: white;
}

.custom-button:hover,
.action-button:hover {
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

.action-button {
  background-color: #007bff !important;
}

.action-button:hover {
  background-color: #0056b3 !important;
}
</style>