<script setup>
const messages = ref([
  {
    role: "AI",
    message: "Hello! How can I help you?",
  },
]);
const loading = ref(false);
const message = ref("");

const scrollToEnd = () => {
  setTimeout(() => {
    const chatMessages = document.querySelector(
      ".chat-messages > div:last-child"
    );
    chatMessages?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
};

const sendPrompt = async () => {
  if (message.value === "") return;
  loading.value = true;

  messages.value.push({
    role: "User",
    message: message.value,
  });

  scrollToEnd();
  message.value = "";

  const res = await fetch(`/api/chat`, {
    body: JSON.stringify(messages.value.slice(1)),
    method: "post",
  });

  if (res.status === 200) {
    const response = await res.json();
    messages.value.push({
      role: "AI",
      message: response?.message,
    });
  } else {
    messages.value.push({
      role: "AI",
      message: "Sorry, an error occurred.",
    });
  }

  loading.value = false;
  scrollToEnd();
};
</script>

<template>
  <div class="max-w-xl mx-auto text-black">
    <div class="max-w-xl mx-auto">
      <div
        class="bg-stone-900 rounded-md shadow h-[75vh] flex flex-col justify-between"
      >
        <div class="h-full overflow-auto chat-messages">
          <div
            v-for="(message, i) in messages"
            :key="i"
            class="flex flex-col p-4"
          >
            <div v-if="message.role === 'AI'" class="pr-8 mr-auto">
              <div
                class="p-2 mt-1 text-sm text-gray-700 bg-gray-200 rounded-lg text-smp-2"
              >
                {{ message.message }}
              </div>
            </div>
            <div v-else class="pl-8 ml-auto">
              <div class="p-2 mt-1 text-sm text-white bg-blue-400 rounded-lg">
                {{ message.message }}
              </div>
            </div>
          </div>
          <div class="p-4 ml-10 mr-auto" v-if="loading">
            <span class="loader"></span>
          </div>
        </div>
        <form @submit.prevent="sendPrompt">
          <div class="flex items-center w-full p-4">
            <input
              v-model="message"
              type="text"
              placeholder="Type here..."
              class="w-full p-2 text-sm text-white bg-transparent bg-gray-100 border rounded-md shadow border-white/40 grow"
            />
            <button
              :disabled="loading"
              type="submit"
              class="flex items-center justify-center flex-none w-10 h-10 ml-2 bg-indigo-500 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-white"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                  />
                  <path
                    fill="currentColor"
                    d="M20.25 3.532a1 1 0 0 1 1.183 1.329l-6 15.5a1 1 0 0 1-1.624.362l-3.382-3.235l-1.203 1.202c-.636.636-1.724.186-1.724-.714v-3.288L2.309 9.723a1 1 0 0 1 .442-1.691l17.5-4.5Zm-2.114 4.305l-7.998 6.607l3.97 3.798zm-1.578-1.29L4.991 9.52l3.692 3.53l7.875-6.505Z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-col justify-center w-full my-4">
      <div class="flex items-center justify-center my-2">
        <span>Built with</span>
        <a
          href="https://ai.google.dev/docs/gemini_api_overview"
          class="flex items-center mx-1 font-medium underline transition-colors underline-offset-4 hover:text-black/70"
        >
          <p>Gemini Pro</p>
        </a>
        <span>and</span>
        <a
          href="https://nuxt.com/docs"
          class="flex items-center font-medium underline transition-colors underline-offset-4 hover:text-black/70"
        >
          <img src="" class="h-6 mx-2" />
          <p>Nuxt</p>
        </a>
        .
      </div>
    </div>
  </div>
</template>

<style>
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  position: relative;
  color: #d3d3d3;
  box-sizing: border-box;
  animation: animloader 2s linear infinite;
}

@keyframes animloader {
  0% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
  }

  25% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px;
  }

  50% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px;
  }

  75% {
    box-shadow: 14px 0 0 2px, 38px 0 0 -2px;
  }
}
</style>
