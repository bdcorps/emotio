window.onload = function() {
    $(document).ready(function() {
        $("#example-image-2").click(function() {
            $.post("/getstarted", {
                    upl: '/uploads/newapp-icon.png'
                },
                function(data, status) {
                    console.log("Data: " + data + "\nStatus: " + status);
                });
        });
    });


};
