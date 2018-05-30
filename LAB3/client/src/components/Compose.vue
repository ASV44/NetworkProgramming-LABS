<template>
  <form novalidate class="md-layout" @submit.prevent="validateEmailForm">
    <md-card class="md-layout-item md-size-100 md-small-size-100">
      <md-card-header>
        <div class="md-title">Send Email</div>
        <span class='error-message'>{{errorMessage}}</span>
        <span v-if="emailSent" class='success-message'>Email Succesfully Sent</span>
      </md-card-header>

      <md-card-content>
        <md-field :class="getValidationClass('toEmailAddresses')">
          <label for="to-email-addresses">To:</label>
          <md-input name="to-email-addresses" id="to-email-addresses" autocomplete="email-addresses" v-model="form.toEmailAddresses" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.toEmailAddresses.required">At least 1 email address is required</span>
          <span class="md-error" v-if="$v.form.toEmailAddresses.required && !$v.form.toEmailAddresses.emailListValidator">Email address should be comma separated in valid format e.g john@example.com, doe@example.com</span>
        </md-field>

        <md-field :class="getValidationClass('ccEmailAddresses')">
          <label for="cc-email-addresses">Cc:</label>
          <md-input name="cc-email-addresses" id="cc-email-addresses" autocomplete="cc-email-addresses" v-model="form.ccEmailAddresses" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.ccEmailAddresses.emailListValidator">Email address should be comma separated in valid format e.g john@example.com, doe@example.com</span>
        </md-field>

        <md-field :class="getValidationClass('subject')">
          <label for="subject">Subject:</label>
          <md-input name="subject" id="subject" autocomplete="subject" v-model="form.subject" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.subject.required">Subject is required</span>
        </md-field>

        <md-field :class="getValidationClass('emailText')">
          <label for="emailText">Email Body:</label>
          <md-textarea rows="20" cols="100" name="emailText" id="emailText" autocomplete="email-body" v-model="form.emailText" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.emailText.required">Email body is required</span>
        </md-field>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <div class="send-email-btn">
          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">Send Email</md-button>
          </md-card-actions>
       </div>

        <input type="file" id="file" name="file" @change="addAttachment($event)">

        <md-snackbar :md-active.sync="emailSent">Email was successfully sent!</md-snackbar>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {emailList} from '../validators/emailList'

import {
  required
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      toEmailAddresses: null,
      ccEmailAddresses: null,
      subject: null,
      emailText: null
    },
    emailSent: false,
    sending: false,
    errorMessage: null
  }),
  validations: {
    form: {
      toEmailAddresses: {
        required,
        emailList
      },
      ccEmailAddresses: {
        emailList
      },
      bccEmailAddresses: {
        emailList
      },
      subject: {
        required
      },
      emailText: {
        required
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },

    clearForm () {
      this.$v.$reset()
      this.form.toEmailAddresses = null
      this.form.ccEmailAddresses = null
      this.form.subject = null
      this.form.emailText = null
    },

    validateEmailForm () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.sendEmail()
      }
    },

    sendEmail() {
      this.$http.post('/send', this.form)
                .then(response => this.onEmailSent())
                .catch(error => {
                  console.log(error)
                  this.onEmailError()
                })
    },

    onEmailSent() {
      this.emailSent = true
      this.sending = false
      this.errorMessage = null
      this.clearForm()
    },

    onEmailError() {
      this.emailSent = false
      this.sending = false
      this.errorMessage = 'Error occured while sending email. Please try again!'
    },

    addAttachment(event) {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.form.attachments = [{
          filename: event.target.files[0].name,
          content: e.target.result
        }]
      }
      reader.readAsText(event.target.files[0])
    },

    toBuffer(ab) {
      let buf = new Buffer(ab.byteLength)
      let view = new Uint8Array(ab)
      view.forEach((item, position) => {
        buf[position] = item
      })
      return buf
    }
  }
}
</script>

<style scoped>
  .error-message {
    color: red;
  }
  .success-message {
    color: green;
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
