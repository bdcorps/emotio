window.onload = function() {
    $(document).ready(function() {

        $(".thumbnail").click(function(event) {
            console.log(event.target.id);
            $("#image-url").val($("#" + event.target.id).attr('src'));
            $("#submit").click();
        });

        $("#headliner").addClass('hide');
        $("#headliner").addClass('show');
    });


};
