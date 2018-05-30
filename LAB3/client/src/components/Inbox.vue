<template>
    <div class="inbox-body">
        <div class="mail-option">
            <div class="btn-group">
                <a class="btn" @click="refresh">
                    <i class="fa fa-refresh"></i>&nbsp; Refresh
                </a>
            </div>
            <div class="email-nav-btn">
              <a class="btn" @click="olderEmails">
                <i class="fa fa-chevron-left" style="font-size:24px;color:black"></i>
              </a>
              <a class="btn" @click="newerEmails">
                <i class="fa fa-chevron-right" style="font-size:24px;color:black"></i>
              </a>
          </div>
        </div>

        <app-messages :messages="this.messages" v-if="!refreshing"></app-messages>
        <half-circle-spinner class="email-spinner" v-if="refreshing"
          :animation-duration="1000"
          :size="100"
          :color="'#ff1d5e'"
        />

    </div>
</template>

<script>
    import { eventBus } from '../main'
    import Messages from './Messages.vue'
    import {HalfCircleSpinner} from 'epic-spinners'

    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        data() {
          return {
            messages: [],
            page: 1,
            refreshing: true
          }
        },
        created() {
          this.refresh()
        },
        methods: {
            refresh() {
              this.refreshing = true
              this.$http.get('/inbox?page=' + this.page)
                        .then(response => {
                          console.log(response.data)
                          this.refreshing = false
                          this.messages = response.data.inbox.reverse()
                        })
                        .catch(error => console.log(error))
            },

            newerEmails() {
              this.page += 1
              this.refresh()
            },

            olderEmails() {
              if(this.page > 1) {
                this.page -= 1
                this.refresh()
              }
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
            appMessages: Messages,
            HalfCircleSpinner
        }
    }
</script>
