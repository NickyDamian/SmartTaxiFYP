<<template>
  <!-- <v-app>
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
                  <v-card-text v-text="'Login Details'"></v-card-text>
                  <v-text-field 
                  label="Email" 
                  prepend-icon="email"
                  ></v-text-field>
                </v-flex>
                <v-flex class="mx-2 pb-2">
                  <v-text-field 
                  :append-icon="showPass ? 'visibility_off' : 'visibility'" 
                  :type="showPass ? 'showPass' : 'password'"
                  prepend-icon="vpn_key" hint="Password should be at least 8 characters with alphabets and numerics." label="Password"
                  v-model="password" @click:append="showPass = !showPass"></v-text-field>
                </v-flex>
                <v-btn
                        >submit</v-btn>
              </v-tab-item>

              <v-tab-item :id="'tabRegister'" class="pt-2">
                <v-card flat>
                  <v-card-text v-text="'Register Details'"></v-card-text>
                    <v-flex class="mx-2">
                        <v-text-field
                          v-model="name"
                          prepend-icon="person"
                          :rules="rules.emailRules"
                          label="Name"
                          required
                        ></v-text-field>
                        <v-text-field label="Email" 
                          prepend-icon="email"
                          v-model="email"
                          :rules="emailRules"
                        ></v-text-field>
                        <v-text-field 
                          :append-icon="showPass ? 'visibility_off' : 'visibility'" 
                          :type="showPass ? 'showPass' : 'password'"
                          :rules="rules.passwordRules"
                          prepend-icon="vpn_key" hint="Password should be at least 8 characters with alphabets and numerics." 
                          label="Password"
                          v-model="password" @click:append="showPass = !showPass">
                          </v-text-field>
                        <v-btn
                        >submit</v-btn>
                  </v-flex>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app> -->
</template>

<script>
// export default {
//   data(){
//     return{
//       showPass: false,
//       model: 'tab-2',
//       password: null,
//       email: '',
//       rules: {
//           emailRules: [
//             (v) => !!v || 'Email is required',
//             (v) =>
//             /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//             .test(v) || 'Please provide a valid email address'
//           ],
//           passwordRules: [
//             (v) => !!v || 'Password is required',
//             (v) => /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/.test(v) ||
//             'Password should be at least 8 characters with alphabets and numerics.'
//           ]       
//         }
        
//       }
//       }
// }
</script>

<style>
  /* .login-box {
    margin-top: 180px
  } */

</style>



