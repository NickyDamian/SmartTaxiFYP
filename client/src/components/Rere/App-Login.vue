<template>
  <v-app>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="login-box">
          <div>

            <v-tabs slot="extension" v-model="model" centered color="primary" slider-color="red" dark icons-and-text>

              <v-tab :href="`#tabLogin`">
                Login
                <v-icon>create </v-icon>
              </v-tab>

              <v-tab :href="`#tabRegister`">
                Register
                <v-icon>person_add</v-icon>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="model">
              <v-tab-item :id="'tabLogin'" class="pt-2">
                <v-flex class="mx-2">
                  <v-text-field label="Email" prepend-icon="create"></v-text-field>
                </v-flex>
                <v-flex class="mx-2 pb-2">
                  <v-text-field :append-icon="showPass ? 'visibility_off' : 'visibility'" :type="showPass ? 'showPass' : 'password'"
                    prepend-icon="vpn_key" hint="Password should be at least 8 characters with alphabets and numerics." label="Password"
                    v-model="password" @click:append="showPass = !showPass"></v-text-field>
                </v-flex>
              </v-tab-item>
              <v-tab-item :id="'tabRegister'">
                <v-card flat>
                  <v-card-text v-text="'kappaPride'"></v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        showPass: false,
        model: 'tab-2',
        show4: false,
        password: null,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match')
        }
      }
    }
  }

</script>

<style>
  .login-box {
    margin-top: 180px
  }

</style>
