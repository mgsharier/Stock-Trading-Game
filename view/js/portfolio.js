$("#btn-find-portfolio").click(function(event){
        event.preventDefault();
        let contact_name = $("#find-portfolio-name").val();
        $.ajax({
            url: '/portfolios/' + contact_name,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                console.log(response);
                if (typeof response === 'string' || response instanceof String) {
                    $("#find-out").text(response);
                } else {
                    $("#find-out").text(response.msg); // Adjust according to the actual response structure
                    fillFindContainer(response.data); // Ensure this function exists and can handle the data structure
                }              
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
    