requirejs.config({
   baseUrl: 'static/js',
   urlArgs: "dev=" + (new Date()).getTime(),

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