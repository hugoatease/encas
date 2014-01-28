define(['jquery', 'mousetrap'],
    function ($, Mousetrap) {
        var module = {
            current : {
                account_id : undefined, // Current account number
                search_callback: undefined // Callback takes account number as parameter
            },

            reportError : function(data) {
                var alertbar = $("#encasAlert");

                if (data === undefined) {
                    alertbar.css("display", "none");
                    return;
                }

                if (data.error) {
                    alertbar.html("<b>Erreur</b> : " + data.reason);
                    alertbar.show();
                    return true;
                }

                return false;
            },

            reportSuccess : function(message) {
                var noticebar = $("#encasSuccess");
                noticebar.find("#success_message").html("<b>Succès</b> : " + message);
                noticebar.show();
                return true;
            },

            formatDate : function(date) {
                function zeros(number) {
                    if (number < 10) {
                        return '0' + number;
                    }
                    return number;
                }

                var day = date.getDate() + "/" + zeros((date.getMonth() + 1)) + "/" + date.getFullYear();
                var hour = zeros(date.getHours()) + ":" + zeros(date.getMinutes()) + ":" + zeros(date.getSeconds());
                return day + " - " + hour;
            },

            getAccountState : function (balance) {
                var state;

                if (balance < -10) {
                    state = "danger";
                }
                else {
                    if (balance <= 0) {
                        state = "warning";
                    }
                    else {
                        state = "success";
                    }
                }

                return state;
            },

            wait : {
                show : function() {
                    $("#wait").show();
                },

                hide : function () {
                    $("#wait").hide();
                }
            }
        }

        $("#encasSuccess button").click(function(ev) {
            ev.preventDefault();
            $("#encasSuccess").css("display", "none");
        })

        Mousetrap.bind(["g c", "g h"], function(ev) {
            ev.preventDefault();
            window.location.pathname = "/";
        });

        Mousetrap.bind("g a", function(ev) {
            ev.preventDefault();
            window.location.pathname = "/account";
        });

        Mousetrap.bind("g m", function(ev) {
            console.log("Hello");
            ev.preventDefault();
            window.location.pathname = "/admin";
        });

        return module;
    }
);