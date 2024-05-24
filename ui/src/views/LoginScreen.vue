<template>
  <div class="main-container">
    <div class="login-container">
      <b-jumbotron class="custom-jumbotron">
        <template #header>
          <h1 class="text-center">Bubble Tea Bliss</h1>
        </template>
      </b-jumbotron>
      
      <b-alert :variant="variant" :show="showMessage">{{ message }}</b-alert>

      <b-card class="custom-card">
        <b-form @submit.prevent="handleLogin">
          <b-form-group label="Name" label-for="name-input">
            <b-form-input id="name-input" v-model="name" type="text" required autofocus></b-form-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password-input">
            <b-form-input id="password-input" v-model="password" type="password" required></b-form-input>
          </b-form-group>
          <b-form-group label="Identity">
            <b-form-radio-group v-model="identity" name="identity">
              <b-form-radio value="operator">Operator</b-form-radio>
              <b-form-radio value="customer">Customer</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-button type="submit" variant="primary" block class="custom-button login-button">Login</b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const name = ref('');
const password = ref('');
const identity = ref('operator');
const showMessage = ref(false);
const message = ref('');
const variant = ref('danger');

const handleLogin = async () => {
  const res = await (await fetch("/api/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name.value, password: password.value, identity: identity.value }),
  })).json()

  if (res.status === "success") {
    showMessage.value = true;
    message.value = res.message;
    variant.value = "success";
    setTimeout(() => {
      showMessage.value = false;
      router.push(`/${res.userType}/${name.value}`);
    }, 1000);
  } else {
    showMessage.value = true;
    message.value = res.message;
    setTimeout(() => {
      showMessage.value = false;
    }, 3000);
  }
};
</script>

<style scoped>
.main-container {
  background-color: rgba(255, 255, 255, 0.85); /* White with 85% opacity */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 50px auto; /* Adjust top margin and center horizontally */
  max-width: 600px; /* Container width, adjust as needed */
}

.login-container {
  padding: 20px;
}

.custom-jumbotron {
  background: linear-gradient(135deg, #009efd, #FF69B4);
  color: white;
  border-radius: 10px;
  margin-bottom: 20px;
}

.custom-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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

.login-button {
  background-color: #4CAF50; /* Green for login to highlight the primary action */
}
</style>

