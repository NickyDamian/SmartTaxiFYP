<template>
  <v-app>
    <v-toolbar color=primary dark>
      <v-btn icon @click="navigateTo({name: 'login'})">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Registration :3</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <div class="description">
      <h1>Let's get started!</h1>
      <p>Our registration process is both quick and simple.</p>
      <p>Please fill up all the relevant details before proceeding. Thank you.</p>
    </div>

    <v-stepper v-model="e6" vertical class="stepper-content">
      <v-stepper-step :complete="e6 > 1" step="1">
        User Account Details
        <small class="stepper-summary">Keeping track of your information.</small>
      </v-stepper-step>

      <v-stepper-content step="1">

        <v-card class="mb-2" height="auto">
          <v-form ref="form1">
            <v-container grid-list-xl>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field :rules="rules.nameRules" hint="Ensure it is not empty." prepend-icon="person" label="First Name" v-model="firstName"
                    color="accent"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field :rules="rules.nameRules" hint="Ensure it is not empty." prepend-icon="person" label="Last Name" v-model="lastName"
                    color="accent"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field :rules="rules.phoneRules" hint="Ensure it is a valid Malaysian phone number." prepend-icon="phone" label="Phone Number"
                    v-model="phoneNumber" color="accent"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field :rules="rules.dobRules" prepend-icon="cake" hint="Ensure it is in the format of day/month/year. eg. 01/11/2001"
                    label="Date of Birth" v-model="dateOfBirth" color="accent"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-select v-model="select" disable :items="items" label="Type of user" prepend-icon="person"></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>

        <v-btn color="primary" @click="submit1">Continue</v-btn>
        <v-btn flat @click="clear1">Clear</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2" class="stepper-content">
        Email and Password
        <small class="stepper-summary">Your login details.</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-2" height="auto">
          <v-form ref="form2">
            <v-container grid-list-xl>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field :rules="rules.emailRules" hint="That email does not seem right or email already exists. Please try again."
                    prepend-icon="email" label="Email" v-model="emailAddress" color="accent"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field :rules="rules.passwordRules" :append-icon="showPass ? 'visibility_off' : 'visibility'" :type="showPass ? 'showPass' : 'password'"
                    prepend-icon="vpn_key" hint="Password should be at least 8 characters with alphabets and numerics." label="Password"
                    v-model="password" color="accent" @click:append="showPass = !showPass"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field :rules="rules.secondPasswordRules" :append-icon="showPass ? 'visibility_off' : 'visibility'" :type="showPass ? 'showPass' : 'password'"
                    hint="Ensure it matches your first password." prepend-icon="lock" label="Confirm Password" v-model="secondPassword"
                    color="accent" @click:append="showPass = !showPass"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>

        <v-btn color="primary" @click="submit2">Continue</v-btn>
        <v-btn color="secondary" @click="e6 = 1">Back</v-btn>
        <v-btn flat @click="clear2">Clear</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3" class="stepper-content">
        Confirmation
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              <v-list three-line>
                <p class="subheading font-weight-bold confirmation-title">Please ensure all your details are correct before proceeding.</p>
                <!--Email-->
                <v-divider :inset="true">
                </v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>home</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Email</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.emailAddress}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--Password-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>lock</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Password</v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{this.password.substring(0,2) + "********"}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--First Name-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>person</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>First Name</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.firstName}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--Last Name-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>person</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Last Name</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.lastName}} </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--Phone Number-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>phone</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Phone Number</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.phoneNumber}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--Date Of Birth-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>cake</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Date Of Birth</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.dateOfBirth}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!--Type of User-->
                <v-divider :inset="true"></v-divider>

                <v-list-tile>
                  <v-list-tile>
                    <v-icon>person</v-icon>
                  </v-list-tile>

                  <v-list-tile-content>
                    <v-list-tile-title>Type of User</v-list-tile-title>
                    <v-list-tile-sub-title>{{this.select}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-btn color="primary" @click="dialog = true">Continue</v-btn>
        <v-btn flat @click="e6 = 2">Back</v-btn>
      </v-stepper-content>
    </v-stepper>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="success-notice primary" primary-title>
          Successful Registration
        </v-card-title>

        <v-card-text>
          Thank you for registering with Smart Taxi application. We will now redirect you the login page for you to sign in and start
          using the application. We hope that we have made your transportation process a much more pleasurable one :3
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false, navigateTo({name: 'login'})">
            Back To Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        select: 'Passenger',
        items: [
          'Passenger',
          'Driver',
        ],
        dialog: false,
        // snackbar: true,
        // timeout: 6000,
        showPass: false,
        e6: 1,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        emailAddress: '',
        password: '',
        secondPassword: '',
        rules: {
          firstNameMatch: () => ('The first name you entered is invalid.'),
          nameRules: [
            (v) => !!v || 'Name is required.',
            (v) => v.length >= 1 || 'Ensure it is not empty.'
          ],
          phoneRules: [
            (v) => !!v || 'Phone is required.',
            (v) => /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/.test(v) || 'Phone number must be valid. eg. 012*******'
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
          ],
          passwordRules: [
            (v) => !!v || 'Password is required',
            (v) => /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/.test(v) ||
            'Password should be at least 8 characters with alphabets and numerics.'
          ],
          secondPasswordRules: [
            (v) => !!v || 'Re-enter password is required',
            (v) => v == this.password || 'Passwords must match'
          ],
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
      // async register () {
      //   try {
      //     await AuthenticationService.register({
      //       email: this.email,
      //       password: this.password
      //     })
      //   } catch (error) {
      //     this.error = error.response.data.error
      //   }
      // },
      navigateTo(route) {
        this.$router.push(route)
      },
      submit1() {
        if (this.$refs.form1.validate()) {
          this.e6 = 2
        }
      },
      submit2() {
        if (this.$refs.form2.validate()) {
          this.e6 = 3
        }
      },
      clear1() {
        this.firstName = '',
          this.lastName = '',
          this.phoneNumber = '',
          this.dateOfBirth = ''
          this.select = 'Passenger'
      },
      clear2() {
        this.emailAddress = '',
          this.password = '',
          this.secondPassword = ''
      }
    }
  }

</script>

<style scoped>
  .description h1 {
    font-weight: 400;
    font-size: 40px;
  }

  .description p {
    font-weight: 300;
    font-size: 18px;
    line-height: 1;
  }

  .stepper-header {
    background-color: #43a047;
  }

  .stepper-summary {
    font-weight: 400;
  }

  .stepper-content {
    margin-left: -8px;
  }

  .stepper-list {
    margin-left: -1px;
  }

  .success-notice {
    color: white;
    font-size: 20px;
  }

</style>
