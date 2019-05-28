angular.module('starter')

.controller('LoginCtrl', function($state, $interval, RequestService, RolService,UsuarioService, RecordarUsuarioService,$ionicLoading) {
  let th = this;
  let rol=-1;
  let usuarioCorrecto = false;
  let prueba = 'Prueba';
  th.cookies ='';
  th.plataformaMovil = ionic.Platform.isIOS() || ionic.Platform.isAndroid();

  th.loginData = {
    email: '',
    password: ''
  };

  th.stopLoading = function(){
    $ionicLoading.hide();
  }

//  th.decode = atob(th.loginData.password);


//Almacena los creedeciales cifrados en las cookies
  th.setCookie = function() {
    RecordarUsuarioService.setCookie(th.loginData);
    th.getCookie();
  }
  //cooca las cookies en los respectivos campos
  th.getCookie = function() {
    th.cookies = RecordarUsuarioService.getCookie();
    th.loginData.email=th.cookies.email;
    th.loginData.password=th.cookies.contrasena;
    if(th.cookies != 0){
      th.recordar = true;
    }
  };


  th.doLogin = function(){
    $ionicLoading.show({
      templateUrl: 'common/loading.html',
      scope: th
    });

     th.data = {
       data : th.loginData,
       method : 'POST',
       url:'/usuarios/login'
      };
     RequestService.httpRequest(th.data, function(result) {
        console.log(result);
        let token = result.data.id;
        if(result.status==200){
            th.data = {
              method: 'GET',
              url: '/usuarios/'+result.data.userId
            }
            RequestService.httpRequest(th.data, function(result) {
              $ionicLoading.hide();
              if(result.status==200){
                let usuarioLogueado = result.data;
                usuarioLogueado.auth = true;
                usuarioLogueado.token = token;
                RolService.setRol(result.data.rol);
                UsuarioService.setUsuario(usuarioLogueado);
                th.usuarioCorrecto = false;
                if(th.recordar==true){
                  th.setCookie();
                }
                else{

                  RecordarUsuarioService.removeCookies();

                }

                if(th.plataformaMovil){

                  $state.go('homeMobile.principal');
                }
                else {

                  $state.go('homeWeb.principal');
                }
              }
              else{
                // Error al obtener datos del usuario logueado

              }

            });
        }
        else{
          $ionicLoading.hide();
          th.usuarioCorrecto=true;
        }
      });
    };

th.forgotPass = function(){
  $state.go('olvide-contrasena');
};

th.getCookie();


});
