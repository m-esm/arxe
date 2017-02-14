$(document).ready(function () {

    $('#resetPw').click(function () {

        swal({
            title: "Change Password",
            text: "Write new password",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "new password",
            inputType: 'password'
        },
            function (inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false;
                }

                $.post('/api/account/reset_pw', {
                    newPass: inputValue
                }).done(function (res) {

                    swal({
                        title: 'password changed !',
                        type: 'success'
                    });

                    }).fail(function () {
                    swal({
                        title: 'something went wrong !',
                        type: 'error'
                    });
                });

            });

    });

    $('input.money-input').inputmask("decimal", {
        radixPoint: ",",
        autoGroup: true,
        groupSeparator: ",",
        groupSize: 3,
        autoUnmask: true,
        rightAlign: false
    });

    $(":input").inputmask();


    $("input.shamsi-mask").inputmask('shamsi');
    $("input.time-mask").inputmask('hh:mm');

    $("input.datepicker").datepicker({
        isRTL: false,
        dateFormat: "yy/m/d"
    });

});


$(function () {
    $('#side-menu').metisMenu();
});



//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function () {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});
