<template>
  <v-app>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$router.push({name: 'login'})">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>System Information</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="showPriceDialog(),getPrice()">
        <v-icon>attach_money</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
        <v-form ref="searchForm">
      <v-text-field v-show="!detailsFound" class="mx-2 pb-2" :rules="rules.emailRules" hint="Ensure it a valid email address." prepend-icon="email" label="Email" v-model="email"></v-text-field>
      <v-text-field v-show="detailsFound" class="mx-2 pb-2" :rules="rules.emailRules" hint="Ensure it a valid email address." prepend-icon="email" label="Email" v-model="email" readonly></v-text-field>
      <v-btn class="mb-2" color="primary" @click="searchForm()">
        <v-icon class="pr-2">search</v-icon> Search
      </v-btn>
      <v-divider></v-divider>
        </v-form>
    </v-card>
    <v-card v-if="detailsFound" class="mb-2" height="auto">
      <v-form ref="form1">
        <v-container grid-list-xl>
          <v-layout v-bind="binding">
            <v-flex>
              <v-text-field :rules="rules.nameRules" hint="Ensure it is not empty." prepend-icon="person" label="First Name"
                v-model="firstName" color="accent"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field :rules="rules.nameRules" hint="Ensure it is not empty." prepend-icon="person" label="Last Name"
                v-model="lastName" color="accent"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout v-bind="binding">
            <v-flex>
              <v-text-field :rules="rules.phoneRules" hint="Ensure it is a valid Malaysian phone number." prepend-icon="phone"
                label="Phone Number" v-model="phoneNumber" color="accent"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field :rules="rules.dobRules" prepend-icon="cake" hint="Ensure it is in the format of day/month/year. eg. 01/11/2001"
                label="Date of Birth" v-model="dateOfBirth" color="accent"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-btn class="mb-2" color="primary" @click="submit1()">
        <v-icon class="pr-2">search</v-icon> Update
      </v-btn>
      <v-btn class="mb-2" flat color="primary" @click="detailsFound = false">
        <v-icon class="pr-2">arrow_back</v-icon> back
      </v-btn>
    </v-card>
    <v-card v-if="priceDialog" class="mb-2" height="auto">
      <v-form ref="form2">
        <v-container grid-list-xl>
          <v-layout v-bind="binding">
            <v-flex>
              <v-text-field :rules="rules.priceRules" hint="Ensure it contains two decimal places." prepend-icon="attach_money"
                label="Price in MYR" v-model="price" color="accent"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-btn class="mb-2" color="primary" @click="submit2()">
        <v-icon class="pr-2">search</v-icon> Update
      </v-btn>
    </v-card>
    <v-dialog persistent v-model="updateDialog" width="500">
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Update Successful
        </v-card-title>

        <v-card-text>
          {{dialogtext}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="updateDialog = false, detailsFound = false, priceDialog = false ">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :left="x === 'left'" :multi-line="mode === 'multi-line'"
      :right="x === 'right'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn color="red" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import PriceService from '@/services/PriceService'
  export default {
    data() {
      return {
          updateDialog: false,
          dialogtext: null,
          detailsFound: false,
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        price: null,
        priceDialog: false,
        text: "User does not exist. Please try again!",
        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        rules: {
          firstNameMatch: () => ('The first name you entered is invalid.'),
          nameRules: [
            (v) => !!v || 'Name is required.',
            (v) => v.length >= 0 || 'Ensure it is not empty.'
          ],
          phoneRules: [
            (v) => !!v || 'Phone is required.',
            (v) => /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/.test(v) || 'Phone number must be valid. eg. 012*******'
          ],
          priceRules: [
            (v) => !!v || 'Price is required.',
            (v) => /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/.test(v) || 'Price must be a valid number. eg. 5.00'
          ],
          dobRules: [
            (v) => !!v || 'Date of Birth is required.',
            (v) => /^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[0-2])\1(?:19|20)\d\d$/.test(v) ||
            'Date of birth must be valid. eg. 01/11/2001'
          ],
          emailRules: [
            (v) => !!v || 'Email is required',
            (v) =>
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(v) || 'Please provide a valid email address'
          ]
        }
      }
    },
    computed: {
      binding() {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndDown) binding.column = true

        return binding
      }
    },
    methods: {
      showPriceDialog() {
        if (this.priceDialog == false) {
          this.priceDialog = true
        } else {
          this.priceDialog = false
        }
      },
      searchForm() {
        if (this.$refs.searchForm.validate()) {
          this.findDetails()
        }
      },
      submit1() {
        if (this.$refs.form1.validate()) {
          this.updateDetails()
        }
      },
      submit2() {
        if (this.$refs.form2.validate()) {
          this.updatePrice()
        }
        },
        async findDetails() {
            try {
          var request = await AuthenticationService.findDetails({
            email: this.email
          })
            this.firstName = request.data.details.firstname
            this.lastName = request.data.details.lastname
            this.dateOfBirth = request.data.details.dob
            this.phoneNumber = request.data.details.phonenumber
            this.detailsFound = true
        } catch (error) {
          this.error = error
          this.snackbar = true
          this.email = ''
        }
        },
        async updateDetails() {
            try {
          var request = await AuthenticationService.updateDetails({
            email: this.email,
            firstname: this.firstName,
            lastname: this.lastName,
            phonenumber: this.phoneNumber,
            dob: this.dateOfBirth
          })
            this.updateDialog = true
            this.dialogtext = 'User details has been successfully updated!'
        } catch (error) {
          this.error = error
        }
        },
        async getPrice() {
            try {
          var request = await PriceService.index()
          x = (request.data.price/100).toFixed(2)
          this.price = request.data.price
        } catch (error) {
          this.error = error
        }
        },
        async updatePrice() {
            try {
                var x = this.price * 100
          var request = await PriceService.post({
            price: x
          })
            this.updateDialog = true
            this.dialogtext = 'Fare rate has been successfully updated!'
        } catch (error) {
          this.error = error
        }
        }
    }
  }

</script>

<style>

</style>
