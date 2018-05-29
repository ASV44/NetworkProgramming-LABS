<template>
    <div class="container">
        <div class="mail-box">
            <app-sidebar :messages="messages" :email="loginData.email"></app-sidebar>
            <app-content :messages="messages" :token="loginData.token"></app-content>
        </div>
    </div>
</template>

<script>
    import Sidebar from './Sidebar.vue'
    import Content from './Content.vue'
    import messages from '../data/messages'
    import randomMessages from '../data/random-messages'
    import { eventBus } from '../main'
    import axios from '../api/axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'

    export default {
        data() {
            return {
                messages: messages,
                loginData: JSON.parse(localStorage.getItem('loginData'))
            };
        },
        created() {
          Vue.use(VueAxios, axios)

          eventBus.$on('refreshMessages', () => {
            let randomIndex = Math.floor(Math.random() * randomMessages.length)
            let temp = [randomMessages[randomIndex]]
            this.messages = temp.concat(this.messages.slice(0))
          })

          eventBus.$on('sentMessage', (data) => {
            let temp = [data.message]
            this.messages = temp.concat(this.messages.slice(0))
          })
        },
        components: {
            appSidebar: Sidebar,
            appContent: Content
        }
    }
</script>
