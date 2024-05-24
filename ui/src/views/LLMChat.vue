<template>
  <div class="mx-1 my-1 chat">
    <h1>LLM Chat with <code>{{ model }}</code></h1>
    <b-list-group style="height: calc(100vh - 15rem); overflow-y: auto">

      <transition-group name="list">
        <b-list-group-item v-for="m, i in messages" :key="i" class="d-flex" :class="m.role"
          @click="handleWordClick(m.role,$event)">

          <b-avatar class="mr-3">{{ iconMapping[m.role] }}</b-avatar>
          <div  class="item-content">

            <div v-html="m.content"></div>
            <div v-if="m.generating"><b-icon-three-dots animation="cylon" font-scale="4" v-if="m.generating" />
            </div>


          </div>
        </b-list-group-item>
      </transition-group>
    </b-list-group>
    <b-form-textarea v-model="draft" :disabled="generating" class="mb-3" ref="draftTextArea" />
    <b-button @click="sendMessage">Send</b-button>
  </div>
</template>

<style scoped>
/* based on https://vuejs.org/guide/built-ins/transition-group */
.item-content{
  display: flex;
  flex-direction: row;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-enter-from.user,
.list-leave-to.user {
  transform: translateX(100%);
}

.list-enter-from.assistant,
.list-leave-to.assistant {
  transform: translateX(-100%);
}
</style>

<script setup lang="ts">
import { onMounted, ref,defineProps } from 'vue'
import { generateStream } from '../../utilities'
import {  Ingredient } from "../data"
interface Message {
  role: "user" | "assistant"
  content: string
  generating?: boolean
}

// change the following to use a different model
// see https://ollama.com/library
const model = ref(
  "phi"
  // "mistral:7b-instruct-q2_K"
)
const props=defineProps({
  possibleIngredients:{
    type:Array as () => Ingredient[],
    required:true
  
  }
})
const emit=defineEmits(['wordClick'])
const draft = ref("")
const generating = ref(false)
const messages = ref([] as Message[])
const iconMapping = {
  user: "🧑",
  assistant: "🤖",
}

// set focus to the text area on load
const draftTextArea = ref(null as any)
onMounted(() => draftTextArea.value.focus())

async function sendMessage() {
  generating.value = true

  try {
    let stream: AsyncIterable<string> | null = null

    try {
      // generate by chatgpt
      const words = props.possibleIngredients.map(ingredient => ingredient.name)
      const regex = new RegExp(`(${words.join("|")})`, "gi");
      let text = draft.value;

      draft.value = text.replace(regex, (match: string, p1: string) => {
        console.log(match);
        return `<span class='global-word' data-word='${p1}'>${p1}</span>`;
      })

      messages.value.push({ content: draft.value, role: "user" })
      messages.value.push({ content: "", role: "assistant", generating: true })
  
      const response = await fetch(
        "/api/chat", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model.value,
            messages: messages.value,
          })
        }
      )

      stream = await generateStream(response)
      draft.value = ""
    } catch (e) {
      alert(`Error! Are you sure you ran \`ollama pull ${model.value}\` first?\n\n${e}`)
      messages.value.pop()
      return
    }

    for await (const chunk of stream) {
      for (const s of chunk.split("\n")) {
        if (s.trim().length === 0) {
          continue
        }
        console.log("chunk", s)
        messages.value[messages.value.length - 1].content += JSON.parse(s).message.content
      }
    }
    messages.value[messages.value.length - 1].generating = false
  } finally {
    generating.value = false
  }
}


async function handleWordClick(_role: string,event: MouseEvent) {
  const target = event.target as HTMLElement;


  if (target.classList.contains('global-word')) {
    const wordName = target.getAttribute('data-word');
    if (wordName) {
      emit('wordClick',wordName);
      console.log(`Clicked on ${wordName}`);
    }
  }

}
</script>