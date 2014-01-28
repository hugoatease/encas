define(['jquery', 'encasapi', 'common', 'mousetrap'],
    function($, api, common, Mousetrap) {
        var module = {
            showAccount : function(number) {
                function refresh(data) {
                    if (common.reportError(data)) {
                        return;
                    }

                    var data = data.data;

                    $("#accountNumber").html(data.number);
                    $("#name").html(data.lastname + " " + data.firstname);
                    $("#year").html(data.promo);

                    common.current.account_id = data.id;
                    if (common.current.search_callback !== undefined) {
                        common.current.search_callback(data.id);
                    }
                }

                api.account.getByNumber(refresh, number);
            },

            getAccount : function() {
                var number = $("#accountNumberInput").val();
                module.showAccount(number);
            },

            searchAccountByName : function() {
                var name = $("#searchByNameForm #nameInput").val();
                var results = $("#search_name_box table tbody");

                function refresh(data) {
                    function done(number) {
                        module.showAccount(number);
                        module.boxes.name.hide();
                        results.children().remove();
                    }

                    function retrieve(ev) {
                        ev.preventDefault();
                        var target = $(ev.target);
                        var number = target.closest("tr").find(".account_number:first()").html();
                        done(number);
                    }

                    if (common.reportError(data)) {
                        return;
                    }

                    results.children().remove();

                    var data = data.data;

                    if (data.length === 1) {
                        done(data[0].number);
                    }

                    for (var i=0; i < data.length; i++) {
                        var account = data[i];
                        var line = $("<tr>").appendTo(results);

                        $("<td>").addClass("account_number").html(account.number).appendTo(line);
                        $("<td>").html(account.firstname).appendTo(line);
                        $("<td>").html(account.lastname).appendTo(line);
                        $("<td>").html(account.promo).appendTo(line);

                        line.click(retrieve);
                    }
                }

                api.account.search(refresh, name);
            },

            boxes : {
                number : {
                    visible: false,

                    show : function() {
                        this.visible = true;
                        $("#search_number_box").css("display", "block");
                        $("#search_number_box #accountNumberInput").focus();
                    },

                    hide : function() {
                        this.visible = false;
                        $("#search_number_box").css("display", "none");
                        $("#search_number_box #accountNumberInput").val("");
                    }
                },

                name : {
                    visible: false,

                    show : function() {
                        this.visible = true;
                        $("#search_name_box").css("display", "block");
                        $("#searchByNameForm #nameInput").focus();
                    },

                    hide : function() {
                        this.visible = false;
                        $("#search_name_box").css("display", "none");
                        $("#searchByNameForm #nameInput").val("");
                    }
                },

                click : function(btnName) {
                    var active, inactive;

                    switch (btnName) {
                        case "number": active = this.number; inactive = this.name; break;
                        case "name": active = this.name; inactive = this.number; break;
                    }

                    if (inactive.visible) {
                        inactive.hide();
                    }

                    if (!active.visible) {
                        active.show();
                    }
                    else {
                        active.hide();
                    }
                }
            }


        };

        $("#searchByIDForm").submit(function(ev) {
            ev.preventDefault();
            if ($("#search_number_box #accountNumberInput").val() !== '') {
                module.getAccount();
                module.boxes.number.hide();
            }
        });

        $("#searchByNameForm").submit(function(ev) {
            ev.preventDefault();
            if ($("#searchByNameForm #nameInput").val() !== '') {
                module.searchAccountByName();
            }
        });

        $("#search_nb").click(function(ev) {
            ev.preventDefault();
            module.boxes.click("number");
        });

        $("#search_name").click(function(ev) {
            ev.preventDefault();
            module.boxes.click("name");
        });

        $("#searchByNameForm #nameInput").keyup(function(ev) {
            if ($("#searchByNameForm #nameInput").val().length > 2) {
                module.searchAccountByName();
            }
        });

        Mousetrap.bind('o', function(ev) {
            ev.preventDefault();
            module.boxes.click("number");
        })

        Mousetrap.bind('p', function(ev) {
            ev.preventDefault();
            module.boxes.click("name");
        })

        return module;
    }
);