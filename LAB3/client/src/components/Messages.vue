<template>
    <table v-if="messages.length > 0" class="table table-inbox table-hover">
        <tbody>
            <tr v-for="message in messages" @click="openMessage(message)" :class="{ unread: typeof message.isRead !== 'undefined' && !message.isRead }">
                <td><input type="checkbox"></td>
                <td>
                    <a href="#" v-if="typeof message.isImportant !== 'undefined'" @click.prevent.stop="message.isImportant = !message.isImportant">
                        <i :class="['fa', 'fa-star', { important: message.isImportant }]"></i>
                    </a>
                </td>
                <td>{{ message.from.value[0].name }}</td>
                <td>{{ message.subject }}</td>
                <td><i v-if="message.attachments.length > 0"></i>{{message.attachments.length}}</td>
                <td class="text-right">{{ getDate(message.date) }}</td>
            </tr>
        </tbody>
    </table>

    <p v-else>No messages here yet.</p>
</template>

<script>
    import { eventBus } from '../main'
    import moment from 'moment'

    export default {
        props: {
            messages: {
                type: Array,
                required: true
            }
        },
        methods: {
            openMessage(message) {
                eventBus.$emit('changeView', {
                    tag: 'app-view-message',
                    title: message.subject,
                    data: {
                        message: message
                    }
                });
            },
            getDate(date) {
              return moment(date).fromNow()
            },
            preview(message) {
              return message.split('.')[0]
            }
        }
    }
</script>
