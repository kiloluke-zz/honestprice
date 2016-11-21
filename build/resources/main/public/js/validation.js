$('#salePrice').keypress(function () {
    if (isNaN($(this).val())) {
        if ($(this).val().length > 1) {
            $(this).val($(this).val().substr(0, $(this).val().length - 1));
        } else {
            $(this).val('');
        }

    }
});