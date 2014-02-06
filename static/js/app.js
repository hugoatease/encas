requirejs.config({
   baseUrl: 'static/js',

   shim: {
       'mousetrap' : {
           exports: 'Mousetrap'
       },

       'math' : {
           exports : 'mathjs'
       },

       'bootstrap' : {
           deps : ['jquery']
       }
   }
});

requirejs(['main']);
