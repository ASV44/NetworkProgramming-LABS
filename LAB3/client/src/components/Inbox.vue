<template>
    <div class="inbox-body">
        <div class="mail-option">
            <div class="btn-group">
                <a href="#" class="btn" @click="refresh">
                    <i class="fa fa-refresh"></i>&nbsp; Refresh
                </a>
            </div>
        </div>

        <app-messages :messages="this.messages"></app-messages>
    </div>
</template>

<script>
    import { eventBus } from '../main';
    import Messages from './Messages.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        data() {
          return {
            messages: []
          }
        },
        created() {
          this.$http.get('/inbox')
                    .then(response => {
                      console.log(response.data)
                      this.messages = response.data.inbox.reverse()
                    })
                    .catch(error => console.log(error))
        },
        methods: {
            refresh() {
                eventBus.$emit('refreshMessages');
            }
        },
        computed: {
            incomingMessages() {
                return this.data.messages.filter(function(message) {
                    return (message.type == 'incoming' && !message.isDeleted);
                });
            }
        },
        components: {
            appMessages: Messages
        }
    }
</script>
