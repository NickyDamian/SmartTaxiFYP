<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap class="pt-5">
        <v-flex xs12 md12 lg12 class="pb-2">
            <img class="logo" src="..\assets\img\GrabLogo.png" style="width:204px; height:79px; padding-bottom:10px;">
        </v-flex>
        <v-flex xs12 md12 lg12 class="pt-5" >
            <h1 class="font-weight-black.font-italic"> WELCOME </h1>
        </v-flex>        
        <v-flex xs12 md12 lg12 class="pt-3">
            <div class="inputWithIcon">
                <input class="textbox" placeholder="Email" />
                <div class="icon">
                    <font-awesome-icon icon="envelope" />
                </div>                
            </div>           
        </v-flex>
        <v-flex xs12 md12 lg12>
            <div class="password-textbox">
                <div class="inputWithIcon">
                    <input class="textbox" type=password placeholder="Password" />
                        <div class="icon">
                            <font-awesome-icon icon="lock" />
                        </div>                    
                </div>                
            </div>            
        </v-flex>
        <v-flex xs12 offset-xs6 md8 offset-md3 lg12 offset-lg3>
            <div class="forget-password">
                <a href="#">Forgot Password?</a>
            </div>            
        </v-flex>
        <v-flex xs12 md12 lg12 class="pt-3">
            <div class="sign-in">
                <a class="sign-in-button" @click="navigateTo({name: 'menu'})">SIGN IN</a>
            </div>            
        </v-flex>
        <v-flex xs12 md12 lg12>
            <div class="register">
                <div class="register-label">
                    <label> Don't have an account? </label><br>
                </div>
                <div id="register-btn">                
                    <a @click="navigateTo({name: 'register'})">Let's Create One</a>
                </div>
            </div>           
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    methods: {
      navigateTo(route) {
        this.$router.push(route)
      }
    }
  }

</script>

<style scoped>
    .forget-password {
        padding-top: 4px;
    }
    h1 {
        font-weight: 300;
        letter-spacing: 1px;
        color:#afafaf;
    }
    label {
        font-weight: 300;
    }
    .register {
        padding-top: 70px;
    }
    #register-btn {
        font-weight: 300;
        color:red;
    }
    a {
        font-weight: 300;
        text-decoration: none;
        color: #00a950; 
    }    
    .password-textbox {
        margin-top: -2.4%;
    }
    .inputWithIcon{
        position:relative;
    } 
    .icon{
        position:absolute;
        left:0;
        top:8px;
        padding:2px 9%;
        color:#aaa;
        transition:.3s;
    }
    .sign-in-button{
        border:1px solid #8bcf54;
        -webkit-box-shadow: #B4B5B5 3px 3px 3px  ;
        -moz-box-shadow: #B4B5B5 3px 3px 3px ; 
        box-shadow: #B4B5B5 3px 3px 3px  ; 
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 20px;
        font-size:14px; 
        padding: 13px 40%; 
        text-decoration:none; 
        display:inline-block;
        font-weight: 400; 
        color: #FFFFFF;
        background-color: #00a950; 
        background-image: -webkit-gradient(linear, left top, left bottom, from(#00cc60), to(#00a950));
    }
    .textbox {
        width: 75%;
        display: inline-block;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        padding: 10px 3% 10px 12%;
        border: 1px solid #b7b7b7;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        font-weight: 300;
        /* font: normal 16px/normal BrandonL, Times, serif; */
        color: rgba(0,0,0,1);
        -o-text-overflow: clip;
        text-overflow: clip;
        background: rgba(252,252,252,1);
        -webkit-box-shadow: 0 0 0 -6px rgba(0,0,0,0.2) inset;
        box-shadow: 0 0 0 -6px rgba(0,0,0,0.2) inset;
        text-shadow: 1px 1px 0 rgba(255,255,255,0.66) ;
        -webkit-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
        -moz-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
        -o-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
        transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
    }
    @media (min-width: 960px)  and  (max-width: 2000px){
        .register {
            padding-top: 150px;
        }
        .password-textbox {
            margin-top: -8px;
        }
        .inputWithIcon{
            position:relative;
        } 
        .icon{
            position:absolute;
            left:0;
            top:8px;
            padding:2px 0 2px 35%;
            color:#aaa;
            transition:.3s;
        }
        .textbox {
           width: 26%;
           padding: 10px 3% 10px 4%;
        }
        .sign-in-button{
            padding: 13px 183px;
        }      
    }
</style>


